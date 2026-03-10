'use server';
/**
 * @fileOverview A simple AI chat flow for Findora.
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
  response: z.string().describe('The AI\'s response to the user. This can be plain text or Markdown. If you are recommending a service, format it as a special block: SERVICE_CARD[service_id]. If you are recommending a provider, use: PROVIDER_CARD[provider_username].'),
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

    return `You are a friendly and helpful AI assistant for Findora, a modern marketplace for services and products.
Your goal is to help users find the best deals, providers, and answer questions about the Findora platform.
You MUST ALWAYS respond in Russian, unless requested otherwise.
You should respond in a conversational, professional, yet friendly style (like ChatGPT).

If the user provides an image, analyze it and find relevant services on Findora.

When recommending a service, use: SERVICE_CARD[service_id]
When recommending a provider, use: PROVIDER_CARD[provider_username]

Available services:
${serviceList}

Available providers:
${providerList}
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
      name: 'findora_chat_v1',
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
    return { response: "Извините, я не смог сгенерировать ответ. Попробуйте еще раз." };
  }
  return { response: output.response };
}