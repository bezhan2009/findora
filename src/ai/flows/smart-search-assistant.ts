'use server';
/**
 * @fileOverview Подсказки поиска с использованием актуального плагина google-genai.
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
  name: 'smartSearchSuggestionsPrompt_v2',
  input: {schema: SmartSearchSuggestionsInputSchema},
  output: {schema: SmartSearchSuggestionsOutputSchema},
  prompt: `You are a search assistant that provides search suggestions based on the user's current query.

Current query: {{{query}}}

Provide a list of 3-5 search suggestions that are relevant to the query. Return as a JSON object with a "suggestions" key containing an array of strings.
Ensure the output is a valid JSON.`,
});

/**
 * Определение потока для подсказок поиска с обработкой ошибок квот.
 */
const smartSearchSuggestionsFlow = ai.defineFlow(
  {
    name: 'smartSearchSuggestionsFlow',
    inputSchema: SmartSearchSuggestionsInputSchema,
    outputSchema: SmartSearchSuggestionsOutputSchema,
  },
  async input => {
    try {
      const {output} = await smartSearchSuggestionsPrompt(input);
      if (!output) {
        return { suggestions: [] };
      }
      return output;
    } catch (error: any) {
      console.warn("AI Search Suggestions failed:", error?.message);
      return { suggestions: [] };
    }
  }
);

export async function smartSearchSuggestions(
  input: SmartSearchSuggestionsInput
): Promise<SmartSearchSuggestionsOutput> {
  return smartSearchSuggestionsFlow(input);
}
