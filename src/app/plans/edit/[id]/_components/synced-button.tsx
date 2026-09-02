"use client";

import type { ReactNode } from "react";
import { toast } from "sonner";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { SyncStatus } from "@/lib/plan/use-plan-sync";

const STATUS_VIEW: Record<SyncStatus, { message: string; icon: ReactNode }> = {
  synced: {
    message: "Zsynchronizowano",
    icon: <Icons.Cloud className="size-4 text-emerald-500" />,
  },
  "local-only": {
    message: "Plan dostępny tylko lokalnie",
    icon: <Icons.AlertTriangle className="size-4 text-rose-500" />,
  },
  syncing: {
    message: "Synchronizowanie...",
    icon: <Icons.RefreshCw className="text-primary size-4 animate-spin" />,
  },
  conflict: {
    message: "Twoja wersja różni się od wersji online",
    icon: <Icons.GitPullRequestClosed className="text-primary size-4" />,
  },
  unsynced: {
    message: "Masz lokalne zmiany",
    icon: <Icons.RefreshCwOff className="size-4 text-amber-500" />,
  },
};

export function SyncedButton({ status }: { status: SyncStatus }) {
  const { message, icon } = STATUS_VIEW[status];

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            size="icon"
            variant="ghost"
            className="min-w-10"
            aria-label={message}
            onClick={() => {
              if (status === "conflict") {
                toast.info(
                  "Wybierz akcję z alertu w panelu bocznym, aby zsynchronizować dane tak jak chcesz",
                  { duration: 5000 },
                );
              }
            }}
          >
            {icon}
          </Button>
        }
      />
      <TooltipContent>
        <p>{message}</p>
      </TooltipContent>
    </Tooltip>
  );
}
