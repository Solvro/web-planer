"use client";

// eslint-disable-next-line import/named -- eslint-plugin-import can't trace QueryClient through @tanstack/react-query's re-export of @tanstack/query-core; the export is real (tsc and runtime both resolve it fine)
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
    <TooltipProvider delay={0}>
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
