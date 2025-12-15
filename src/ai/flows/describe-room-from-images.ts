'use server';

/**
 * @fileOverview Describes a room based on uploaded images.
 *
 * - describeRoomFromImages - A function that generates a description of a room based on images.
 * - DescribeRoomFromImagesInput - The input type for the describeRoomFromImages function.
 * - DescribeRoomFromImagesOutput - The return type for the describeRoomFromImages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DescribeRoomFromImagesInputSchema = z.object({
  imageUris: z
    .array(z.string())
    .min(1)
    .max(5)
    .describe(
      'An array of 1 to 5 images of a room, as data URIs that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
});
export type DescribeRoomFromImagesInput = z.infer<typeof DescribeRoomFromImagesInputSchema>;

const DescribeRoomFromImagesOutputSchema = z.object({
  description: z.string().describe('A concise description of the room, highlighting key features and condition.'),
});
export type DescribeRoomFromImagesOutput = z.infer<typeof DescribeRoomFromImagesOutputSchema>;

export async function describeRoomFromImages(input: DescribeRoomFromImagesInput): Promise<DescribeRoomFromImagesOutput> {
  return describeRoomFromImagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'describeRoomFromImagesPrompt',
  input: {schema: DescribeRoomFromImagesInputSchema},
  output: {schema: DescribeRoomFromImagesOutputSchema},
  prompt: `You are an AI expert in real estate evaluations. You will be given a series of images of a room.  Your job is to create a concise description of the room\n
Pay close attention to the furniture, appliances and overall quality of the room.

Images:
{{#each imageUris}}
{{media url=this}}
{{/each}}
`,
});

const describeRoomFromImagesFlow = ai.defineFlow(
  {
    name: 'describeRoomFromImagesFlow',
    inputSchema: DescribeRoomFromImagesInputSchema,
    outputSchema: DescribeRoomFromImagesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
