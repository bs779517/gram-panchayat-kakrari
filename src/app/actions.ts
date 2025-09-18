'use server';

import { suggestQuestion as suggestQuestionFlow } from '@/ai/flows/ai-suggest-question';
import { createPoll, addVote, getPoll } from '@/lib/polls';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const createPollSchema = z.object({
  question: z.string().min(1, 'Question cannot be empty.'),
  options: z.array(z.string().min(1, 'Option cannot be empty.')).min(2, 'Must have at least two options.'),
});

export async function createPollAction(formData: FormData) {
  const question = formData.get('question') as string;
  const options = formData.getAll('options[]').map(String).filter(opt => opt.trim() !== '');

  const validated = createPollSchema.safeParse({ question, options });

  if (!validated.success) {
    throw new Error(validated.error.errors.map(e => e.message).join(', '));
  }

  const newPoll = createPoll(validated.data.question, validated.data.options);
  redirect(`/poll/${newPoll.id}`);
}

export async function suggestQuestionAction(topic: string) {
  if (!topic || topic.trim().length < 5) {
    return { shouldSuggest: false, question: '' };
  }
  try {
    const suggestion = await suggestQuestionFlow({ topic });
    return suggestion;
  } catch (error) {
    console.error('AI suggestion failed:', error);
    return { shouldSuggest: false, question: '' };
  }
}

export async function voteAction(pollId: string, optionIndex: number) {
  'use server';
  try {
    const updatedPoll = addVote(pollId, optionIndex);
    if (!updatedPoll) {
      throw new Error('Poll not found or invalid option.');
    }
    return { success: true, poll: updatedPoll };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
