
'use server';
/**
 * @fileOverview A flow for generating structured content like blog posts or service descriptions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContentCreatorInputSchema = z.object({
  prompt: z.string().describe("The user's high-level prompt for the content to be generated."),
  tone: z.enum(['formal', 'casual']).describe('The desired tone of the content.'),
  length: z.enum(['short', 'medium', 'long']).describe('The desired length of the content body.'),
});
export type ContentCreatorInput = z.infer<typeof ContentCreatorInputSchema>;

const MetaSchema = z.object({
    title: z.string().describe("The same text as the top-level title in the markdown."),
    summary: z.string().describe("A 1-2 sentence plain-text summary of the article."),
    tags: z.array(z.string()).describe("An array of up to 6 relevant string tags."),
    images: z.array(z.object({
        url: z.string().url().describe("URL of the image. Use a placeholder like https://placehold.co/800x600 if no real image is available."),
        alt: z.string().describe("Descriptive alt text for the image."),
        caption: z.string().describe("A short caption for the image.")
    })).describe("An array of image objects related to the content."),
    publish_ready: z.boolean().describe("Set to true if the article is polished and ready to publish, otherwise false."),
    created_at: z.string().datetime().describe("The ISO 8601 timestamp of when the content was created."),
});

const ContentCreatorOutputSchema = z.object({
  markdown: z.string().describe("The full article content in valid Markdown format. It must start with a # Title, include ## Sections, use bold for emphasis, and have a '## Photos' section where each image is listed as '- ![alt]({url})' with a caption on the next line."),
  meta: MetaSchema.describe("A metadata object containing title, summary, tags, images, and other structured data."),
});
export type ContentCreatorOutput = z.infer<typeof ContentCreatorOutputSchema>;

export async function createContent(input: ContentCreatorInput): Promise<ContentCreatorOutput> {
  return contentCreatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contentCreatorPrompt',
  input: {schema: ContentCreatorInputSchema},
  output: {schema: ContentCreatorOutputSchema},
  prompt: `You are an expert content creator assistant. Your task is to generate a complete article based on the user's request and return it as a single, valid JSON object with two keys: "markdown" and "meta".

Follow these instructions precisely:

1. Markdown Content ("markdown" key):
- The content must be in proper Markdown syntax.
- Start with a single top-level title (e.g., "# My Article Title").
- Include an introductory paragraph.
- Use '##' for section headings.
- Use '**' for bold emphasis and '---' for horizontal rules where appropriate.
- Include a dedicated "## Photos" section at the end. Each photo should be an itemized entry like "- ![alt text]({url})" followed by its caption on a new line. All images in the markdown must come from the 'meta.images' array.
- Do not use any HTML tags.

2. Metadata Object ("meta" key):
- "title": A string that is identical to the markdown's top-level title.
- "summary": A concise 1-2 sentence summary of the article.
- "tags": An array of up to 6 relevant string tags.
- "images": An array of image objects, each with a "url", "alt", and "caption". If a real image is not available, use a placeholder URL like "https://placehold.co/800x600".
- "publish_ready": A boolean. Set to 'true' if the article is complete and polished, otherwise 'false' (e.g., if using placeholder images).
- "created_at": The current ISO 8601 timestamp.

3. Content Style:
- The tone should be {{tone}}.
- The length should be {{length}}. 'short' is 1-2 paragraphs, 'medium' is 3-5, 'long' is 6+.

User Prompt: "{{prompt}}"
`,
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
