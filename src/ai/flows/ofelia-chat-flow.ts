'use server';
/**
 * @fileOverview Flujo de chat de OFELIA con recuperación mejorada de documentos técnicos.
 * 
 * - Prioridad 1: Información técnica local (Límites, porcentajes, plataformas oficiales).
 * - Prioridad 2: Conocimiento complementario (Orientación inicial).
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
 * Busca de forma profunda en los archivos .md de conocimiento.
 * Optimizado para detectar términos técnicos clave y nombres de archivos.
 */
function searchKnowledge(query: string): { content: string; filenames: string[] } {
  const knowledgeDir = path.join(process.cwd(), 'knowledge');
  if (!fs.existsSync(knowledgeDir)) return { content: '', filenames: [] };
  
  const files = fs.readdirSync(knowledgeDir).filter(f => f.endsWith('.md'));
  const results: string[] = [];
  const foundFiles: string[] = [];
  
  const normalizedQuery = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const keywords = normalizedQuery.split(/\W+/).filter(k => k.length > 2);

  if (keywords.length === 0) return { content: '', filenames: [] };

  for (const file of files) {
    const filePath = path.join(knowledgeDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const normalizedContent = content.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // Coincidencia por nombre de archivo o contenido técnico
    const matchesFileName = keywords.some(k => file.toLowerCase().includes(k));
    const matchesContent = keywords.some(k => normalizedContent.includes(k));
    
    if (matchesFileName || matchesContent) {
      foundFiles.push(file);
      
      // Si el archivo es relevante, enviamos un bloque sustancial de texto 
      // para que el LLM pueda extraer porcentajes y límites.
      // Limitamos a 4000 caracteres por archivo para no saturar.
      const snippet = content.slice(0, 4000);
      results.push(`--- CONTENIDO TÉCNICO DE ${file} ---\n${snippet}\n--- FIN DE ${file} ---`);
    }
  }

  // Tomamos los 2 archivos más relevantes para maximizar la calidad del contexto sin exceder límites de tokens.
  return {
    content: results.slice(0, 2).join('\n\n'),
    filenames: foundFiles.slice(0, 2)
  };
}

export async function ofeliaChat(input: OfeliaChatInput): Promise<OfeliaChatOutput> {
  try {
    const searchResult = searchKnowledge(input.message);

    const systemPrompt = `Eres OFELIA, asistente técnica de la DRTPE Lima Metropolitana. 
Tu objetivo es ser un orientador técnico inicial basado en DOCUMENTACIÓN OFICIAL.

INSTRUCCIONES CRÍTICAS DE RESPUESTA:
1. PRIORIDAD ABSOLUTA: Si el "CONTENIDO TÉCNICO" proporcionado abajo contiene información sobre la consulta, USALA OBLIGATORIAMENTE.
2. EXTRACCIÓN DE DATOS: Busca y menciona explícitamente porcentajes (%), límites legales, nombres de plataformas (SIVICE, T-Registro, etc.) y requisitos específicos encontrados en el texto.
3. NO GENERALIZAR: Si el documento dice "20%", no digas "una parte". Di "el límite es 20% según la normativa".
4. CONOCIMIENTO IA: Solo úsalo si la información local es nula para dar una idea básica del portal oficial (.gob.pe).

FORMATO DE RESPUESTA (Solo HTML estructurado):
<div style="font-family: sans-serif; line-height: 1.6; color: #1a1a1a;">
  <p>📌 <strong>Lo principal:</strong> Resumen técnico y directo que incluya cifras y puntos clave del manual.</p>
  
  <p>📋 <strong>Requisitos:</strong></p>
  <ul style="margin: 8px 0; padding-left: 20px;">
    <li>Listado de requisitos encontrados...</li>
  </ul>

  <p>⚠️ <strong>Consideraciones:</strong> Notas preventivas, excepciones o advertencias importantes del documento.</p>
  
  <p>🏢 <strong>Entidad relacionada:</strong> <span style="color:#1a73e8; font-weight:bold;">Institución oficial encargada</span></p>
  
  <p style="color:#757575; font-size:0.85em; margin-top: 15px; border-top: 1px solid #eee; pt: 10px;">
    📎 <strong>Fuente oficial consultada:</strong> ${searchResult.filenames.length > 0 ? searchResult.filenames.join(', ') : 'Orientación Técnica General'}
  </p>
</div>

${searchResult.content ? `BASE DE DATOS TÉCNICA (EXTRAER DATOS DE AQUÍ):\n${searchResult.content}` : 'No hay información local específica. Guía al usuario hacia los portales oficiales de forma amigable.'}`;

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
      sources: searchResult.filenames.length > 0 ? searchResult.filenames : ['Base de Conocimiento General'],
    };
  } catch (error: any) {
    console.error('[OFELIA RETRIEVAL ERROR]', error);
    return {
      text: `<div style="color:#d32f2f;"><strong>Aviso Técnico:</strong> Tuve un problema al leer mis manuales. Por favor, intenta de nuevo o consulta en <a href="https://www.gob.pe" style="color:#1a73e8;">www.gob.pe</a></div>`,
      sources: [],
    };
  }
}
