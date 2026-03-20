
'use server';
/**
 * @fileOverview Поток AI чата Findora, работающий через Groq API.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GROQ_API_KEY = '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';

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
Отвечайте на РУССКОМ языке. Лаконично и полезно.

Для рекомендации товара используйте: SERVICE_CARD[id]
Для рекомендации исполнителя: PROVIDER_CARD[username]

ДОСТУПНЫЕ УСЛУГИ:
${input.services.map(s => `- ID: ${s.id}, ${s.title}, ${s.price} TJS, ${s.category}`).join('\n')}
`
        }
      ];

      // Добавляем историю
      input.history.slice(-6).forEach(msg => {
        messages.push({
          role: msg.role === 'model' ? 'assistant' : 'user',
          content: msg.content
        });
      });

      // Добавляем текущее сообщение
      const currentContent: any[] = [{ type: 'text', text: input.message }];
      
      if (input.photoDataUri) {
        currentContent.push({
          type: 'image_url',
          image_url: { url: input.photoDataUri }
        });
      }

      messages.push({ role: 'user', content: currentContent });

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.2-11b-vision-preview',
          messages,
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || 'Groq API Error');
      }

      const data = await response.json();
      return { response: data.choices[0].message.content };

    } catch (error: any) {
      console.error("Groq Flow Error:", error);
      return { response: "Извините, возникла техническая проблема. Пожалуйста, попробуйте еще раз." };
    }
  }
);
