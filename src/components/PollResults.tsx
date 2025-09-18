'use client';

import { type Poll } from '@/lib/polls';
import { Progress } from './ui/progress';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

type PollResultsProps = {
  poll: Poll;
};

export function PollResults({ poll }: PollResultsProps) {
  return (
    <div className="space-y-6">
      {poll.options.map((option, index) => {
        const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
        
        return (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                {option.imageUrl ? (
                  <div className="w-12 h-12 relative rounded-md overflow-hidden flex-shrink-0">
                    <Image src={option.imageUrl} alt={option.text} fill style={{objectFit: 'cover'}} />
                  </div>
                ) : (
                    <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                )}
                <p className="font-semibold text-lg">{option.text}</p>
              </div>
              <p className="text-sm text-muted-foreground whitespace-nowrap">
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
