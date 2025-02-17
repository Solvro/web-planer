"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import confetti from "canvas-confetti";
import { createContext, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { sendFeedbackForm } from "@/actions/feedback";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { feedbackFormSchema } from "@/types/schemas";

interface FeedbackContextType {
  isDialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(
  undefined,
);

const randomInRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const handleTriggerConfetti = () => {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 99 };

  const interval = window.setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = 50 * (timeLeft / duration);
    void confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    void confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
};

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sended, setSended] = useState(false);
  const [sending, setSending] = useState(false);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const form = useForm<z.infer<typeof feedbackFormSchema>>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      email: "",
      title: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof feedbackFormSchema>) {
    setSending(true);
    await sendFeedbackForm(values);
    handleTriggerConfetti();
    setSended(true);
    setSending(false);
  }

  return (
    <FeedbackContext.Provider value={{ isDialogOpen, openDialog, closeDialog }}>
      {children}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Twój feedback</DialogTitle>
            <DialogDescription className="text-balance">
              Jeśli znalazłeś błąd na naszej stronie lub masz jakąś sugestię,
              jesteśmy otwarci na zgłoszenia.
            </DialogDescription>
          </DialogHeader>
          {sended ? (
            <div className="flex h-56 w-full flex-col items-center justify-center">
              <Icons.Check className="size-56 text-green-500" />
              <h1 className="mt-5 text-center text-lg font-semibold">
                Przyjęliśmy Twoje zgłoszenie
              </h1>
              <p className="mt-2 text-balance text-center text-sm">
                Odpowiemy na nie tak szybko, jak tylko będziemy mogli.
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4 py-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  disabled={sending}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adres email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123456@student.pwr.edu.pl"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-balance text-xs">
                        Twój adres email będzie wykorzystany wyłącznie do
                        odpowiedzi na zgłoszenie.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  disabled={sending}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tytuł zgłoszenia</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Błąd związany z formularzem"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  disabled={sending}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opis zgłoszenia</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Zauważyłem, że formularz podczas..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={sending}>
                  {sending ? (
                    <Icons.Loader className="size-4 animate-spin" />
                  ) : (
                    <Icons.Bug className="size-4" />
                  )}{" "}
                  Prześlij zgłoszenie
                </Button>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </FeedbackContext.Provider>
  );
}

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error("useFeedback must be used within a FeedbackProvider");
  }
  return context;
};
