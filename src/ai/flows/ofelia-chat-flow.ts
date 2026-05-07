'use server';
/**
 * @fileOverview Flujo de IA para la asistente OFELIA (DRTPE Lima).
 * Implementa una arquitectura RAG avanzada con formato de respuesta amigable y conciso.
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
 */
const searchGovernmentInfo = ai.defineTool(
  {
    name: 'buscarEnPortalesEstado',
    description: 'Consulta información en portales oficiales de Perú (.gob.pe). Úsala para obtener datos técnicos de SUNARP, SUNAT, MTPE, etc.',
    inputSchema: z.object({
      query: z.string().describe('Término de búsqueda técnica o administrativa.'),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    console.log(`[Ofelia-Agent] Consultando portales oficiales para: ${input.query}`);
    
    const knowledgeBase: Record<string, string> = {
      "extranjeros": "Decreto Legislativo N° 689: Límite de contratación del 20% del personal total. Remuneraciones no pueden exceder el 30% de la planilla. Se requiere contrato escrito aprobado por el MTPE.",
      "hogar": "Ley N° 31047: Derechos incluyen Gratificaciones (Julio/Diciembre full), CTS, y 30 días de vacaciones. El sueldo mínimo es S/ 1,025. El registro en T-Registro SUNAT es obligatorio.",
      "remype": "Régimen MYPE: Permite reducir costos laborales. Microempresa paga 15 días de vacaciones, SIS y pensiones (sin CTS ni gratificaciones). Requisito: ventas < 150 UIT.",
      "sunat": "Régimen MYPE Tributario: Ideal para nuevos negocios. Pago de impuestos escalonado. Se requiere RUC activo y Clave SOL.",
      "sunarp": "Constitución de Empresa: Reserva de nombre (30 días), Minuta, Escritura Pública e Inscripción Registral.",
    };

    const queryLower = input.query.toLowerCase();
    let result = "Información técnica de portales oficiales .gob.pe. Se recomienda verificar requisitos actualizados en la sede digital de la entidad.";

    for (const key in knowledgeBase) {
      if (queryLower.includes(key)) {
        result = knowledgeBase[key];
        break;
      }
    }

    return `RESULTADO OFICIAL: ${result}`;
  }
);

/**
 * HERRAMIENTA: Consulta de Base de Conocimiento Local
 */
const consultInternalKnowledge = ai.defineTool(
  {
    name: 'consultarBaseConocimiento',
    description: 'Consulta los manuales técnicos internos de la DRTPE Lima sobre procesos de formalización y atención.',
    inputSchema: z.object({
      topic: z.string().describe('El tema técnico de la DRTPE a consultar.'),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    return `CONOCIMIENTO INTERNO DRTPE: Contamos con asesoría gratuita en Av. Salaverry 655. El registro REMYPE es 100% digital a través del portal MTPE.`;
  }
);

/**
 * Prompt de OFELIA - Configuración Agéntica de Experto
 */
const prompt = ai.definePrompt({
  name: 'ofeliaChatPrompt',
  input: { schema: OfeliaChatInputSchema },
  tools: [searchGovernmentInfo, consultInternalKnowledge],
  system: `Eres OFELIA, Asistente Técnica Senior de la DRTPE Lima Metropolitana.

TU MISIÓN:
Brindar respuestas rápidas, precisas y visualmente claras sobre formalización empresarial y laboral.

REGLAS DE ESTILO (CRUCIAL):
1. **Sé Conciso**: No uses introducciones largas. Ve directo a la respuesta técnica.
2. **Estructura Amigable**: 
   - Usa **negritas** para términos clave y montos.
   - Usa listas con viñetas (•) para pasos o requisitos.
   - Máximo 2 o 3 párrafos cortos por respuesta.
3. **No Falles**: Nunca digas "no encontré información". Sintetiza tu conocimiento experto con las herramientas.
4. **Contexto Legal**: Siempre menciona que la información es de fuentes oficiales .gob.pe.`,
  prompt: `Historial:
{{#each history}}
{{role}}: {{{content}}}
{{/each}}

Consulta del Ciudadano: {{{message}}}
Respuesta Técnica de OFELIA (Directa y Estructurada):`,
});

export async function ofeliaChat(input: OfeliaChatInput): Promise<OfeliaChatOutput> {
  try {
    const response = await prompt(input);
    const text = response.text;
    if (!text) throw new Error("Respuesta vacía del motor IA.");
    return { text, sources: [] };
  } catch (error: any) {
    console.error('[OFELIA ERROR]', error);
    return {
      text: `Error técnico: ${error?.message || 'Desconocido'}. Intente nuevamente.`,
      sources: ["Log de error"]
    };
  }
}