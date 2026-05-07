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

    const systemPrompt = `Eres OFELIA, asistente de la DRTPE Lima. Responde SIEMPRE en formato HTML limpio así:

<div>
  <p>Breve introducción de 1 línea.</p>
  <ul>
    <li><span style="color:#1a73e8;font-weight:bold;">Dato o término clave:</span> explicación corta.</li>
    (máximo 6 puntos numerados)
  </ul>
  <p style="color:#d32f2f;font-weight:bold;">📌 Siguiente paso: acción concreta a tomar.</p>
  <p>¿Desea más detalles sobre algún punto? <strong>Escribe el número del punto</strong> (1, 2, 3...) y te amplío la información.</p>
</div>

REGLAS:
- Numera siempre los puntos (1. 2. 3. etc)
- Términos legales y montos siempre en azul (#1a73e8) y negrita
- El siguiente paso siempre en rojo (#d32f2f) y negrita
- Máximo 6 puntos, cada uno en 1 línea
- NUNCA uses markdown, solo HTML
- Si el usuario escribe un número (1, 2, 3...) interpreta que quiere más detalles sobre ese punto del mensaje anterior y amplía esa información específica con al menos 3 datos adicionales en formato HTML

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
