
'use server';
/**
 * @fileOverview Мгновенный перевод через Groq SDK.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Groq } from 'groq-sdk';

const GROQ_API_KEY = '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';
const groq = new Groq({ apiKey: GROQ_API_KEY });

const TranslatorInputSchema = z.object({
  text: z.string(),
  targetLanguage: z.enum(['English', 'Russian', 'Tajik']),
});
export type TranslatorInput = z.infer<typeof TranslatorInputSchema>;

const TranslatorOutputSchema = z.object({
  translatedText: z.string(),
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
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `Вы — профессиональный переводчик. Переведите текст на ${input.targetLanguage}. ВЕРНИТЕ ТОЛЬКО ПЕРЕВОД БЕЗ КОММЕНТАРИЕВ.`
          },
          { role: 'user', content: input.text }
        ],
      });

      return { translatedText: completion.choices[0]?.message?.content || "Ошибка перевода" };
    } catch (error) {
      return { translatedText: "Сервис перевода временно недоступен. Попробуйте через минуту." };
    }
  }
);
