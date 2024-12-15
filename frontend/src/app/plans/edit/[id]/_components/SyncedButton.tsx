"use client";

import {
  AlertTriangleIcon,
  CloudIcon,
  GitPullRequestClosed,
  RefreshCwIcon,
  RefreshCwOffIcon,
} from "lucide-react";
import React, { useMemo } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { PlanState } from "@/lib/usePlan";

export const SyncedButton = ({
  plan,
  isSyncing,
  onClick,
  isEqualsDates,
  isOffline,
}: {
  plan: PlanState;
  isSyncing: boolean;
  onClick: () => Promise<void>;
  isEqualsDates: boolean;
  isOffline: boolean;
}) => {
  const message = useMemo(() => {
    if (plan.synced && isEqualsDates) {
      return "Zsynchronizowano";
    } else if (!(plan.onlineId ?? "")) {
      return "Plan dostępny tylko lokalnie";
    } else if (isSyncing) {
      return "Synchronizowanie...";
    } else if (!isEqualsDates) {
      return "Twoja wersja różni się od wersji online";
    }
    return "Masz lokalne zmiany";
  }, [plan.synced, plan.onlineId, isSyncing, isEqualsDates]);
  return (
    <Tooltip>
      <TooltipTrigger asChild={true}>
        <Button
          size="icon"
          variant="outline"
          className="min-w-10"
          onClick={() => {
            if (!isEqualsDates) {
              toast.info(
                "Wybierz akcję z alertu powyżej, aby zsynchronizować dane tak jak chcesz",
                { duration: 5000 },
              );
            } else if (isOffline) {
              return;
            } else {
              void onClick();
            }
          }}
        >
          {plan.synced && isEqualsDates ? (
            <CloudIcon className="size-4 text-emerald-500" />
          ) : !(plan.onlineId ?? "") ? (
            <AlertTriangleIcon className="size-4 text-rose-500" />
          ) : isSyncing ? (
            <RefreshCwIcon className="size-4 animate-spin text-primary" />
          ) : !isEqualsDates ? (
            <GitPullRequestClosed className="size-4 text-primary" />
          ) : (
            <RefreshCwOffIcon className="size-4 text-amber-500" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{message}</p>
      </TooltipContent>
    </Tooltip>
  );
};
