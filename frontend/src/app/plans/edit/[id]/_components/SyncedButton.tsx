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
import type { PlanState } from "@/types";

const LOGIC_STATUS_RESULTS = {
  SYNCHRONIZED: {
    message: "Zsynchronizowano",
    icon: <CloudIcon className="size-4 text-emerald-500" />,
  },
  LOCAL_ONLY: {
    message: "Plan dostępny tylko lokalnie",
    icon: <AlertTriangleIcon className="size-4 text-rose-500" />,
  },
  SYNCING: {
    message: "Synchronizowanie...",
    icon: <RefreshCwIcon className="size-4 animate-spin text-primary" />,
  },
  DIFFERENT_DATES: {
    message: "Twoja wersja różni się od wersji online",
    icon: <GitPullRequestClosed className="size-4 text-primary" />,
  },
  LOCAL_CHANGES: {
    message: "Masz lokalne zmiany",
    icon: <RefreshCwOffIcon className="size-4 text-amber-500" />,
  },
};

export const SyncedButton = ({
  plan,
  isSyncing,
  isEqualsDates,
}: {
  plan: PlanState;
  isSyncing: boolean;
  isEqualsDates: boolean;
}) => {
  const planStatus = useMemo(() => {
    if (plan.synced && isEqualsDates) {
      return "SYNCHRONIZED";
    } else if (!(plan.onlineId ?? "")) {
      return "LOCAL_ONLY";
    } else if (isSyncing) {
      return "SYNCING";
    } else if (!isEqualsDates) {
      return "DIFFERENT_DATES";
    }
    return "LOCAL_CHANGES";
  }, [plan.synced, plan.onlineId, isSyncing, isEqualsDates]);

  const message = LOGIC_STATUS_RESULTS[planStatus].message;
  const icon = LOGIC_STATUS_RESULTS[planStatus].icon;

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
            } else {
              return;
            }
          }}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{message}</p>
      </TooltipContent>
    </Tooltip>
  );
};
