'use client';

import { useState, useTransition } from 'react';
import { type Poll } from '@/lib/polls';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';

type PollVoteFormProps = {
  poll: Poll;
  onVote: (optionIndex: number) => Promise<void>;
};

export function PollVoteForm({ poll, onVote }: PollVoteFormProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption === null) return;
    startTransition(() => {
      onVote(selectedOption);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <RadioGroup
        onValueChange={(value) => setSelectedOption(Number(value))}
        className="space-y-4"
        aria-label="Poll options"
      >
        {poll.options.map((option, index) => (
          <div key={index} className="flex items-center space-x-3">
            <RadioGroupItem value={index.toString()} id={`option-${index}`} />
            <Label htmlFor={`option-${index}`} className="text-lg cursor-pointer">
              {option.text}
            </Label>
          </div>
        ))}
      </RadioGroup>
      <Button
        type="submit"
        disabled={selectedOption === null || isPending}
        className={cn("w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6")}
      >
        {isPending ? "Voting..." : "Vote"}
      </Button>
    </form>
  );
}
