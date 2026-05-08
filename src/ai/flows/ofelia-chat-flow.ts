'use server';
/**
 * @fileOverview Flujo de chat de OFELIA con modelo híbrido de conocimiento.
 * 
 * - Prioridad 1: Búsqueda selectiva en archivos locales (.md).
 * - Prioridad 2: Conocimiento complementario de la IA (orientación inicial).
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
 * Busca de forma selectiva en los archivos .md de conocimiento.
 * Optimizado para no cargar toda la biblioteca y ahorrar tokens.
 */
function searchKnowledge(query: string): { content: string; filenames: string[] } {
  const knowledgeDir = '/home/user/studio/knowledge';
  if (!fs.existsSync(knowledgeDir)) return { content: '', filenames: [] };
  
  const files = fs.readdirSync(knowledgeDir).filter(f => f.endsWith('.md'));
  const results: string[] = [];
  const foundFiles: string[] = [];
  
  // Normalizar consulta para mejor coincidencia
  const normalizedQuery = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const keywords = normalizedQuery.split(/\W+/).filter(k => k.length > 3);

  if (keywords.length === 0) return { content: '', filenames: [] };

  for (const file of files) {
    const filePath = path.join(knowledgeDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const normalizedContent = content.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // Coincidencia por nombre de archivo o contenido
    const matches = keywords.some(k => normalizedContent.includes(k) || file.toLowerCase().includes(k));
    
    if (matches) {
      foundFiles.push(file);
      // Extraer líneas relevantes para dar contexto específico
      const lines = content.split('\n');
      const matchingLines = lines.filter(line =>
        keywords.some(k => line.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(k))
      );
      
      // Si no hay líneas que coincidan con keywords pero el archivo es relevante, tomar el inicio
      const snippet = matchingLines.length > 0 
        ? matchingLines.slice(0, 20).join('\n') 
        : content.slice(0, 1000);

      results.push(`[CONTEXTO DEL ARCHIVO: ${file}]:\n${snippet}`);
    }
  }

  // Limitar a los 3 archivos más relevantes para ahorrar tokens
  return {
    content: results.slice(0, 3).join('\n\n'),
    filenames: foundFiles.slice(0, 3)
  };
}

export async function ofeliaChat(input: OfeliaChatInput): Promise<OfeliaChatOutput> {
  try {
    const searchResult = searchKnowledge(input.message);

    const systemPrompt = `Eres OFELIA, asistente técnica de la DRTPE Lima Metropolitana. 
Tu objetivo es ser un orientador técnico inicial, asesor preventivo y guía de formalización.

COMPORTAMIENTO:
- Actúa como una guía técnica, amigable y profesional.
- NO eres un abogado ni reemplazo oficial de los canales de atención presencial.
- Sé directo y evita lenguaje excesivamente jurídico.

PRIORIDAD DE FUENTES:
1. INFORMACIÓN OFICIAL (Extractos proporcionados abajo): Usa esta información como fuente principal. Resúmela claramente.
2. CONOCIMIENTO GENERAL (Complementario): Si la información local es insuficiente, complementa con conocimiento sobre portales oficiales peruanos (.gob.pe) para explicar requisitos básicos, entidades y obligaciones generales.

REGLAS CRÍTICAS:
- NUNCA inventes: multas, montos exactos de tasas, porcentajes no verificados o procedimientos inexistentes.
- Si usas conocimiento general (no local), indica que es orientación inicial y sugiera verificar en portales oficiales.

FORMATO DE RESPUESTA (Solo HTML estructurado):
<div style="font-family: sans-serif; line-height: 1.6; color: #1a1a1a;">
  <p>📌 <strong>Lo principal:</strong> Resumen amigable de la respuesta.</p>
  
  <p>📋 <strong>Requisitos:</strong></p>
  <ul style="margin: 8px 0; padding-left: 20px;">
    <li>Detalle relevante...</li>
  </ul>

  <p>⚠️ <strong>Consideraciones:</strong> Notas preventivas o advertencias importantes.</p>
  
  <p>🏢 <strong>Entidad relacionada:</strong> <span style="color:#1a73e8; font-weight:bold;">Nombre de la Institución</span></p>
  
  <p style="color:#757575; font-size:0.85em; margin-top: 15px; border-top: 1px solid #eee; pt: 10px;">
    📎 <strong>Fuente utilizada:</strong> ${searchResult.filenames.length > 0 ? searchResult.filenames.join(', ') : 'Portales oficiales del Estado Peruano (.gob.pe)'}
  </p>
</div>

MENSAJE DE SALUDO:
Si el usuario solo saluda, responde exclusivamente con una invitación a consultar temas técnicos de formalización o laboral.

${searchResult.content ? `EXTRACTOS DE MANUALES Y LEYES (PRIORIDAD MÁXIMA):\n${searchResult.content}` : 'No se encontró información local específica. Usa tu conocimiento sobre la normativa peruana para dar una orientación inicial amigable.'}`;

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
      text: response.text || 'No se pudo generar una respuesta técnica en este momento.',
      sources: searchResult.filenames.length > 0 ? searchResult.filenames : ['Orientación General .gob.pe'],
    };
  } catch (error: any) {
    console.error('[OFELIA HYBRID ERROR]', error);
    return {
      text: `<div style="color:#d32f2f;"><strong>Aviso Técnico:</strong> Tuve un problema al consultar mi base de datos. Por favor, intenta de nuevo o consulta directamente en <a href="https://www.gob.pe" style="color:#1a73e8;">www.gob.pe</a></div>`,
      sources: [],
    };
  }
}
