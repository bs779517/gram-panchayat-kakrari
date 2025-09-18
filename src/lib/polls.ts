
export type PollOption = {
  text: string;
  votes: number;
  imageUrl?: string;
};

export type Poll = {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
};

// In-memory store for polls
const polls: Poll[] = [
    {
        id: '1',
        question: 'What is the best programming language?',
        options: [
            { text: 'TypeScript', votes: 25, imageUrl: 'https://picsum.photos/seed/p1/200/200' },
            { text: 'Python', votes: 30, imageUrl: 'https://picsum.photos/seed/p2/200/200' },
            { text: 'Rust', votes: 15, imageUrl: 'https://picsum.photos/seed/p3/200/200' },
            { text: 'Go', votes: 10, imageUrl: 'https://picsum.photos/seed/p4/200/200' },
        ],
        totalVotes: 80,
    }
];

export function getPolls(): Poll[] {
    return polls;
}

export function getPoll(id: string): Poll | undefined {
  return polls.find((p) => p.id === id);
}

export function createPoll(question: string, options: { text: string; imageUrl?: string }[]): Poll {
  const newPoll: Poll = {
    id: (polls.length + 1).toString(),
    question,
    options: options.map((opt) => ({ text: opt.text, imageUrl: opt.imageUrl, votes: 0 })),
    totalVotes: 0,
  };
  polls.push(newPoll);
  return newPoll;
}

export function addVote(pollId: string, optionIndex: number): Poll | undefined {
    const poll = getPoll(pollId);
    if (!poll || optionIndex < 0 || optionIndex >= poll.options.length) {
        return undefined;
    }

    // This is a new object to ensure we don't mutate the original in-memory data directly
    // in a way that would cause issues with React's change detection if we were using state management libraries.
    const updatedPoll: Poll = JSON.parse(JSON.stringify(poll));

    updatedPoll.options[optionIndex].votes += 1;
    updatedPoll.totalVotes += 1;

    // Update the poll in the in-memory store
    const pollIndex = polls.findIndex(p => p.id === pollId);
    if (pollIndex !== -1) {
        polls[pollIndex] = updatedPoll;
    }

    return updatedPoll;
}
