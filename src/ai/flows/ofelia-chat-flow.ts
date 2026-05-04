'use server';
/**
 * @fileOverview Flujo de IA para la asistente OFELIA (DRTPE Lima).
 * Implementa una arquitectura RAG con prioridad en conocimiento local y búsqueda web restringida a dominios .gob.pe.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Esquemas de entrada y salida
const OfeliaChatInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model', 'system']),
    content: z.string(),
  })).optional(),
  message: z.string().describe('El mensaje actual del usuario.'),
  context: z.string().optional().describe('Contexto de la ruta del usuario (idea/active/domestic).'),
});

export type OfeliaChatInput = z.infer<typeof OfeliaChatInputSchema>;

const OfeliaChatOutputSchema = z.object({
  text: z.string().describe('La respuesta de la asistente.'),
  sources: z.array(z.string()).optional().describe('Fuentes consultadas.'),
});

export type OfeliaChatOutput = z.infer<typeof OfeliaChatOutputSchema>;

/**
 * HERRAMIENTA: Búsqueda Web Inteligente (Filtro Gubernamental)
 * Simula la recuperación de datos dinámicos de portales .gob.pe
 */
const searchGovernmentInfo = ai.defineTool(
  {
    name: 'buscarEnPortalesEstado',
    description: 'Busca información legal o administrativa actualizada en portales oficiales del gobierno peruano (ej. SUNAT, SUNARP, MTPE, PRODUCE). Solo devuelve información de sitios .gob.pe.',
    inputSchema: z.object({
      query: z.string().describe('Término de búsqueda técnica o administrativa.'),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    // En un entorno de producción real, aquí se integraría una API de búsqueda como Serper o Google Search
    // con el parámetro "site:gob.pe". 
    console.log(`[Ofelia-Search] Consultando fuentes oficiales para: ${input.query}`);
    
    // Simulamos una respuesta estructurada que el LLM procesará
    return `RESULTADO DE BÚSQUEDA EN PORTAL.GOB.PE:
    - Fuente: Ministerio de Trabajo (MTPE).
    - Tema: ${input.query}.
    - Estado: Vigente al 2024.
    - Detalle técnico: Los procesos administrativos de formalización requieren cumplimiento de la Ley N° 30056 y normativas vigentes de la DRTPE. 
    - Recomendación: Verificar siempre la vigencia del RUC y el estado del domicilio fiscal antes de cualquier trámite en la DRTPE Lima.`;
  }
);

/**
 * HERRAMIENTA: Consulta de Base de Conocimiento Local
 * Simula el acceso a la carpeta /knowledge indexada.
 */
const consultInternalKnowledge = ai.defineTool(
  {
    name: 'consultarBaseConocimiento',
    description: 'Consulta los manuales técnicos internos de la DPPR, REMYPE y SUNAFIL sobre procesos de formalización.',
    inputSchema: z.object({
      topic: z.string().describe('El tema técnico a consultar (ej. REMYPE, despidos, formalización).'),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    console.log(`[Ofelia-Internal] Recuperando documentos locales para: ${input.topic}`);
    return `KNOWLEDGE-BASE-ID-4592:
    - Documento: Manual de Procedimientos DPPR-2024.
    - Contenido: El registro en el REMYPE es obligatorio para acceder a beneficios laborales de la Micro y Pequeña Empresa. 
    - Requisitos: RUC activo, Clave SOL y al menos un trabajador registrado en el T-Registro de SUNAT.`;
  }
);

/**
 * Prompt definido para OFELIA
 */
const prompt = ai.definePrompt({
  name: 'ofeliaChatPrompt',
  input: { schema: OfeliaChatInputSchema },
  output: { schema: OfeliaChatOutputSchema },
  tools: [searchGovernmentInfo, consultInternalKnowledge],
  system: `Eres OFELIA, una Asistente Técnica experta de la Dirección Regional de Trabajo y Promoción del Empleo (DRTPE) de Lima Metropolitana. 

REGLAS DE ORO DE RESPUESTA:
1. IDENTIDAD: Tono institucional, profesional, técnico pero accesible para el ciudadano peruano.
2. ESTRATEGIA RAG (Generación Aumentada por Recuperación):
   - PRIORIDAD 1: Usa 'consultarBaseConocimiento' para procesos internos de la DRTPE, REMYPE o SUNAFIL.
   - PRIORIDAD 2: Usa 'buscarEnPortalesEstado' solo si la información es dinámica o requiere validación externa (SUNAT/SUNARP).
3. VALIDEZ LEGAL: Solo cita o basa tus respuestas en fuentes de dominios .gob.pe. No inventes procedimientos.
4. MANEJO DE ERRORES: Si no encuentras la información oficial en las herramientas, admite la limitación y recomienda una asesoría presencial en la sede central de la DRTPE Lima.
5. CONTEXTO DEL USUARIO: Considera que el usuario está en la ruta: {{{context}}}.

Contexto actual del sistema: Estamos operando bajo la jurisdicción de Lima Metropolitana.`,
  prompt: `Historial de conversación:
{{#each history}}
{{role}}: {{{content}}}
{{/each}}

Mensaje actual del usuario: {{{message}}}
Respuesta de OFELIA:`,
});

/**
 * Función principal del flujo que llama al modelo con las herramientas configuradas.
 */
export async function ofeliaChat(input: OfeliaChatInput): Promise<OfeliaChatOutput> {
  try {
    const { output } = await prompt(input);
    
    if (!output) {
      throw new Error("El sistema de IA no generó una respuesta válida.");
    }

    return output;
  } catch (error) {
    console.error("Error en el flujo ofeliaChat:", error);
    // Devolvemos un objeto de salida incluso en error para que el componente lo maneje
    return {
      text: "Lo siento, estoy experimentando una alta demanda de consultas técnicas sobre procesos de la DRTPE. Por favor, intenta formular tu pregunta de nuevo o solicita una asesoría presencial.",
      sources: ["Error de conexión interna"]
    };
  }
}
