import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";

import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "@/hooks/use-session";
import { ShareProvider } from "@/hooks/use-share";
import type { User } from "@/types";

export function Providers({
  children,
  user,
  queryClient,
}: PropsWithChildren<{ user?: User | null; queryClient: QueryClient }>) {
  return (
    <SidebarProvider>
      <TooltipProvider>
        <SessionProvider user={user ?? null}>
          <ShareProvider>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </ShareProvider>
        </SessionProvider>
      </TooltipProvider>
    </SidebarProvider>
  );
}
