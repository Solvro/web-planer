"use client";

import {
  AlertTriangleIcon,
  CloudIcon,
  GitPullRequestClosed,
  RefreshCwIcon,
  RefreshCwOffIcon,
} from "lucide-react";
import React, { useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const SyncedButton = ({
  synced,
  onlineId,
  syncing,
  onClick,
  bounceAlert,
  equalsDates,
  isOffline,
}: {
  synced: boolean;
  onlineId: string | null;
  syncing: boolean;
  onClick: () => Promise<void>;
  bounceAlert: () => void;
  equalsDates: boolean;
  isOffline: boolean;
}) => {
  const message = useMemo(() => {
    if (synced && equalsDates) {
      return "Zsynchronizowano";
    } else if (!(onlineId ?? "")) {
      return "Plan dostępny tylko lokalnie";
    } else if (syncing) {
      return "Synchronizowanie...";
    } else if (!equalsDates) {
      return "Twoja wersja różni się od wersji online";
    }
    return "Masz lokalne zmiany";
  }, [synced, onlineId, syncing, equalsDates]);
  return (
    <Tooltip>
      <TooltipTrigger asChild={true}>
        <Button
          size="icon"
          variant="outline"
          className="min-w-10"
          onClick={() => {
            if (!equalsDates) {
              bounceAlert();
            } else if (isOffline) {
              return;
            } else {
              void onClick();
            }
          }}
        >
          {synced && equalsDates ? (
            <CloudIcon className="size-4 text-emerald-500" />
          ) : !(onlineId ?? "") ? (
            <AlertTriangleIcon className="size-4 text-rose-500" />
          ) : syncing ? (
            <RefreshCwIcon className="size-4 animate-spin text-primary" />
          ) : !equalsDates ? (
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
