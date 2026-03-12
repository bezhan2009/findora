
'use server';
/**
 * @fileOverview Подсказки поиска с защитой от чрезмерных запросов.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartSearchSuggestionsInputSchema = z.object({
  query: z.string().describe('The current search query.'),
});
export type SmartSearchSuggestionsInput = z.infer<
  typeof SmartSearchSuggestionsInputSchema
>;

const SmartSearchSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of search suggestions.'),
});
export type SmartSearchSuggestionsOutput = z.infer<
  typeof SmartSearchSuggestionsOutputSchema
>;

/**
 * Определение промпта для подсказок поиска.
 */
const smartSearchSuggestionsPrompt = ai.definePrompt({
  name: 'smartSearchSuggestionsPrompt_v5',
  input: {schema: SmartSearchSuggestionsInputSchema},
  output: {schema: SmartSearchSuggestionsOutputSchema},
  prompt: `You are a search assistant. Based on query: "{{{query}}}", provide 3-5 short, relevant search terms in Russian. Return JSON with "suggestions" key.`,
});

/**
 * Определение потока для подсказок поиска.
 */
const smartSearchSuggestionsFlow = ai.defineFlow(
  {
    name: 'smartSearchSuggestionsFlow',
    inputSchema: SmartSearchSuggestionsInputSchema,
    outputSchema: SmartSearchSuggestionsOutputSchema,
  },
  async input => {
    // Дополнительная проверка на стороне сервера
    if (!input.query || input.query.trim().length < 3) {
        return { suggestions: [] };
    }

    try {
      const {output} = await smartSearchSuggestionsPrompt(input);
      if (!output) {
        return { suggestions: [] };
      }
      return output;
    } catch (error: any) {
      // Молча ловим ошибки квот, чтобы не мешать основному UX
      console.warn("AI Suggestions Quota Error:", error?.message);
      return { suggestions: [] };
    }
  }
);

export async function smartSearchSuggestions(
  input: SmartSearchSuggestionsInput
): Promise<SmartSearchSuggestionsOutput> {
  return smartSearchSuggestionsFlow(input);
}
