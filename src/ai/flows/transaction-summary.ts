'use server';
/**
 * @fileOverview Generates a summary of a transaction, including its success or failure status, and a receipt.
 *
 * - transactionSummary - A function that handles the transaction summary generation process.
 * - TransactionSummaryInput - The input type for the transactionSummary function.
 * - TransactionSummaryOutput - The return type for the transactionSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TransactionSummaryInputSchema = z.object({
  transactionId: z.string().describe('The ID of the transaction.'),
  amount: z.number().describe('The amount of the transaction.'),
  currency: z.string().describe('The currency of the transaction.'),
  status: z.enum(['success', 'failure']).describe('The status of the transaction.'),
  timestamp: z.string().describe('The timestamp of the transaction.'),
  paymentMethod: z.string().describe('The payment method used for the transaction.'),
  merchant: z.string().describe('The merchant where the transaction occurred.'),
});
export type TransactionSummaryInput = z.infer<typeof TransactionSummaryInputSchema>;

const TransactionSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the transaction.'),
  receipt: z.string().describe('A receipt for the transaction.'),
});
export type TransactionSummaryOutput = z.infer<typeof TransactionSummaryOutputSchema>;

export async function transactionSummary(input: TransactionSummaryInput): Promise<TransactionSummaryOutput> {
  return transactionSummaryFlow(input);
}

const transactionSummaryPrompt = ai.definePrompt({
  name: 'transactionSummaryPrompt',
  input: {schema: TransactionSummaryInputSchema},
  output: {schema: TransactionSummaryOutputSchema},
  prompt: `You are generating a transaction summary and receipt for a user.

Transaction ID: {{{transactionId}}}
Amount: {{{amount}}} {{{currency}}}
Status: {{{status}}}
Timestamp: {{{timestamp}}}
Payment Method: {{{paymentMethod}}}
Merchant: {{{merchant}}}

Summary:
{{#if (eq status \"success\")}}
  Your transaction of {{{amount}}} {{{currency}}} at {{{merchant}}} on {{{timestamp}}} using {{{paymentMethod}}} was successful.
{{else}}
  Your transaction of {{{amount}}} {{{currency}}} at {{{merchant}}} on {{{timestamp}}} using {{{paymentMethod}}} failed.
{{/if}}

Receipt:
Transaction ID: {{{transactionId}}}
Amount: {{{amount}}} {{{currency}}}
Status: {{{status}}}
Timestamp: {{{timestamp}}}
Payment Method: {{{paymentMethod}}}
Merchant: {{{merchant}}}`,
});

const transactionSummaryFlow = ai.defineFlow(
  {
    name: 'transactionSummaryFlow',
    inputSchema: TransactionSummaryInputSchema,
    outputSchema: TransactionSummaryOutputSchema,
  },
  async input => {
    const {output} = await transactionSummaryPrompt(input);
    return output!;
  }
);
