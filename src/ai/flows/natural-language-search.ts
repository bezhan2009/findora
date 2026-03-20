
'use server';
/**
 * @fileOverview Умный поиск через Groq.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Groq } from 'groq-sdk';

const GROQ_API_KEY = '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';
const groq = new Groq({ apiKey: GROQ_API_KEY });

const NaturalLanguageSearchInputSchema = z.object({
  query: z.string(),
});
export type NaturalLanguageSearchInput = z.infer<typeof NaturalLanguageSearchInputSchema>;

const NaturalLanguageSearchOutputSchema = z.object({
  refinedQuery: z.string(),
  categorySuggestions: z.array(z.string()),
});
export type NaturalLanguageSearchOutput = z.infer<typeof NaturalLanguageSearchOutputSchema>;

export async function naturalLanguageSearch(input: NaturalLanguageSearchInput): Promise<NaturalLanguageSearchOutput> {
  return naturalLanguageSearchFlow(input);
}

const naturalLanguageSearchFlow = ai.defineFlow(
  {
    name: 'naturalLanguageSearchFlow',
    inputSchema: NaturalLanguageSearchInputSchema,
    outputSchema: NaturalLanguageSearchOutputSchema,
  },
  async input => {
    try {
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content: 'Вы — ассистент поиска. Улучшите запрос пользователя для маркетплейса и предложите подходящие категории. Верните JSON: { "refinedQuery": "текст", "categorySuggestions": [] }'
                },
                { role: 'user', content: input.query }
            ],
            response_format: { type: 'json_object' }
        });

        const result = JSON.parse(completion.choices[0]?.message?.content || '{}');
        return {
            refinedQuery: result.refinedQuery || input.query,
            categorySuggestions: result.categorySuggestions || []
        };
    } catch (e) {
        return { refinedQuery: input.query, categorySuggestions: [] };
    }
  }
);
