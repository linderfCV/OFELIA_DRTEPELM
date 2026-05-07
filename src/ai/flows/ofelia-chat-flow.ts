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
      // Extraemos un fragmento significativo para el contexto
      results.push(`[Archivo: ${file}]:\n${content.substring(0, 800)}...`);
    }
  }
  return results.length > 0 ? results.join('\n\n') : '';
}

export async function ofeliaChat(input: OfeliaChatInput): Promise<OfeliaChatOutput> {
  try {
    const localContext = searchKnowledge(input.message);

    const systemPrompt = `Eres OFELIA, Asistente Técnica Senior de la DRTPE Lima Metropolitana.
Responde de forma concisa y estructurada sobre formalización empresarial y laboral en Perú.
Usa **negritas** para términos clave y listas con viñetas (•) para pasos o requisitos.
${localContext ? `\nUSA ESTA INFORMACIÓN OFICIAL COMO BASE DE TU RESPUESTA:\n${localContext}` : ''}`;

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
