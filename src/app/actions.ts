'use server';

import { suggestQuestion as suggestQuestionFlow } from '@/ai/flows/ai-suggest-question';
import { addVote } from '@/lib/polls';
import { createPoll } from '@/lib/polls';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const createPollSchema = z.object({
  question: z.string().min(1, 'Question cannot be empty.'),
  options: z.array(z.object({
    text: z.string().min(1, 'Option cannot be empty.'),
    imageUrl: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
  })).min(2, 'Must have at least two options.'),
});

export async function createPollAction(formData: FormData) {
  const question = formData.get('question') as string;
  const optionTexts = formData.getAll('options[].text').map(String);
  const optionImageUrls = formData.getAll('options[].imageUrl').map(String);

  const options = optionTexts.map((text, index) => ({
    text,
    imageUrl: optionImageUrls[index],
  })).filter(opt => opt.text.trim() !== '');

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
  const ip = headers().get('x-forwarded-for') || '127.0.0.1';

  try {
    const result = addVote(pollId, optionIndex, ip);
    
    if (result === 'already_voted') {
      return { success: false, error: 'You have already voted on this poll.' };
    }
    
    if (!result) {
      throw new Error('Poll not found or invalid option.');
    }
    
    return { success: true, poll: result };

  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
