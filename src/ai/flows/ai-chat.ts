
'use server';
/**
 * @fileOverview Поток AI чата Findora, работающий через Groq SDK.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { Groq } from 'groq-sdk';

const GROQ_API_KEY = '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';
const groq = new Groq({ apiKey: GROQ_API_KEY });

const ServiceSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  rating: z.number(),
});

const ProviderSchema = z.object({
    username: z.string(),
    name: z.string(),
    bio: z.string(),
    role: z.string(),
    rating: z.number(),
});

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
  photoDataUri: z.string().optional(),
});

const AIChatInputSchema = z.object({
  history: z.array(ChatMessageSchema),
  message: z.string().describe('Последнее сообщение пользователя.'),
  services: z.array(ServiceSchema).describe('Список доступных услуг/товаров.'),
  providers: z.array(ProviderSchema).describe('Список доступных исполнителей.'),
  photoDataUri: z.string().optional().describe("Опциональное фото от пользователя."),
});
export type AIChatInput = z.infer<typeof AIChatInputSchema>;

const AIChatOutputSchema = z.object({
  response: z.string().describe('Ответ ИИ.'),
});
export type AIChatOutput = z.infer<typeof AIChatOutputSchema>;

export async function aiChat(input: AIChatInput): Promise<AIChatOutput> {
  return findoraChatFlow(input);
}

const findoraChatFlow = ai.defineFlow(
  {
    name: 'findoraChatFlow',
    inputSchema: AIChatInputSchema,
    outputSchema: AIChatOutputSchema,
  },
  async (input) => {
    try {
      const messages: any[] = [
        {
          role: 'system',
          content: `Вы — дружелюбный ИИ-ассистент платформы Findora (маркетплейс в Таджикистане).
Отвечайте на РУССКОМ языке. Будьте лаконичны, но полезны.

Если пользователь ищет конкретную услугу, рекомендуйте её из списка ниже.
Для рекомендации товара ОБЯЗАТЕЛЬНО используйте формат: SERVICE_CARD[id]
Для рекомендации исполнителя: PROVIDER_CARD[username]

ДОСТУПНЫЕ УСЛУГИ:
${input.services.map(s => `- ID: ${s.id}, ${s.title}, ${s.price} TJS, Категория: ${s.category}, Рейтинг: ${s.rating}`).join('\n')}
`
        }
      ];

      // Ограничиваем историю для экономии токенов и стабильности
      input.history.slice(-6).forEach(msg => {
        messages.push({
          role: msg.role === 'model' ? 'assistant' : 'user',
          content: msg.content
        });
      });

      // Формируем текущее сообщение с поддержкой зрения (vision)
      const currentContent: any[] = [{ type: 'text', text: input.message }];
      
      if (input.photoDataUri) {
        currentContent.push({
          type: 'image_url',
          image_url: { url: input.photoDataUri }
        });
      }

      messages.push({ role: 'user', content: currentContent });

      const completion = await groq.chat.completions.create({
        model: 'llama-3.2-11b-vision-preview',
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      });

      return { response: completion.choices[0]?.message?.content || "Извините, я не смог сформулировать ответ." };

    } catch (error: any) {
      console.error("Groq SDK Error:", error);
      return { response: `Ошибка ИИ: ${error.message || "Неизвестная ошибка"}. Пожалуйста, попробуйте позже.` };
    }
  }
);
