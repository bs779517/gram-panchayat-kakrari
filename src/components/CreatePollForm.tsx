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
import { Lightbulb, PlusCircle, Trash2, WandSparkles, Image as ImageIcon } from "lucide-react";
import React, { useCallback, useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import Image from "next/image";

const pollFormSchema = z.object({
  question: z.string().min(5, {
    message: "Question must be at least 5 characters.",
  }),
  options: z.array(
    z.object({
      text: z.string().min(1, { message: "Option cannot be empty." }),
      imageUrl: z.string().url({ message: "Please enter a valid image URL." }).optional().or(z.literal('')),
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
      options: [{ text: "", imageUrl: "" }, { text: "", imageUrl: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const questionValue = form.watch("question");
  const optionsValue = form.watch("options");

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
        formData.append('options[].text', option.text);
        formData.append('options[].imageUrl', option.imageUrl || '');
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
                <FormLabel className="text-lg font-semibold">Your Question</FormLabel>
                <FormControl>
                  <Textarea placeholder="e.g., What's the best pizza topping?" {...field} className="text-base" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {isSuggesting && <div className="flex items-center text-sm text-muted-foreground"><WandSparkles className="mr-2 h-4 w-4 animate-spin" /> Thinking of a better question...</div>}
          
          {suggestion?.shouldSuggest && (
            <Alert className="bg-primary/10 border-primary/50">
              <Lightbulb className="h-4 w-4 text-primary" />
              <AlertTitle className="font-semibold text-primary">AI Suggestion</AlertTitle>
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
            <FormLabel className="text-lg font-semibold">Answer Options</FormLabel>
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-3 p-4 border rounded-lg bg-secondary/50">
                <FormField
                  control={form.control}
                  name={`options.${index}.text`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Option {index + 1}</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input placeholder={`Option ${index + 1} text`} {...field} className="bg-background" />
                          {fields.length > 2 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                              className="text-muted-foreground hover:text-destructive"
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
                 <FormField
                  control={form.control}
                  name={`options.${index}.imageUrl`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">Image URL (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="https://example.com/image.png" {...field} className="pl-10 bg-background" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {optionsValue[index]?.imageUrl && (
                  <div className="w-24 h-24 relative rounded-md overflow-hidden border">
                    <Image src={optionsValue[index].imageUrl!} alt={`Option ${index+1} preview`} fill style={{objectFit: 'cover'}} />
                  </div>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ text: "", imageUrl: "" })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Option
            </Button>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className={cn("w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6 font-bold")}
          >
            {isPending ? "Creating..." : "Create Poll"}
          </Button>
        </form>
      </Form>
    </>
  );
}
