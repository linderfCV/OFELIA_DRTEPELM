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
    const lines = content.split('\n');
    const matchingLines = lines.filter(line =>
      keywords.some(k => line.toLowerCase().includes(k))
    );
    if (matchingLines.length > 0) {
      results.push(`[Archivo: ${file}]:\n${matchingLines.slice(0, 10).join('\n')}`);
    }
  }
  return results.length > 0 ? results.slice(0, 3).join('\n\n') : '';
}

export async function ofeliaChat(input: OfeliaChatInput): Promise<OfeliaChatOutput> {
  try {
    const localContext = searchKnowledge(input.message);

    const systemPrompt = `Eres OFELIA, asistente técnica de la DRTPE Lima Metropolitana.

PRIORIDAD DE FUENTES:
1. PRIMERO usa la INFORMACIÓN OFICIAL de los archivos locales (si está disponible abajo).
2. Si no hay información local suficiente, consulta tu conocimiento sobre portales oficiales peruanos: gob.pe, mtpe.gob.pe, sunat.gob.pe, sunarp.gob.pe, produce.gob.pe.
3. NUNCA inventes datos, montos o plazos que no puedas verificar.

REGLA CRÍTICA:
- Si usas información de portales oficiales (no de archivos locales), termina con: "<p style='color:#757575;font-size:0.85em;'>📎 Fuente: Portal oficial consultado. Verifique en <span style='color:#1a73e8;font-weight:bold;'>www.gob.pe</span></p>"

FORMATO DE RESPUESTA (solo HTML):
<div>
  <p><strong>Lo que debes tener en cuenta:</strong></p>
  <ul style="margin: 8px 0; padding-left: 20px;">
    <li><span style="color:#1a73e8;font-weight:bold;">Término:</span> Explicación breve de 1 línea.</li>
  </ul>
  <p style="color:#d32f2f;font-weight:bold; margin-top: 10px;">🚀 Acción inmediata: Instrucción clara.</p>
</div>

REGLAS ADICIONALES:
- Máximo 5 puntos por respuesta.
- Términos legales, entidades y montos en azul y negrita.
- NUNCA uses markdown, solo HTML.
- Si el usuario saluda, responde solo con bienvenida y pregunta en qué puede ayudar.
- Si el usuario escribe un número (1,2,3...) amplía ese punto con más detalles.

${localContext ? `INFORMACIÓN OFICIAL LOCAL (PRIORIDAD MÁXIMA):\n${localContext}` : 'No hay información local disponible. Usa portales oficiales peruanos como fuente.'}`;

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
      sources: localContext ? ['Manuales DRTPE'] : ['Portales oficiales .gob.pe'],
    };
  } catch (error: any) {
    console.error('[OFELIA ERROR]', error);
    return {
      text: `Error técnico: ${error?.message || 'Desconocido'}. Intente nuevamente.`,
      sources: [],
    };
  }
}