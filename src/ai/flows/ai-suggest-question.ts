'use server';

/**
 * @fileOverview A flow for suggesting poll questions based on a topic.
 *
 * - suggestQuestion - A function that suggests a poll question based on a topic.
 * - SuggestQuestionInput - The input type for the suggestQuestion function.
 * - SuggestQuestionOutput - The return type for the suggestQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestQuestionInputSchema = z.object({
  topic: z.string().describe('The topic for which to suggest a poll question.'),
});
export type SuggestQuestionInput = z.infer<typeof SuggestQuestionInputSchema>;

const SuggestQuestionOutputSchema = z.object({
  question: z.string().describe('The suggested poll question.'),
  shouldSuggest: z.boolean().describe('A boolean value that determines if the question suggestion would be beneficial to the poll creator.'),
});
export type SuggestQuestionOutput = z.infer<typeof SuggestQuestionOutputSchema>;

export async function suggestQuestion(input: SuggestQuestionInput): Promise<SuggestQuestionOutput> {
  return suggestQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestQuestionPrompt',
  input: {schema: SuggestQuestionInputSchema},
  output: {schema: SuggestQuestionOutputSchema},
  prompt: `You are an AI assistant designed to suggest poll questions based on a given topic.

  Given the topic: {{{topic}}}

  Suggest a relevant and engaging poll question. The question should be clear, concise, and suitable for a general audience.

  Also, determine if suggesting a question would be beneficial to the poll creator. If the topic is very vague or broad, then you should suggest a question and mark shouldSuggest as true. If the topic is very specific and it is likely the user already has a question in mind, mark shouldSuggest as false.
  `,
});

const suggestQuestionFlow = ai.defineFlow(
  {
    name: 'suggestQuestionFlow',
    inputSchema: SuggestQuestionInputSchema,
    outputSchema: SuggestQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
