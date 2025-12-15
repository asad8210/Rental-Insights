'use server';

/**
 * @fileOverview Merges object detections from multiple images into a single, deduplicated list.
 *
 * - mergeDetections - A function that merges detections from multiple images.
 * - MergeDetectionsInput - The input type for the mergeDetections function.
 * - MergeDetectionsOutput - The return type for the mergeDetections function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ObjectDetectionSchema = z.object({
  label: z.string().describe('The label of the detected object.'),
  confidence: z
    .number()
    .describe('The confidence score of the object detection.'),
});

export type ObjectDetection = z.infer<typeof ObjectDetectionSchema>;

const MergeDetectionsInputSchema = z.object({
  imageDetections: z
    .array(z.array(ObjectDetectionSchema))
    .describe(
      'An array of object detection arrays, where each inner array represents the object detections from a single image.'
    ),
});
export type MergeDetectionsInput = z.infer<typeof MergeDetectionsInputSchema>;

const MergeDetectionsOutputSchema = z.object({
  mergedDetections: z
    .array(ObjectDetectionSchema)
    .describe('The merged and deduplicated list of object detections.'),
  explanation: z
    .string()
    .describe(
      'A human-readable explanation of how the detections were merged and deduplicated.'
    ),
});
export type MergeDetectionsOutput = z.infer<typeof MergeDetectionsOutputSchema>;

export async function mergeDetections(input: MergeDetectionsInput): Promise<MergeDetectionsOutput> {
  return mergeDetectionsFlow(input);
}

const mergeDetectionsPrompt = ai.definePrompt({
  name: 'mergeDetectionsPrompt',
  input: {schema: MergeDetectionsInputSchema},
  output: {schema: MergeDetectionsOutputSchema},
  prompt: `You are an expert in analyzing object detections from multiple images of a room and merging them into a single, comprehensive, and deduplicated list.

You are given an array of image detections, where each inner array represents the object detections from a single image. Each object detection has a label and a confidence score.

Your task is to merge these detections, eliminating any duplicates, and create a single list of unique object detections.  Consider detections with the same label to be duplicates.
For duplicate detections (same label), keep the one with the highest confidence score.

Also, generate a human-readable explanation of how the detections were merged and deduplicated.  This explanation should describe the process you followed, including how duplicates were handled and why the resulting list is a comprehensive and accurate representation of the room's contents.

Here is the input data:

{{json imageDetections}}

Return the merged detections and the explanation in the following JSON format:

{{json output}}`,
});

const mergeDetectionsFlow = ai.defineFlow(
  {
    name: 'mergeDetectionsFlow',
    inputSchema: MergeDetectionsInputSchema,
    outputSchema: MergeDetectionsOutputSchema,
  },
  async input => {
    const {output} = await mergeDetectionsPrompt(input);
    return output!;
  }
);
