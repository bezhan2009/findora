
'use server';
/**
 * @fileOverview Подсказки поиска через Groq SDK.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { Groq } from 'groq-sdk';

const GROQ_API_KEY = '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';
const groq = new Groq({ apiKey: GROQ_API_KEY });

const SmartSearchSuggestionsInputSchema = z.object({
  query: z.string().describe('Текущий поисковый запрос.'),
});
export type SmartSearchSuggestionsInput = z.infer<typeof SmartSearchSuggestionsInputSchema>;

const SmartSearchSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('Список поисковых подсказок.'),
});
export type SmartSearchSuggestionsOutput = z.infer<typeof SmartSearchSuggestionsOutputSchema>;

export async function smartSearchSuggestions(input: SmartSearchSuggestionsInput): Promise<SmartSearchSuggestionsOutput> {
  return smartSearchSuggestionsFlow(input);
}

const smartSearchSuggestionsFlow = ai.defineFlow(
  {
    name: 'smartSearchSuggestionsFlow',
    inputSchema: SmartSearchSuggestionsInputSchema,
    outputSchema: SmartSearchSuggestionsOutputSchema,
  },
  async input => {
    if (!input.query || input.query.trim().length < 3) {
        return { suggestions: [] };
    }

    try {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Вы — ассистент по поиску. На основе запроса пользователя предложите 3-5 коротких, актуальных поисковых терминов на русском языке. Верните ТОЛЬКО валидный JSON объект с ключом "suggestions" (массив строк).'
          },
          { role: 'user', content: input.query }
        ],
        response_format: { type: 'json_object' }
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) return { suggestions: [] };

      const result = JSON.parse(content);
      return { suggestions: result.suggestions || [] };
    } catch (error) {
      console.warn("Groq Search Error:", error);
      return { suggestions: [] };
    }
  }
);
