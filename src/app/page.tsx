import { CreatePollForm } from "@/components/CreatePollForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-center">Create a New Poll</CardTitle>
          <CardDescription className="text-center text-lg pt-2">
            Ask a question and get instant feedback from your community.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreatePollForm />
        </CardContent>
      </Card>
    </div>
  );
}
