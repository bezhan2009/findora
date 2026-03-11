'use server';
/**
 * @fileOverview A flow for translating text into different languages.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslatorInputSchema = z.object({
  text: z.string().describe('The text to be translated.'),
  targetLanguage: z.enum(['English', 'Russian', 'Tajik']).describe('The language to translate the text into.'),
});
export type TranslatorInput = z.infer<typeof TranslatorInputSchema>;

const TranslatorOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslatorOutput = z.infer<typeof TranslatorOutputSchema>;

export async function translateText(input: TranslatorInput): Promise<TranslatorOutput> {
  return translatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translatorPrompt_v2',
  input: {schema: TranslatorInputSchema},
  output: {schema: TranslatorOutputSchema},
  prompt: `Translate the following text into {{targetLanguage}}.

Text:
"{{text}}"

Return only the translated text.`,
});

const translatorFlow = ai.defineFlow(
  {
    name: 'translatorFlow',
    inputSchema: TranslatorInputSchema,
    outputSchema: TranslatorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
