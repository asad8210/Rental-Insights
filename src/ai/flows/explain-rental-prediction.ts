'use server';

/**
 * @fileOverview This file defines the Genkit flow for explaining the rental prediction.
 *
 * - explainRentalPrediction - A function that generates a human-like explanation of the rental prediction.
 * - ExplainRentalPredictionInput - The input type for the explainRentalPrediction function.
 * - ExplainRentalPredictionOutput - The return type for the explainRentalPrediction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainRentalPredictionInputSchema = z.object({
  detectedFeatures: z.array(z.string()).describe('List of detected features in the room.'),
  estimatedRentRange: z
    .object({
      lower: z.number(),
      upper: z.number(),
    })
    .describe('The estimated rental range (lower and upper bounds).'),
  pricingDetails: z.record(z.string(), z.number()).describe('Details of how each feature influences the price.'),
});
export type ExplainRentalPredictionInput = z.infer<typeof ExplainRentalPredictionInputSchema>;

const ExplainRentalPredictionOutputSchema = z.object({
  explanation: z.string().describe('A human-like explanation of the rental prediction.'),
});
export type ExplainRentalPredictionOutput = z.infer<typeof ExplainRentalPredictionOutputSchema>;

export async function explainRentalPrediction(
  input: ExplainRentalPredictionInput
): Promise<ExplainRentalPredictionOutput> {
  return explainRentalPredictionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainRentalPredictionPrompt',
  input: {schema: ExplainRentalPredictionInputSchema},
  output: {schema: ExplainRentalPredictionOutputSchema},
  prompt: `You are an expert in real estate valuation. You are provided with a list of detected features in a room, an estimated rental range, and details of how each feature influences the price. Your task is to generate a clear, human-like explanation of how the detected features influence the estimated rental price. The explanation should detail which objects and facilities were detected, their impact on the price, and why the estimated rent is reasonable, ensuring transparency and helping the user understand the pricing logic.

Detected Features: {{detectedFeatures}}
Estimated Rental Range: {{estimatedRentRange.lower}} - {{estimatedRentRange.upper}}
Pricing Details: {{pricingDetails}}

Explanation:`,
});

const explainRentalPredictionFlow = ai.defineFlow(
  {
    name: 'explainRentalPredictionFlow',
    inputSchema: ExplainRentalPredictionInputSchema,
    outputSchema: ExplainRentalPredictionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
