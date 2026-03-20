
'use server';
/**
 * @fileOverview Генерация контента через Groq API.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GROQ_API_KEY = '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';

const ContentCreatorInputSchema = z.object({
  prompt: z.string().describe("The user's high-level prompt."),
  tone: z.enum(['formal', 'casual']).describe('Tone.'),
  length: z.enum(['short', 'medium', 'long']).describe('Length.'),
});
export type ContentCreatorInput = z.infer<typeof ContentCreatorInputSchema>;

const ContentCreatorOutputSchema = z.object({
  markdown: z.string(),
  meta: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    images: z.array(z.object({
        url: z.string(),
        alt: z.string(),
        caption: z.string()
    })),
    publish_ready: z.boolean(),
    created_at: z.string(),
  }),
});
export type ContentCreatorOutput = z.infer<typeof ContentCreatorOutputSchema>;

export async function createContent(input: ContentCreatorInput): Promise<ContentCreatorOutput> {
  return contentCreatorFlow(input);
}

const contentCreatorFlow = ai.defineFlow(
  {
    name: 'contentCreatorFlow',
    inputSchema: ContentCreatorInputSchema,
    outputSchema: ContentCreatorOutputSchema,
  },
  async input => {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `You are an expert content creator. Generate a complete article in Russian based on the user's request.
Return ONLY a valid JSON object with keys: "markdown" (string) and "meta" (object).
The markdown should include # Title, ## Sections, and a ## Photos section at the end.
Tone: ${input.tone}, Length: ${input.length}.`
            },
            { role: 'user', content: input.prompt }
          ],
          response_format: { type: 'json_object' }
        }),
      });

      if (!response.ok) throw new Error('Groq Error');

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      throw new Error("Failed to generate content via Groq");
    }
  }
);
