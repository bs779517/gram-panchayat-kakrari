import { getPoll } from "@/lib/polls";
import { notFound } from "next/navigation";
import { PollContainer } from "@/components/PollContainer";

type PollPageProps = {
  params: {
    id: string;
  };
};

export default function PollPage({ params }: PollPageProps) {
  const poll = getPoll(params.id);

  if (!poll) {
    notFound();
  }

  return <PollContainer initialPoll={poll} />;
}
