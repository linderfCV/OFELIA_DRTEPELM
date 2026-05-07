'use server';
/**
 * @fileOverview Flujo de chat para OFELIA - Asistente de la DRTPE Lima.
 * Implementa un sistema de búsqueda local (RAG) y respuestas estructuradas en HTML.
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

    const systemPrompt = `Eres OFELIA, asistente técnica experta de la DRTPE Lima Metropolitana.

TU MISIÓN:
Proporcionar información técnica sobre formalización de manera ultra-concisa, directa y visualmente impecable.

DETECCIÓN DE INTENCIÓN:
- Si el usuario saluda (hola, buenos días, etc.) responde SOLO con:
  "<p>¡Hola! Soy <strong>OFELIA</strong>. 😊 Te ayudaré con los puntos clave para tu formalización en Lima. ¿En qué tema técnico deseas enfocarte?</p>"
- Si el usuario hace una pregunta técnica, responde con el formato HTML estructurado de máximo 4 puntos clave.

REGLAS DE RESPUESTA (SIEMPRE EN HTML):
1. **Moneda**: Al mencionar costos o montos, usa SIEMPRE la palabra **"soles"** (ej: 20 soles). NUNCA uses "soles peruanos" ni "S/.".
2. **Concisión Máxima**: Entrega la información en una lista corta de máximo 4 puntos esenciales. Sin introducciones largas.
3. **Estilo Visual**:
   - Términos legales, entidades y montos en **<span style="color:#1a73e8;font-weight:bold;">AZUL</span>**.
   - Resalta lo más importante en **negrita**.
4. **Acción Directa**: Termina siempre con un "Próximo paso" claro en color rojo.
5. **PROHIBIDO**: 
   - NO uses markdown (ni **, ni #, ni -). Usa solo tags HTML (div, p, ul, li, span, strong).
   - NO pidas al usuario que escriba números ni solicites más detalles al final.

FORMATO DE SALIDA REQUERIDO:
<div>
  <p><strong>Lo que debes tener en cuenta:</strong></p>
  <ul style="margin: 8px 0; padding-left: 20px;">
    <li><span style="color:#1a73e8;font-weight:bold;">Término:</span> Explicación breve de 1 línea.</li>
  </ul>
  <p style="color:#d32f2f;font-weight:bold; margin-top: 10px;">🚀 Acción inmediata: Instrucción clara.</p>
</div>

${localContext ? `INFORMACIÓN OFICIAL PARA TU RESPUESTA:\n${localContext}` : 'Responde basándote en la normativa laboral peruana vigente.'}`;

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
      text: `Hubo un inconveniente técnico al consultar los manuales. Por favor, intenta de nuevo en unos momentos.`,
      sources: [],
    };
  }
}
