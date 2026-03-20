
'use server';
/**
 * @fileOverview Подсказки поиска через Groq API.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GROQ_API_KEY = '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';

const SmartSearchSuggestionsInputSchema = z.object({
  query: z.string().describe('The current search query.'),
});
export type SmartSearchSuggestionsInput = z.infer<typeof SmartSearchSuggestionsInputSchema>;

const SmartSearchSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of search suggestions.'),
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
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are a search assistant. Based on the user query, provide 3-5 short, relevant search terms in Russian. Return ONLY a valid JSON object with a single key "suggestions" which is an array of strings.'
            },
            { role: 'user', content: input.query }
          ],
          response_format: { type: 'json_object' }
        }),
      });

      if (!response.ok) return { suggestions: [] };

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      return { suggestions: result.suggestions || [] };
    } catch (error) {
      return { suggestions: [] };
    }
  }
);
