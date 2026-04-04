'use server';
/**
 * @fileOverview An AI assistant that analyzes user spending patterns and provides personalized financial insights and suggestions.
 *
 * - personalizeSpendingInsights - A function that triggers the AI analysis of spending data.
 * - PersonalizedSpendingInsightsInput - The input type for the personalizeSpendingInsights function.
 * - PersonalizedSpendingInsightsOutput - The return type for the personalizeSpendingInsights function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TransactionSchema = z.object({
  date: z.string().describe('The date of the transaction in YYYY-MM-DD format.'),
  description: z.string().describe('A brief description of the transaction.'),
  amount: z.number().describe('The amount of the transaction. Positive for income, negative for expense.'),
  type: z.enum(['expense', 'income']).describe('The type of transaction.'),
  category: z.string().describe('The category of the transaction (e.g., Food, Transport, Salary).'),
});

const PersonalizedSpendingInsightsInputSchema = z.object({
  transactions: z.array(TransactionSchema).describe('A list of the user\'s financial transactions.'),
  budgetSummary: z.string().optional().describe('An optional summary of the user\'s current budget limits or targets.'),
  financialGoals: z.string().optional().describe('An optional description of the user\'s financial goals.'),
});
export type PersonalizedSpendingInsightsInput = z.infer<typeof PersonalizedSpendingInsightsInputSchema>;

const PersonalizedSpendingInsightsOutputSchema = z.object({
  overallSummary: z.string().describe('A concise summary of the user\'s spending habits.'),
  spendingBreakdown: z.record(z.string(), z.number()).describe('A breakdown of spending by category, showing total amount for each.'),
  savingSuggestions: z.array(z.string()).describe('A list of actionable suggestions for saving money.'),
  budgetOptimizationTips: z.array(z.string()).describe('A list of tips to optimize the user\'s budget.'),
});
export type PersonalizedSpendingInsightsOutput = z.infer<typeof PersonalizedSpendingInsightsOutputSchema>;

export async function personalizeSpendingInsights(input: PersonalizedSpendingInsightsInput): Promise<PersonalizedSpendingInsightsOutput> {
  return personalizedSpendingInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedSpendingInsightsPrompt',
  model: 'googleai/gemini-2.0-flash',
  input: { schema: PersonalizedSpendingInsightsInputSchema },
  output: { schema: PersonalizedSpendingInsightsOutputSchema },
  prompt: `You are an expert financial advisor. Analyze the provided financial transactions to identify patterns, strengths, and weaknesses in the user's spending habits.

Transactions:
{{#each transactions}}- Date: {{{date}}}, Description: {{{description}}}, Amount: {{{amount}}}, Type: {{{type}}}, Category: {{{category}}}
{{/each}}

{{#if budgetSummary}}
User's Budget Summary: {{{budgetSummary}}}
{{/if}}

{{#if financialGoals}}
User's Financial Goals: {{{financialGoals}}}
{{/if}}

Provide an overall summary of their spending, a breakdown of expenses by category, actionable saving suggestions, and tips for budget optimization. Ensure all suggestions are personalized and practical given the provided data.`,
});

const personalizedSpendingInsightsFlow = ai.defineFlow(
  {
    name: 'personalizedSpendingInsightsFlow',
    inputSchema: PersonalizedSpendingInsightsInputSchema,
    outputSchema: PersonalizedSpendingInsightsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
