'use client';

import { type Poll } from '@/lib/polls';
import { Progress } from './ui/progress';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type PollResultsProps = {
  poll: Poll;
};

export function PollResults({ poll }: PollResultsProps) {
  const winningVoteCount = Math.max(...poll.options.map(o => o.votes));
  
  return (
    <div className="space-y-6">
      {poll.options.map((option, index) => {
        const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
        const isWinner = option.votes > 0 && option.votes === winningVoteCount;

        return (
          <div key={index} className={cn("space-y-2 p-4 rounded-lg", isWinner ? "bg-primary/10 border border-primary" : "bg-secondary/50")}>
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                {option.imageUrl ? (
                  <div className="w-12 h-12 relative rounded-md overflow-hidden flex-shrink-0 border">
                    <Image src={option.imageUrl} alt={option.text} fill style={{objectFit: 'cover'}} />
                  </div>
                ) : (
                    <div className="w-12 h-12 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                )}
                <p className={cn("font-semibold text-lg", isWinner && "text-primary")}>{option.text}</p>
              </div>
              <p className="text-sm text-muted-foreground whitespace-nowrap">
                {option.votes} vote{option.votes !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center gap-4">
                <Progress value={percentage} className="h-3 w-full" />
                <span className={cn("font-bold text-sm w-12 text-right", isWinner ? "text-primary" : "text-muted-foreground")}>{percentage.toFixed(0)}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
