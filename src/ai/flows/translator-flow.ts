
'use server';
/**
 * @fileOverview Перевод текста через Groq API.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GROQ_API_KEY = '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';

const TranslatorInputSchema = z.object({
  text: z.string().describe('The text to be translated.'),
  targetLanguage: z.enum(['English', 'Russian', 'Tajik']).describe('Target language.'),
});
export type TranslatorInput = z.infer<typeof TranslatorInputSchema>;

const TranslatorOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslatorOutput = z.infer<typeof TranslatorOutputSchema>;

export async function translateText(input: TranslatorInput): Promise<TranslatorOutput> {
  return translatorFlow(input);
}

const translatorFlow = ai.defineFlow(
  {
    name: 'translatorFlow',
    inputSchema: TranslatorInputSchema,
    outputSchema: TranslatorOutputSchema,
  },
  async input => {
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
              content: `Translate the following text into ${input.targetLanguage}. Return ONLY the translated text without any explanations.`
            },
            { role: 'user', content: input.text }
          ],
        }),
      });

      if (!response.ok) throw new Error('Groq Error');

      const data = await response.json();
      return { translatedText: data.choices[0].message.content };
    } catch (error) {
      return { translatedText: "Ошибка перевода" };
    }
  }
);
