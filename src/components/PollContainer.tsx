'use client';

import { useEffect, useState } from 'react';
import { type Poll } from '@/lib/polls';
import { PollVoteForm } from './PollVoteForm';
import { PollResults } from './PollResults';
import { voteAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

type PollContainerProps = {
  initialPoll: Poll;
};

export function PollContainer({ initialPoll }: PollContainerProps) {
  const [poll, setPoll] = useState(initialPoll);
  const [hasVoted, setHasVoted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const voted = localStorage.getItem(`poll-voted-${poll.id}`);
    if (voted) {
      setHasVoted(true);
    }
  }, [poll.id]);

  const handleVote = async (optionIndex: number) => {
    const result = await voteAction(poll.id, optionIndex);

    if (result.success && result.poll) {
      setPoll(result.poll);
      setHasVoted(true);
      localStorage.setItem(`poll-voted-${poll.id}`, 'true');
      toast({
        title: "Vote cast!",
        description: "Thanks for participating!",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Failed to cast vote.",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-center">{poll.question}</CardTitle>
          {hasVoted && (
             <CardDescription className="text-center pt-2">
                Total Votes: {poll.totalVotes}
             </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {hasVoted ? (
            <PollResults poll={poll} />
          ) : (
            <PollVoteForm poll={poll} onVote={handleVote} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
