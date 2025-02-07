"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { useFeedback } from "@/hooks/use-feedback";
import { cn } from "@/lib/utils";

export function FeedbackButton({ ghost = false }: { ghost?: boolean }) {
  const { openDialog } = useFeedback();

  return (
    <Button
      variant={ghost ? "ghost" : "outline"}
      className={cn({ "hover:bg-blue-200/40 dark:hover:bg-white/5": ghost })}
      onClick={openDialog}
    >
      Zgłoś błąd
    </Button>
  );
}
