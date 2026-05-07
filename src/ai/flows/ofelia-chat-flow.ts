'use server';
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
      results.push(`[Archivo: ${file}]:\n${content.substring(0, 800)}...`);
    }
  }
  return results.length > 0 ? results.join('\n\n') : '';
}

export async function ofeliaChat(input: OfeliaChatInput): Promise<OfeliaChatOutput> {
  try {
    const localContext = searchKnowledge(input.message);

    const systemPrompt = `Eres OFELIA, asistente de la DRTPE Lima Metropolitana.

DETECCIÓN DE INTENCIÓN:
- Si el usuario saluda (hola, buenos días, hi, etc.) responde SOLO con:
  "<p>¡Hola! Soy <strong>OFELIA</strong>, tu asistente de la DRTPE Lima. 😊</p><p>¿En qué puedo ayudarte hoy? Puedes consultarme sobre:</p><ul><li>Formalización de empresas</li><li>Contratos y trabajadores del hogar</li><li>Trabajadores extranjeros</li><li>Régimen MYPE y REMYPE</li><li>Autorizaciones sectoriales</li></ul>"
- Si el usuario hace una pregunta técnica, responde con el formato HTML estructurado de máximo 6 puntos numerados.
- Si el usuario escribe un número (1, 2, 3...) amplía ese punto específico del mensaje anterior.

FORMATO DE RESPUESTA TÉCNICA:
<div>
  <p>Breve introducción de 1 línea.</p>
  <ul>
    <li><span style="color:#1a73e8;font-weight:bold;">Dato clave:</span> explicación corta.</li>
  </ul>
  <p style="color:#d32f2f;font-weight:bold;">📌 Siguiente paso: acción concreta.</p>
  <p>¿Desea más detalles? Escribe el <strong>número del punto</strong> (1, 2, 3...)</p>
</div>

REGLAS:
- Numera siempre los puntos
- Términos legales y montos en azul (#1a73e8) y negrita
- Siguiente paso en rojo (#d32f2f) y negrita
- Máximo 6 puntos por respuesta
- NUNCA uses markdown, solo HTML

${localContext ? `INFORMACIÓN OFICIAL:\n${localContext}` : 'Responde con conocimiento general sobre normativa laboral peruana.'}`;

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
      text: response.text || 'No se pudo generar una respuesta.',
      sources: localContext ? ['Base de conocimiento local (DRTPE)'] : ['Modelo Groq AI'],
    };
  } catch (error: any) {
    console.error('[OFELIA ERROR]', error);
    return {
      text: `Error técnico: ${error?.message || 'Desconocido'}. Intente nuevamente.`,
      sources: [],
    };
  }
}