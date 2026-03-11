'use server';
/**
 * @fileOverview Оптимизированный поток AI чата для Findora с использованием актуального плагина google-genai.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Схема услуги
const ServiceSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  rating: z.number(),
});

// Схема исполнителя
const ProviderSchema = z.object({
    username: z.string(),
    name: z.string(),
    bio: z.string(),
    role: z.string(),
    rating: z.number(),
});

// Схема сообщения истории
const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
  photoDataUri: z.string().optional(),
});

// Схема входных данных для чата
const AIChatInputSchema = z.object({
  history: z.array(ChatMessageSchema),
  message: z.string().describe('Последнее сообщение пользователя.'),
  services: z.array(ServiceSchema).describe('Список доступных услуг/товаров.'),
  providers: z.array(ProviderSchema).describe('Список доступных исполнителей.'),
  photoDataUri: z.string().optional().describe("Опциональное фото от пользователя в формате Data URI."),
});
export type AIChatInput = z.infer<typeof AIChatInputSchema>;

// Схема выходных данных
const AIChatOutputSchema = z.object({
  response: z.string().describe('Ответ ИИ. Может содержать Markdown и специальные блоки SERVICE_CARD[id] или PROVIDER_CARD[username].'),
});
export type AIChatOutput = z.infer<typeof AIChatOutputSchema>;

/**
 * Определение промпта Findora. 
 */
const findoraChatPrompt = ai.definePrompt(
  {
    name: 'findora_chat_v5',
    input: { schema: AIChatInputSchema },
    output: { schema: AIChatOutputSchema },
    prompt: `Вы — дружелюбный и профессиональный ИИ-ассистент платформы Findora (маркетплейс услуг и товаров).
Ваша цель: помогать пользователям находить лучшие предложения, выбирать исполнителей и отвечать на вопросы о платформе.

ПРАВИЛА ОТВЕТА:
1. ВСЕГДА отвечайте на РУССКОМ языке.
2. Стиль общения: дружелюбный, лаконичный, как в ChatGPT.
3. Если пользователь прислал фото — проанализируйте его и предложите подходящие товары или услуги из списка ниже.
4. Для рекомендации товара используйте блок: SERVICE_CARD[service_id]
5. Для рекомендации исполнителя используйте блок: PROVIDER_CARD[provider_username]

ДОСТУПНЫЕ УСЛУГИ:
{{#each services}}
- ID: {{id}}, Название: {{title}}, Цена: {{price}} TJS, Категория: {{category}}, Рейтинг: {{rating}}
{{/each}}

ДОСТУПНЫЕ ИСПОЛНИТЕЛИ:
{{#each providers}}
- Username: {{username}}, Имя: {{name}}, Рейтинг: {{rating}}
{{/each}}

ИСТОРИЯ ДИАЛОГА:
{{#each history}}
**{{role}}**: 
{{#if photoDataUri}}{{media url=photoDataUri}}{{/if}}
{{{content}}}
{{/each}}

**user**: 
{{#if photoDataUri}}{{media url=photoDataUri}}{{/if}}
{{{message}}}

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
      const { output } = await findoraChatPrompt(input);
      if (!output) {
        throw new Error("Empty output from AI model");
      }
      return output;
    } catch (error: any) {
      console.error("Genkit Flow Error Detail:", error);
      return { response: `Ошибка ИИ: ${error?.message || "Неизвестная ошибка"}. Пожалуйста, попробуйте обновить страницу.` };
    }
  }
);

/**
 * Обертка для вызова потока из клиентских компонентов.
 */
export async function aiChat(input: AIChatInput): Promise<AIChatOutput> {
  return findoraChatFlow(input);
}
