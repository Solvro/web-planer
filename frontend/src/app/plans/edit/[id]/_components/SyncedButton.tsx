"use client";

import {
  AlertTriangleIcon,
  CloudIcon,
  GitPullRequestClosed,
  RefreshCwIcon,
  RefreshCwOffIcon,
} from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";

export const SyncedButton = ({
  synced,
  onlineId,
  syncing,
  onClick,
  bounceAlert,
  equalsDates,
}: {
  synced: boolean;
  onlineId: string | null;
  syncing: boolean;
  onClick: () => Promise<number | string | true>;
  bounceAlert: () => void;
  equalsDates: boolean;
}) => {
  return (
    <Button
      size="icon"
      variant="outline"
      className="min-w-10"
      onClick={() => {
        if (!equalsDates) {
          bounceAlert();
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
  );
};
