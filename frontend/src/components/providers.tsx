"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { FeedbackProvider } from "@/hooks/use-feedback";
import { ShareProvider } from "@/hooks/use-share";

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
        <ShareProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </ShareProvider>
      </FeedbackProvider>
    </TooltipProvider>
  );
}
