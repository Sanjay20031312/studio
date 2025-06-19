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
  summary: z.string().describe('A concise, friendly summary of the transaction status and key details.'),
  receipt: z.string().describe('A detailed receipt for the transaction, formatted for display.'),
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
Be friendly and clear.

Transaction Details:
ID: {{{transactionId}}}
Amount: {{{amount}}} {{{currency}}}
Status: {{{status}}}
Timestamp: {{{timestamp}}}
Payment Method: {{{paymentMethod}}}
Merchant: {{{merchant}}}

Based on these details, provide a "summary" and a "receipt".

For the summary:
If status is "success": "Your transaction of {{{amount}}} {{{currency}}} at {{{merchant}}} on {{{timestamp}}} using {{{paymentMethod}}} was successful. Thank you!"
If status is "failure": "Unfortunately, your transaction of {{{amount}}} {{{currency}}} at {{{merchant}}} on {{{timestamp}}} using {{{paymentMethod}}} failed. Please try again or contact support."

For the receipt, format it clearly like this:
BlockPay Transaction Receipt
--------------------------------
Transaction ID: {{{transactionId}}}
Date: {{{timestamp}}}
Merchant: {{{merchant}}}
Amount: {{{amount}}} {{{currency}}}
Payment Method: {{{paymentMethod}}}
Status: {{{status}}}
--------------------------------
Thank you for using BlockPay.
`,
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
