
'use server';
/**
 * @fileOverview A simple AI chat flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Service } from '@/lib/types';

// Define the schema for a single message in the chat history
const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
  photoDataUri: z.string().optional(),
});

// Define the service schema for the input
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


// Define the input schema for the chat flow
const AIChatInputSchema = z.object({
  history: z.array(ChatMessageSchema),
  message: z.string().describe('The latest message from the user.'),
  services: z.array(ServiceSchema).describe('The list of available services/products.'),
  providers: z.array(ProviderSchema).describe('The list of available service providers.'),
  photoDataUri: z.string().optional().describe("An optional photo provided by the user, as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type AIChatInput = z.infer<typeof AIChatInputSchema>;

// Define the output schema for the chat flow
const AIChatOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the user. This can be plain text or Markdown. If you are recommending a service, format it as a special block: SERVICE_CARD[service_id]. If you are recommending a provider, use: PROVIDER_CARD[provider_username]. For example: SERVICE_CARD[service-1] or PROVIDER_CARD[alicej]'),
});
export type AIChatOutput = z.infer<typeof AIChatOutputSchema>;

// Augment the prompt with service and provider data
function buildSystemPrompt(services: Service[], providers: z.infer<typeof ProviderSchema>[]): string {
    const serviceList = services.map(s => 
        `- ID: ${s.id}, Title: ${s.title}, Description: ${s.description.substring(0, 100)}..., Price: ${s.price} TJS, Category: ${s.category}, Rating: ${s.rating.toFixed(1)}`
    ).join('\n');

    const providerList = providers.map(p =>
        `- Username: ${p.username}, Name: ${p.name}, Bio: ${p.bio.substring(0, 100)}..., Rating: ${p.rating.toFixed(1)}`
    ).join('\n');

    return `You are a friendly and helpful AI assistant for BizMart, a marketplace for services.
Your goal is to help users find services, providers, answer their questions about the platform, and provide recommendations.
You MUST ALWAYS respond in Russian, unless the user explicitly asks you to switch to another language.
You should respond in a conversational, verbose style, like ChatGPT.

If the user provides an image, your primary task is to analyze the image and use it as the main context for the search. First, describe what you see in the image, then find relevant services or providers from the lists below.

When a user asks for a recommendation or shows interest in a service, you MUST recommend a service from the list below.
When you recommend a service, you MUST use the following format and nothing else for that part of the response:
SERVICE_CARD[service_id]

When a user asks to find a seller, freelancer, or provider, you MUST recommend a provider from the list below.
When you recommend a provider, you MUST use the following format and nothing else for that part of the response:
PROVIDER_CARD[provider_username]

If the user asks to sort or find the "best" services or providers, use their ratings to determine the order.

For example, if the user wants a logo, you can say:
"Конечно, я могу помочь с этим! Профессиональный логотип - ключ к идентичности бренда. Я рекомендую эту услугу:
SERVICE_CARD[service-3]
Возможно, вас также заинтересует дизайнер Боб:
PROVIDER_CARD[bobw]"

Here is the list of available services:
${serviceList}

Here is the list of available providers:
${providerList}

Keep your responses concise and friendly.
`;
}


export async function aiChat(input: AIChatInput): Promise<AIChatOutput> {
  const systemPrompt = buildSystemPrompt(input.services, input.providers);
  
  const promptParts = [systemPrompt];

  promptParts.push(`
Here is the conversation history:
{{#each history}}
**{{role}}**: 
{{#if photoDataUri}}
{{media url=photoDataUri}}
{{/if}}
{{{content}}}
{{/each}}

**user**: 
{{#if photoDataUri}}
{{media url=photoDataUri}}
{{/if}}
{{{message}}}
`);

  promptParts.push(`**model**:`);

  const chatPrompt = ai.definePrompt(
    {
      name: 'aiChatPrompt_dynamic_v5_with_image_in_history',
      input: {schema: z.object({
        history: z.array(ChatMessageSchema),
        message: z.string(),
        photoDataUri: z.string().optional(),
      })},
      output: {schema: AIChatOutputSchema},
      prompt: promptParts.join('\n'),
    }
  );

  const {output} = await chatPrompt({
    history: input.history,
    message: input.message,
    photoDataUri: input.photoDataUri,
  });
  if (!output) {
    return { response: "I'm sorry, I couldn't generate a response." };
  }
  return { response: output.response };
}
