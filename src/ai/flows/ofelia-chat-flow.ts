'use server';
/**
 * @fileOverview Flujo de chat para OFELIA - Asistente de la DRTPE Lima.
 * Implementa un sistema de búsqueda local (RAG) y respuestas estructuradas en HTML con reglas de veracidad estrictas.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import fs from 'fs';
import path from 'path';

const OfeliaChatInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model', 'system']),
    content: z.string(),
  })).optional(),
  message: z.string(),
  context: z.string().optional(),
});

export type OfeliaChatInput = z.infer<typeof OfeliaChatInputSchema>;

export type OfeliaChatOutput = {
  text: string;
  sources?: string[];
};

/**
 * Realiza una búsqueda simple de palabras clave en los archivos de conocimiento.
 */
function searchKnowledge(query: string): string {
  const knowledgeDir = '/home/user/studio/knowledge';
  if (!fs.existsSync(knowledgeDir)) return '';
  
  const files = fs.readdirSync(knowledgeDir).filter(f => f.endsWith('.md'));
  const results: string[] = [];
  const keywords = query.toLowerCase().split(' ').filter(k => k.length > 3);

  for (const file of files) {
    const content = fs.readFileSync(path.join(knowledgeDir, file), 'utf-8');
    const matches = keywords.some(k => content.toLowerCase().includes(k));
    if (matches) {
      // Tomamos una porción significativa del contenido para el contexto
      results.push(`[Archivo: ${file}]:\n${content.substring(0, 1000)}...`);
    }
  }
  return results.length > 0 ? results.join('\n\n') : '';
}

/**
 * Función principal del flujo de chat de OFELIA.
 */
export async function ofeliaChat(input: OfeliaChatInput): Promise<OfeliaChatOutput> {
  try {
    const localContext = searchKnowledge(input.message);

    const systemPrompt = `Eres OFELIA, asistente técnica de la DRTPE Lima Metropolitana.

REGLA CRÍTICA: NUNCA inventes datos, montos, costos o plazos. 
- Si la información NO está en los archivos oficiales proporcionados, di exactamente: "Para información actualizada sobre este punto, consulte <span style="color:#1a73e8;font-weight:bold;">www.gob.pe/mtpe</span>"
- SOLO usa datos que aparezcan textualmente en la INFORMACIÓN OFICIAL proporcionada abajo.
- Si un costo no aparece en la información oficial, NO lo menciones.

FORMATO DE RESPUESTA (solo HTML):
<div>
  <p><strong>Lo que debes tener en cuenta:</strong></p>
  <ul style="margin: 8px 0; padding-left: 20px;">
    <li><span style="color:#1a73e8;font-weight:bold;">Término:</span> Explicación breve de 1 línea.</li>
  </ul>
  <p style="color:#d32f2f;font-weight:bold; margin-top: 10px;">🚀 Acción inmediata: Instrucción clara.</p>
</div>

REGLAS ADICIONALES:
- Máximo 4 puntos por respuesta
- Términos legales y entidades en azul y negrita
- NUNCA uses markdown, solo HTML
- Si el usuario saluda, responde solo con bienvenida y pregunta en qué puede ayudar

${localContext ? `INFORMACIÓN OFICIAL (USA SOLO ESTOS DATOS):\n${localContext}` : 'No hay información local disponible. Indica al usuario que consulte www.gob.pe/mtpe'}`;

    const history = (input.history || []).map(h => ({
      role: h.role === 'model' ? 'model' as const : 'user' as const,
      content: [{ text: h.content }],
    }));

    const response = await ai.generate({
      system: systemPrompt,
      messages: history,
      prompt: input.message,
    });

    return {
      text: response.text || 'Lo siento, no pude procesar la respuesta técnica.',
      sources: localContext ? ['Manuales DRTPE'] : ['Conocimiento General'],
    };
  } catch (error: any) {
    console.error('[OFELIA ERROR]', error);
    return {
      text: `Error técnico: ${error?.message || 'Desconocido'}. Intente nuevamente.`,
      sources: [],
    };
  }
}
