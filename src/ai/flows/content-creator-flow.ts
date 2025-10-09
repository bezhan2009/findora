
'use server';
/**
 * @fileOverview A flow for generating content like blog posts or service descriptions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContentCreatorInputSchema = z.object({
  prompt: z.string().describe('The user\'s high-level prompt for the content to be generated.'),
  tone: z.enum(['formal', 'casual']).describe('The desired tone of the content.'),
  length: z.enum(['short', 'medium', 'long']).describe('The desired length of the content body.'),
});
export type ContentCreatorInput = z.infer<typeof ContentCreatorInputSchema>;

const ContentCreatorOutputSchema = z.object({
  title: z.string().describe('A compelling and relevant title for the content.'),
  body: z.string().describe('The main body of the generated content, written in markdown format.'),
});
export type ContentCreatorOutput = z.infer<typeof ContentCreatorOutputSchema>;

export async function createContent(input: ContentCreatorInput): Promise<ContentCreatorOutput> {
  return contentCreatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contentCreatorPrompt',
  input: {schema: ContentCreatorInputSchema},
  output: {schema: ContentCreatorOutputSchema},
  prompt: `You are an expert content creator for a services marketplace called BizMart.
Your task is to generate a compelling piece of content based on the user's request.

Generate a title and a body for the content. The body should be in markdown format.

User Prompt: "{{prompt}}"
Tone: {{tone}}
Length: {{length}}

Adhere to the requested tone and length. For length, 'short' should be about 1-2 paragraphs, 'medium' 3-5 paragraphs, and 'long' 6 or more paragraphs.`,
});

const contentCreatorFlow = ai.defineFlow(
  {
    name: 'contentCreatorFlow',
    inputSchema: ContentCreatorInputSchema,
    outputSchema: ContentCreatorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("The AI model failed to generate content.");
    }
    return output;
  }
);
