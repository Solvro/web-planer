"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { FeedbackProvider } from "@/hooks/use-feedback";

import { ThemeProvider } from "./theme-provider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={0}>
      <FeedbackProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </QueryClientProvider>
      </FeedbackProvider>
    </TooltipProvider>
  );
}
