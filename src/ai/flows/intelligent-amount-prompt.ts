'use server';

/**
 * @fileOverview A flow to suggest typical payment amounts based on purchase history.
 *
 * - suggestPaymentAmount - A function that suggests a payment amount based on purchase history.
 * - SuggestPaymentAmountInput - The input type for the suggestPaymentAmount function.
 * - SuggestPaymentAmountOutput - The return type for the suggestPaymentAmount function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPaymentAmountInputSchema = z.object({
  purchaseHistory: z
    .string()
    .describe('The user purchase history at Walmart.'),
  currentItem: z
    .string()
    .describe('The item the user is currently purchasing.'),
});
export type SuggestPaymentAmountInput = z.infer<typeof SuggestPaymentAmountInputSchema>;

const SuggestPaymentAmountOutputSchema = z.object({
  suggestedAmount: z
    .number()
    .describe('The suggested payment amount based on purchase history.'),
});
export type SuggestPaymentAmountOutput = z.infer<typeof SuggestPaymentAmountOutputSchema>;

export async function suggestPaymentAmount(input: SuggestPaymentAmountInput): Promise<SuggestPaymentAmountOutput> {
  return suggestPaymentAmountFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPaymentAmountPrompt',
  input: {schema: SuggestPaymentAmountInputSchema},
  output: {schema: SuggestPaymentAmountOutputSchema},
  prompt: `You are a payment assistant for Walmart.

  Based on the user's purchase history and current item, suggest a payment amount.

  Purchase History: {{{purchaseHistory}}}
  Current Item: {{{currentItem}}}

  Suggested Amount: `,
});

const suggestPaymentAmountFlow = ai.defineFlow(
  {
    name: 'suggestPaymentAmountFlow',
    inputSchema: SuggestPaymentAmountInputSchema,
    outputSchema: SuggestPaymentAmountOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      suggestedAmount: parseFloat(output!.suggestedAmount.toString()),
    };
  }
);
