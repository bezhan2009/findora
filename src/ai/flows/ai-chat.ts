'use server';
/**
 * @fileOverview Поток ИИ-чата Findora через Groq SDK.
 * Использует модель Vision для анализа фото и Llama 3.3 для текста.
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
    const VISION_MODEL = 'llama-3.2-90b-vision-preview';
    const TEXT_MODEL = 'llama-3.3-70b-versatile';
    
    try {
      const modelId = input.photoDataUri ? VISION_MODEL : TEXT_MODEL;

      const messages: any[] = [
        {
          role: 'system',
          content: `Вы — экспертный ИИ-ассистент маркетплейса Findora (Таджикистан). 
Отвечайте на РУССКОМ языке. Будьте дружелюбны и лаконичны.

ПРАВИЛА ОТОБРАЖЕНИЯ КАРТОЧЕК:
1. Рекомендуйте товары/услуги только из списка ниже.
2. Для вставки карточки товара используйте СТРОГО формат: SERVICE_CARD[id]
3. Для вставки профиля специалиста: PROVIDER_CARD[username]
4. ВАЖНО: Пишите карточку с новой строки. НЕ ставьте точки, скобки или другие знаки препинания сразу после закрывающей скобки ]. 
5. Пример плохого ответа: "Вот этот товар: SERVICE_CARD[123]."
6. Пример хорошего ответа: "Рекомендую обратить внимание на этот вариант:\nSERVICE_CARD[123]\nОн отлично подойдет."

ДОСТУПНЫЕ УСЛУГИ:
${input.services.slice(0, 20).map(s => `- ID: ${s.id}, ${s.title}, ${s.price} TJS, Категория: ${s.category}`).join('\n')}
`
        }
      ];

      input.history.slice(-6).forEach(msg => {
        messages.push({
          role: msg.role === 'model' ? 'assistant' : 'user',
          content: msg.content
        });
      });

      if (input.photoDataUri) {
        messages.push({
          role: 'user',
          content: [
            { type: 'text', text: input.message || 'Что на этом фото? Подбери подходящие услуги Findora.' },
            { 
              type: 'image_url', 
              image_url: { 
                url: input.photoDataUri 
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
        temperature: 0.4, // Немного снижаем температуру для более четкого следования тегам
        max_tokens: 1024,
      });

      const responseText = completion.choices[0]?.message?.content;

      if (!responseText) {
        throw new Error("Пустой ответ от Groq");
      }

      return { response: responseText };

    } catch (error: any) {
      console.error("Groq Chat Error:", error);
      return { 
        response: `Извините, возникла заминка при обработке вашего сообщения. Попробуйте еще раз через несколько секунд.` 
      };
    }
  }
);
