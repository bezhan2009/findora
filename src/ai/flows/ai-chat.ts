
'use server';
/**
 * @fileOverview Поток ИИ-чата Findora через Groq SDK.
 * Поддерживает текст (Llama 3.3 70B) и зрение (Llava v1.5).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
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
  message: z.string(),
  services: z.array(ServiceSchema),
  providers: z.array(ProviderSchema),
  photoDataUri: z.string().optional(),
});
export type AIChatInput = z.infer<typeof AIChatInputSchema>;

const AIChatOutputSchema = z.object({
  response: z.string(),
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
      // Используем Llava v1.5 для Vision, так как она наиболее стабильна в Groq
      // Для текста используем самую мощную Llama 3.3 70B
      const modelId = input.photoDataUri ? 'llava-v1.5-7b-4096-preview' : 'llama-3.3-70b-versatile';

      const messages: any[] = [
        {
          role: 'system',
          content: `Вы — экспертный ИИ-ассистент маркетплейса Findora (Таджикистан).
Отвечайте на РУССКОМ языке. Будьте дружелюбны и лаконичны.

ПРАВИЛА:
1. Рекомендуйте товары/услуги только из списка ниже.
2. Для товара используйте: SERVICE_CARD[id]
3. Для исполнителя: PROVIDER_CARD[username]
4. Если пользователь прислал фото — проанализируйте его и подберите подходящие услуги.

ДОСТУПНЫЕ УСЛУГИ:
${input.services.slice(0, 20).map(s => `- ID: ${s.id}, ${s.title}, ${s.price} TJS, Категория: ${s.category}`).join('\n')}
`
        }
      ];

      // Добавляем историю (последние 6 сообщений)
      input.history.slice(-6).forEach(msg => {
        messages.push({
          role: msg.role === 'model' ? 'assistant' : 'user',
          content: msg.content
        });
      });

      // Формируем текущее сообщение
      if (input.photoDataUri) {
        messages.push({
          role: 'user',
          content: [
            { type: 'text', text: input.message || 'Что на этом фото?' },
            { 
              type: 'image_url', 
              image_url: { 
                url: input.photoDataUri // URI уже содержит base64 и MIME тип
              } 
            }
          ]
        });
      } else {
        messages.push({ role: 'user', content: input.message });
      }

      const completion = await groq.chat.completions.create({
        model: modelId,
        messages,
        temperature: 0.5,
        max_tokens: 1024,
      });

      const responseText = completion.choices[0]?.message?.content;

      if (!responseText) {
        throw new Error("Пустой ответ от Groq");
      }

      return { response: responseText };

    } catch (error: any) {
      console.error("Groq Chat Error:", error);
      
      if (error?.status === 429) {
          return { response: "Извините, сейчас слишком много запросов. Пожалуйста, подождите минуту и попробуйте снова." };
      }
      
      // Если Vision модель выдала 400 (например, формат фото не подошел), пробуем объяснить
      if (input.photoDataUri && error?.status === 400) {
          return { response: "К сожалению, мне не удалось распознать это изображение. Попробуйте отправить его в другом формате (JPG/PNG) или опишите текстом." };
      }

      return { 
        response: `Извините, возникла заминка при обработке вашего сообщения. Попробуйте отправить его снова через несколько секунд.` 
      };
    }
  }
);
