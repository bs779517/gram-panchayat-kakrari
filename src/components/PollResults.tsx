'use client';

import { type Poll, type PollOption } from '@/lib/polls';
import { Progress } from './ui/progress';

type PollResultsProps = {
  poll: Poll;
};

export function PollResults({ poll }: PollResultsProps) {
  return (
    <div className="space-y-4">
      {poll.options.map((option, index) => {
        const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
        
        return (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-baseline">
              <p className="font-semibold text-lg">{option.text}</p>
              <p className="text-sm text-muted-foreground">
                {option.votes} vote{option.votes !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center gap-4">
                <Progress value={percentage} className="h-4 w-full [&>div]:bg-primary" />
                <span className="font-bold text-sm w-12 text-right">{percentage.toFixed(0)}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
