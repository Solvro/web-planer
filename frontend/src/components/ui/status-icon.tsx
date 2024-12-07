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
    <div className="absolute right-2 top-2 flex size-[40px] items-center justify-center backdrop-blur-md">
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
