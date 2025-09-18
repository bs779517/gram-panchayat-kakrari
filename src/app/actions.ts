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

function isVpn(headers: Headers): boolean {
  // This is a basic check. More robust VPN detection requires a third-party service.
  const knownVpnHeaders = [
    'x-forwarded-for',
    'x-forwarded-host',
    'x-forwarded-server',
    'forwarded',
    'x-real-ip',
    'via',
    'cf-connecting-ip' // Cloudflare
  ];

  const headerList = Array.from(headers.keys());
  let proxyHeaderCount = 0;

  for (const header of headerList) {
    if (knownVpnHeaders.includes(header.toLowerCase())) {
      proxyHeaderCount++;
    }
  }

  // If there's more than one proxy-related header, it might be a VPN.
  // A direct connection will have very few of these.
  // 'x-forwarded-for' is often present even without a VPN in many hosting environments.
  return headers.has('via') || proxyHeaderCount > 2;
}


export async function voteAction(pollId: string, optionIndex: number) {
  'use server';
  const h = headers();
  const ip = h.get('x-forwarded-for') || '127.0.0.1';

  if (isVpn(h)) {
    return { success: false, error: 'Voting via VPN or proxy is not allowed.' };
  }

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
