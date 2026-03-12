
'use server';
/**
 * @fileOverview Оптимизированный поток AI чата для Findora с ограничением контекста.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Схемы данных
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
  photoDataUri: z.string().optional().describe("Опциональное фото от пользователя в формате Data URI."),
});
export type AIChatInput = z.infer<typeof AIChatInputSchema>;

const AIChatOutputSchema = z.object({
  response: z.string().describe('Ответ ИИ.'),
});
export type AIChatOutput = z.infer<typeof AIChatOutputSchema>;

/**
 * Определение промпта Findora. 
 */
const findoraChatPrompt = ai.definePrompt(
  {
    name: 'findora_chat_v10',
    input: { schema: AIChatInputSchema },
    output: { schema: AIChatOutputSchema },
    prompt: `Вы — дружелюбный ИИ-ассистент платформы Findora (маркетплейс в Таджикистане).
Отвечайте на РУССКОМ языке. Лаконично и полезно.

Для рекомендации товара используйте: SERVICE_CARD[id]
Для рекомендации исполнителя: PROVIDER_CARD[username]

ДОСТУПНЫЕ УСЛУГИ:
{{#each services}}
- ID: {{id}}, {{title}}, {{price}} TJS, {{category}}
{{/each}}

ИСТОРИЯ ДИАЛОГА:
{{#each history}}
**{{role}}**: {{{content}}}
{{/each}}

**user**: {{{message}}}
**model**:`,
  }
);

/**
 * Определение потока (Flow) для чата.
 */
const findoraChatFlow = ai.defineFlow(
  {
    name: 'findoraChatFlow',
    inputSchema: AIChatInputSchema,
    outputSchema: AIChatOutputSchema,
  },
  async (input) => {
    try {
      // ОГРАНИЧЕНИЕ КОНТЕКСТА: берем только последние 6 сообщений, чтобы не вылетать за квоты токенов
      const limitedHistory = input.history.slice(-6);
      
      const { output } = await findoraChatPrompt({
        ...input,
        history: limitedHistory
      });
      
      if (!output) throw new Error("Empty output");
      return output;
    } catch (error: any) {
      console.error("Genkit Flow Error:", error);
      
      // Специальная обработка для ошибок квот (429)
      if (error.message?.includes("429") || error.message?.includes("quota") || error.message?.includes("exhausted")) {
        return { response: "Извините, я получил слишком много запросов за короткое время. Пожалуйста, подождите 30-60 секунд и я снова буду готов вам помочь! 🙏" };
      }
      
      return { response: "Извините, возникла техническая проблема. Пожалуйста, обновите страницу." };
    }
  }
);

export async function aiChat(input: AIChatInput): Promise<AIChatOutput> {
  return findoraChatFlow(input);
}
