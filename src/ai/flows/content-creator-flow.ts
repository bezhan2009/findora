
'use server';
/**
 * @fileOverview Генерация контента через Groq SDK.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { Groq } from 'groq-sdk';

const GROQ_API_KEY = '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';
const groq = new Groq({ apiKey: GROQ_API_KEY });

const ContentCreatorInputSchema = z.object({
  prompt: z.string().describe("Высокоуровневый запрос пользователя."),
  tone: z.enum(['formal', 'casual']).describe('Тон текста.'),
  length: z.enum(['short', 'medium', 'long']).describe('Длина текста.'),
});
export type ContentCreatorInput = z.infer<typeof ContentCreatorInputSchema>;

const ContentCreatorOutputSchema = z.object({
  markdown: z.string(),
  meta: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    images: z.array(z.object({
        url: z.string(),
        alt: z.string(),
        caption: z.string()
    })),
    publish_ready: z.boolean(),
    created_at: z.string(),
  }),
});
export type ContentCreatorOutput = z.infer<typeof ContentCreatorOutputSchema>;

export async function createContent(input: ContentCreatorInput): Promise<ContentCreatorOutput> {
  return contentCreatorFlow(input);
}

const contentCreatorFlow = ai.defineFlow(
  {
    name: 'contentCreatorFlow',
    inputSchema: ContentCreatorInputSchema,
    outputSchema: ContentCreatorOutputSchema,
  },
  async input => {
    try {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `Вы — эксперт по созданию контента. Создайте статью на РУССКОМ языке на основе запроса пользователя.
Верните ТОЛЬКО валидный JSON объект с ключами: "markdown" (строка) и "meta" (объект).
Markdown должен включать # Заголовок, ## Разделы и секцию ## Фото в конце.
Тон: ${input.tone}, Длина: ${input.length}.`
          },
          { role: 'user', content: input.prompt }
        ],
        response_format: { type: 'json_object' }
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) throw new Error("Empty response from Groq");

      return JSON.parse(content);
    } catch (error) {
      console.error("Groq Content Error:", error);
      throw new Error("Не удалось сгенерировать контент через Groq");
    }
  }
);
