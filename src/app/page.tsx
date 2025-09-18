import { CreatePollForm } from "@/components/CreatePollForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-center">एक नया पोल बनाएं</CardTitle>
          <CardDescription className="text-center text-lg pt-2">
            एक प्रश्न पूछें और अपने समुदाय से तुरंत प्रतिक्रिया प्राप्त करें।
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreatePollForm />
        </CardContent>
      </Card>
    </div>
  );
}
