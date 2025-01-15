"use client";

import React from "react";

import { buttonVariants } from "@/components/ui/button";
import { useFeedback } from "@/hooks/use-feedback";
import { cn } from "@/lib/utils";

export function FeedbackButton() {
  const { openDialog } = useFeedback();

  return (
    <button
      className={cn(
        buttonVariants({ variant: "link" }),
        "mr-2 hidden text-white md:flex",
      )}
      onClick={openDialog}
    >
      <span className="text-nowrap">Zgłoś błąd</span>
    </button>
  );
}
