import { AlertTriangleIcon, CloudIcon, RefreshCwOffIcon } from "lucide-react";
import React from "react";

export const StatusIcon = ({
  synced,
  onlineId,
}: {
  synced: boolean;
  onlineId: string | null;
}) => {
  return (
    <div className="absolute right-4 top-4 flex size-[20px] items-center justify-center rounded-md backdrop-blur-md">
      {synced ? (
        <CloudIcon className="size-4 text-emerald-500" />
      ) : !(onlineId ?? "") ? (
        <AlertTriangleIcon className="size-4 text-rose-500" />
      ) : (
        <RefreshCwOffIcon className="size-4 text-amber-500" />
      )}
    </div>
  );
};
