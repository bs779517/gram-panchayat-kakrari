'use client';

import { useState } from 'react';
import { type Poll } from '@/lib/polls';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

type PollVoteFormProps = {
  poll: Poll;
  onVote: (optionIndex: number) => Promise<void>;
  isVoting: boolean;
};

export function PollVoteForm({ poll, onVote, isVoting }: PollVoteFormProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption === null) return;
    onVote(selectedOption);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <RadioGroup
        onValueChange={(value) => setSelectedOption(Number(value))}
        className="space-y-4"
        aria-label="Poll options"
        disabled={isVoting}
      >
        {poll.options.map((option, index) => (
          <Label 
            key={index} 
            htmlFor={`option-${index}`}
            className={cn(
                "flex items-center space-x-4 rounded-md border p-4 transition-colors cursor-pointer",
                "hover:bg-accent/50",
                selectedOption === index && "bg-accent/20 border-accent",
                isVoting && "cursor-not-allowed opacity-70"
            )}
            >
            <RadioGroupItem value={index.toString()} id={`option-${index}`} className="h-6 w-6"/>
            {option.imageUrl ? (
              <div className="w-20 h-20 relative rounded-md overflow-hidden flex-shrink-0">
                <Image src={option.imageUrl} alt={option.text} fill style={{objectFit: 'cover'}} />
              </div>
            ) : (
                <div className="w-20 h-20 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
            )}
            <span className="text-lg font-medium">{option.text}</span>
          </Label>
        ))}
      </RadioGroup>
      <Button
        type="submit"
        disabled={selectedOption === null || isVoting}
        className={cn("w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6")}
      >
        {isVoting ? "Voting..." : "Vote"}
      </Button>
    </form>
  );
}
