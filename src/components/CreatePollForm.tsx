'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createPollAction, suggestQuestionAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, PlusCircle, Trash2, WandSparkles } from "lucide-react";
import React, { useCallback, useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const pollFormSchema = z.object({
  question: z.string().min(5, {
    message: "Question must be at least 5 characters.",
  }),
  options: z.array(
    z.object({
      value: z.string().min(1, { message: "Option cannot be empty." }),
    })
  ).min(2, { message: "At least two options are required." }),
});

type PollFormValues = z.infer<typeof pollFormSchema>;

export function CreatePollForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestion, setSuggestion] = useState<{ question: string; shouldSuggest: boolean } | null>(null);

  const form = useForm<PollFormValues>({
    resolver: zodResolver(pollFormSchema),
    mode: "onChange",
    defaultValues: {
      question: "",
      options: [{ value: "" }, { value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const questionValue = form.watch("question");

  const getSuggestion = useCallback(async (topic: string) => {
    if (topic.trim().length < 10) {
      setSuggestion(null);
      return;
    }
    setIsSuggesting(true);
    const result = await suggestQuestionAction(topic);
    if (result.shouldSuggest) {
      setSuggestion(result);
    } else {
      setSuggestion(null);
    }
    setIsSuggesting(false);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      getSuggestion(questionValue);
    }, 1000); // 1-second debounce

    return () => {
      clearTimeout(handler);
    };
  }, [questionValue, getSuggestion]);

  function onSubmit(data: PollFormValues) {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('question', data.question);
      data.options.forEach(option => {
        formData.append('options[]', option.value);
      });
      try {
        await createPollAction(formData);
        toast({
          title: "Poll created!",
          description: "Your poll is now live.",
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to create poll.",
        });
      }
    });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Your Question</FormLabel>
                <FormControl>
                  <Textarea placeholder="e.g., What's the best pizza topping?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {isSuggesting && <div className="flex items-center text-sm text-muted-foreground"><WandSparkles className="mr-2 h-4 w-4 animate-spin" /> Thinking of a better question...</div>}
          
          {suggestion?.shouldSuggest && (
            <Alert className="bg-primary/10 border-primary/50">
              <Lightbulb className="h-4 w-4 text-primary" />
              <AlertTitle className="font-headline text-primary">AI Suggestion</AlertTitle>
              <AlertDescription>
                <p className="mb-2">"{suggestion.question}"</p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    form.setValue('question', suggestion.question, { shouldValidate: true });
                    setSuggestion(null);
                  }}
                  className="bg-background"
                >
                  Use this question
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <FormLabel className="text-lg">Answer Options</FormLabel>
            {fields.map((field, index) => (
              <FormField
                control={form.control}
                key={field.id}
                name={`options.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input placeholder={`Option ${index + 1}`} {...field} />
                        {fields.length > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ value: "" })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Option
            </Button>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className={cn("w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6")}
          >
            {isPending ? "Creating..." : "Create Poll"}
          </Button>
        </form>
      </Form>
    </>
  );
}
