
'use server';
/**
 * @fileOverview A simple AI chat flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
  response: z.string().describe('The AI\'s response to the user.'),
});
export type AIChatOutput = z.infer<typeof AIChatOutputSchema>;


export async function aiChat(input: AIChatInput): Promise<AIChatOutput> {
  return aiChatFlow(input);
}

// Define the prompt for the AI model
const chatPrompt = ai.definePrompt(
  {
    name: 'aiChatPrompt',
    input: {schema: AIChatInputSchema},
    output: {schema: AIChatOutputSchema},
    prompt: `You are a friendly and helpful AI assistant for BizMart, a marketplace for services.
Your goal is to help users find services, answer their questions about the platform, and provide recommendations.

You can communicate in multiple languages. If a user messages you in Tajik (тоҷикӣ), you MUST respond in Tajik.

Keep your responses concise and friendly.

Here is the conversation history:
{{#each history}}
{{role}}: {{content}}
{{/each}}

User: {{{message}}}
AI Assistant:`,
  }
);


const aiChatFlow = ai.defineFlow(
  {
    name: 'aiChatFlow',
    inputSchema: AIChatInputSchema,
    outputSchema: AIChatOutputSchema,
  },
  async (input) => {
    const {output} = await chatPrompt(input);
    if (!output) {
      return { response: "I'm sorry, I couldn't generate a response." };
    }
    return { response: output.response };
  }
);

    