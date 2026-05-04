'use server';
/**
 * @fileOverview Flujo de IA para la asistente OFELIA (DRTPE Lima).
 * Implementa una arquitectura RAG con prioridad en conocimiento local y búsqueda web restringida.
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
 * Restringe estrictamente a dominios .gob.pe
 */
const searchGovernmentInfo = ai.defineTool(
  {
    name: 'buscarEnPortalesEstado',
    description: 'Busca información legal o administrativa en portales oficiales del gobierno peruano (.gob.pe).',
    inputSchema: z.object({
      query: z.string().describe('Término de búsqueda específico.'),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    // Nota: En producción esto conectaría con una API de búsqueda (Google/Serper)
    // Para el prototipo, simulamos el filtro estricto.
    console.log(`[Ofelia-RAG] Realizando búsqueda restringida: ${input.query} site:gob.pe`);
    return `Información simulada de gob.pe sobre: ${input.query}. (Filtro activo: solo fuentes oficiales del MTPE, SUNAT, SUNARP o PRODUCE).`;
  }
);

/**
 * HERRAMIENTA: Consulta de Base de Conocimiento Local
 * Simula el acceso a la carpeta /knowledge
 */
const consultInternalKnowledge = ai.defineTool(
  {
    name: 'consultarBaseConocimiento',
    description: 'Consulta los manuales internos de DPPR, REMYPE y SUNAFIL indexados en la base de datos vectorial.',
    inputSchema: z.object({
      topic: z.string().describe('El tema técnico a consultar (ej. REMYPE, despidos, formalización).'),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    console.log(`[Ofelia-RAG] Consultando vectores locales para: ${input.topic}`);
    return `Resumen técnico de los archivos de conocimiento sobre ${input.topic}. (Prioridad Local DPPR/REMYPE confirmada).`;
  }
);

const prompt = ai.definePrompt({
  name: 'ofeliaChatPrompt',
  input: { schema: OfeliaChatInputSchema },
  output: { schema: OfeliaChatOutputSchema },
  tools: [searchGovernmentInfo, consultInternalKnowledge],
  system: `Eres OFELIA, una Asistente Técnica de la Dirección Regional de Trabajo y Promoción del Empleo (DRTPE) de Lima Metropolitana. 

REGLAS ESTRICTAS DE RESPUESTA:
1. IDENTIDAD: Tu tono es profesional, técnico y orientado al servicio ciudadano peruano.
2. ESTRATEGIA RAG:
   - PRIMERO: Consulta la herramienta 'consultarBaseConocimiento' para temas de la DPPR, REMYPE o SUNAFIL.
   - SEGUNDO: Usa 'buscarEnPortalesEstado' solo si la información es dinámica o no está en la base local.
3. FILTRO GUBERNAMENTAL: Solo citas información de dominios .gob.pe. Si no encuentras información oficial, indica que el usuario debe agendar una asesoría presencial con un especialista de la DRTPE.
4. CONTEXTO TÉCNICO: Si se mencionan procesos, explícalos paso a paso siguiendo la lógica institucional.
5. NO ALUCINAR: Si no tienes el dato exacto en el conocimiento local o portales .gob.pe, admite la limitación y recomienda la asistencia física.

Contexto actual del usuario: {{{context}}}`,
  prompt: `Historial de chat:
{{#each history}}
{{role}}: {{{content}}}
{{/each}}

Usuario: {{{message}}}
OFELIA:`,
});

export async function ofeliaChat(input: OfeliaChatInput): Promise<OfeliaChatOutput> {
  const { output } = await prompt(input);
  return output!;
}
