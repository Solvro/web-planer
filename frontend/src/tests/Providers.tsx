// Providers.tsx or similar file
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "@/hooks/use-session";
import { ShareProvider } from "@/hooks/use-share";
import { User } from "@/types";

const queryClient = new QueryClient();

const user: User = {
  id: 1,
  firstName: "Test",
  lastName: "string",
  studentNumber: 123141,
  usosId: "123455",
  verified: true,
  createdAt: "2025-08-01T10:00:00.000Z",
  updatedAt: "2025-08-01T10:00:00.000Z",
  allowNotifications: true,
};

export function Providers({ children }: PropsWithChildren) {
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
