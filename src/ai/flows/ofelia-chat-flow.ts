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
 * Se activa si la información local es insuficiente.
 */
const searchGovernmentInfo = ai.defineTool(
  {
    name: 'buscarEnPortalesEstado',
    description: 'Busca información técnica, legal o administrativa en portales oficiales de Perú (SUNAT, MTPE, PRODUCE, SUNARP, INDECOPI, etc.). Úsala OBLIGATORIAMENTE si la información no está en la base local o si necesitas datos actualizados.',
    inputSchema: z.object({
      query: z.string().describe('Término de búsqueda técnica o administrativa.'),
      entidad: z.string().optional().describe('Entidad específica a consultar (ej. SUNARP).'),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    console.log(`[Ofelia-Agent] Ejecutando búsqueda web oficial para: ${input.query} en ${input.entidad || 'Portales .gob.pe'}`);
    
    // Simulación de resultados enriquecidos de portales estatales
    const mockData: Record<string, string> = {
      "SUNAT": "Los contribuyentes bajo el Régimen MYPE Tributario pagan una tasa de 10% sobre la renta neta hasta 15 UIT. Es obligatorio el uso de comprobantes electrónicos.",
      "SUNARP": "La reserva de nombre tiene una vigencia de 30 días calendario. El proceso de inscripción de S.A.C. requiere escritura pública firmada por notario.",
      "MTPE": "El registro en el REMYPE es un trámite gratuito y virtual. Permite acceder a beneficios laborales de la Ley MYPE.",
      "INDECOPI": "El registro de marca protege tu signo distintivo por 10 años. Se recomienda realizar la búsqueda fonética previa en la plataforma 'Busca tu Marca'.",
      "PRODUCE": "El Programa 'Tu Empresa' brinda asesoría gratuita para la constitución de empresas y elaboración de minutas a bajo costo."
    };

    const entidadKey = input.entidad || "MTPE";
    const info = mockData[entidadKey] || "Información actualizada disponible en el portal .gob.pe. Se requiere cumplimiento de la normativa vigente de formalización.";

    return `RESULTADO OFICIAL (.gob.pe):
    - Entidad: ${entidadKey}
    - Información: ${info}
    - Nota: Esta información es de carácter público y administrativo para el ciudadano peruano.`;
  }
);

/**
 * HERRAMIENTA: Consulta de Base de Conocimiento Local
 * Acceso a manuales internos de la DRTPE.
 */
const consultInternalKnowledge = ai.defineTool(
  {
    name: 'consultarBaseConocimiento',
    description: 'Consulta los manuales técnicos internos de la DRTPE sobre procesos específicos (DPPR, REMYPE, procedimientos de Lima). Es tu primera fuente de consulta.',
    inputSchema: z.object({
      topic: z.string().describe('El tema técnico de la DRTPE a consultar.'),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    console.log(`[Ofelia-Agent] Consultando base interna para: ${input.topic}`);
    return `CONOCIMIENTO INTERNO DRTPE:
    - Procedimiento: Registro de trabajadores del hogar y conciliaciones laborales en Lima Metropolitana.
    - Detalle: La sede central en Av. Salaverry atiende trámites de formalización itinerante. El REMYPE local valida el cumplimiento de micro y pequeña empresa.`;
  }
);

/**
 * Prompt definido para OFELIA con lógica agéntica
 */
const prompt = ai.definePrompt({
  name: 'ofeliaChatPrompt',
  input: { schema: OfeliaChatInputSchema },
  output: { schema: OfeliaChatOutputSchema },
  tools: [searchGovernmentInfo, consultInternalKnowledge],
  system: `Eres OFELIA, una Asistente Técnica experta de la Dirección Regional de Trabajo (DRTPE) de Lima Metropolitana. 

LÓGICA DE RAZONAMIENTO:
1. REGLA DE FALLBACK: Ante cualquier pregunta del ciudadano, consulta primero 'consultarBaseConocimiento'. 
2. SI la información en la base interna es INSUFICIENTE, NO se encuentra o el usuario pregunta por trámites en SUNAT, SUNARP, PRODUCE, INDECOPI o ministerios específicos, DEBES usar 'buscarEnPortalesEstado'.
3. NO inventes procedimientos. Si no hay datos oficiales en ninguna herramienta, admite que no tienes la información y recomienda acudir a la oficina física de la DRTPE Lima.
4. TONO: Institucional, preciso, amable y orientado al cumplimiento normativo peruano.
5. CONTEXTO: Estás ayudando a un usuario en la ruta: {{{context}}}.

IMPORTANTE: Tus respuestas deben basarse exclusivamente en la información retornada por las herramientas. Cita la entidad consultada (ej. "Según el portal de SUNAT...").`,
  prompt: `Historial de conversación:
{{#each history}}
{{role}}: {{{content}}}
{{/each}}

Mensaje actual del ciudadano: {{{message}}}
Respuesta técnica de OFELIA:`,
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
    return {
      text: "Estimado ciudadano, en este momento no puedo conectar con los portales oficiales del Estado peruano por una interrupción técnica. Por favor, intente formular su pregunta técnica nuevamente en unos segundos.",
      sources: ["Error de interconexión gubernamental"]
    };
  }
}
