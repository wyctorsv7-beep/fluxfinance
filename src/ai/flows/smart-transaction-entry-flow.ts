'use server';
/**
 * @fileOverview A Genkit flow for extracting transaction details from natural language and suggesting a category.
 *
 * - extractTransactionDetails - A function that handles the transaction detail extraction process.
 * - SmartTransactionEntryInput - The input type for the extractTransactionDetails function.
 * - SmartTransactionEntryOutput - The return type for the extractTransactionDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartTransactionEntryInputSchema = z.object({
  transactionDescription: z.string().describe('A natural language description of a financial transaction (e.g., "Paid $35 for dinner with friends").'),
});
export type SmartTransactionEntryInput = z.infer<typeof SmartTransactionEntryInputSchema>;

const SmartTransactionEntryOutputSchema = z.object({
  amount: z.number().describe('The numerical amount of the transaction. If no currency is specified, assume USD.'),
  description: z.string().describe('A concise description of the transaction.'),
  suggestedCategory: z.string().describe('A suggested category for the transaction (e.g., "Alimentação", "Transporte", "Lazer", "Salário", "Investimento", "Moradia", "Educação", "Saúde").'),
});
export type SmartTransactionEntryOutput = z.infer<typeof SmartTransactionEntryOutputSchema>;

export async function extractTransactionDetails(input: SmartTransactionEntryInput): Promise<SmartTransactionEntryOutput> {
  return smartTransactionEntryFlow(input);
}

const smartTransactionEntryPrompt = ai.definePrompt({
  name: 'smartTransactionEntryPrompt',
  input: {schema: SmartTransactionEntryInputSchema},
  output: {schema: SmartTransactionEntryOutputSchema},
  prompt: `You are an AI assistant designed to extract financial transaction details and suggest a category.
Extract the amount, a concise description, and suggest a category from the following natural language transaction description.
If no currency is explicitly mentioned, assume USD for the amount.
Choose a category from a common set such as "Alimentação", "Transporte", "Lazer", "Salário", "Investimento", "Moradia", "Educação", "Saúde", or create a new relevant one if none fit well.

Transaction description: {{{transactionDescription}}}`,
});

const smartTransactionEntryFlow = ai.defineFlow(
  {
    name: 'smartTransactionEntryFlow',
    inputSchema: SmartTransactionEntryInputSchema,
    outputSchema: SmartTransactionEntryOutputSchema,
  },
  async input => {
    const {output} = await smartTransactionEntryPrompt(input);
    return output!;
  }
);
