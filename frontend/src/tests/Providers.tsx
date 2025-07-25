// Providers.tsx or similar file
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "@/hooks/use-session";
import { ShareProvider } from "@/hooks/use-share";
import { User } from "@/types";

export function Providers({
  children,
  user,
}: PropsWithChildren<{ user: User | null }>) {
  const queryClient = new QueryClient();
  return (
    <SidebarProvider>
      <TooltipProvider>
        <SessionProvider user={user}>
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
