
'use server';
/**
 * @fileOverview A simple AI chat flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { initialData } from '@/lib/data';
import type { Service } from '@/lib/types';

// Define the schema for a single message in the chat history
const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

// Define the input schema for the chat flow
const AIChatInputSchema = z.object({
  history: z.array(ChatMessageSchema),
  message: z.string().describe('The latest message from the user.'),
});
export type AIChatInput = z.infer<typeof AIChatInputSchema>;

// Define the output schema for the chat flow
const AIChatOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the user. This can be plain text or Markdown. If you are recommending a service, format it as a special block: SERVICE_CARD[service_id]. For example: SERVICE_CARD[service-1]'),
});
export type AIChatOutput = z.infer<typeof AIChatOutputSchema>;

// Augment the prompt with service data
function buildSystemPrompt(services: Service[]): string {
    const serviceList = services.map(s => 
        `- ID: ${s.id}, Title: ${s.title}, Description: ${s.description.substring(0, 100)}..., Price: $${s.price}, Category: ${s.category}`
    ).join('\n');

    return `You are a friendly and helpful AI assistant for BizMart, a marketplace for services.
Your goal is to help users find services, answer their questions about the platform, and provide recommendations.
You should respond in a conversational, verbose style, like ChatGPT.

When a user asks for a recommendation or shows interest in a service, you MUST recommend a service from the list below.
When you recommend a service, you MUST use the following format and nothing else for that part of the response:
SERVICE_CARD[service_id]

For example, if the user wants a logo, you can say:
"Of course, I can help with that! A professional logo is key to brand identity. I recommend this service:
SERVICE_CARD[service-3]"

Here is the list of available services:
${serviceList}

Keep your responses concise and friendly.
You can communicate in multiple languages. If a user messages you in Tajik (тоҷикӣ), you MUST respond in Tajik.
`;
}


export async function aiChat(input: AIChatInput): Promise<AIChatOutput> {
  // Dynamically create the prompt with the latest service data
  const services = initialData.services;
  const systemPrompt = buildSystemPrompt(services);
  
  const chatPrompt = ai.definePrompt(
    {
      name: 'aiChatPrompt_dynamic',
      input: {schema: AIChatInputSchema},
      output: {schema: AIChatOutputSchema},
      prompt: `${systemPrompt}

Here is the conversation history:
{{#each history}}
{{role}}: {{content}}
{{/each}}

User: {{{message}}}
AI Assistant:`,
    }
  );

  const {output} = await chatPrompt(input);
  if (!output) {
    return { response: "I'm sorry, I couldn't generate a response." };
  }
  return { response: output.response };
}
