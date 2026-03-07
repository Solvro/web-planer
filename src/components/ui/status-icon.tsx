import { AlertTriangleIcon, CloudIcon, RefreshCwOffIcon } from "lucide-react";
import React, { useMemo } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const LOGIC_STATUS_RESULTS = {
  SYNCHRONIZED: {
    message: "Zsynchronizowano",
    icon: <CloudIcon className="size-4 text-emerald-500" />,
  },
  LOCAL_ONLY: {
    message: "Plan dostępny tylko lokalnie",
    icon: <AlertTriangleIcon className="size-4 text-rose-500" />,
  },
  LOCAL_CHANGES: {
    message: "Masz lokalne zmiany",
    icon: <RefreshCwOffIcon className="size-4 text-amber-500" />,
  },
};

export function StatusIcon({
  synced,
  onlineId,
}: {
  synced: boolean;
  onlineId: string | null;
}) {
  const planStatus = useMemo(() => {
    if (synced) {
      return "SYNCHRONIZED";
    } else if (!(onlineId ?? "")) {
      return "LOCAL_ONLY";
    }
    return "LOCAL_CHANGES";
  }, [synced, onlineId]);

  const message = LOGIC_STATUS_RESULTS[planStatus].message;
  const icon = LOGIC_STATUS_RESULTS[planStatus].icon;
  return (
    <Tooltip>
      <TooltipTrigger className="absolute right-4 top-4">
        <div className="flex size-[20px] items-center justify-center rounded-md backdrop-blur-md">
          {icon}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{message}</p>
      </TooltipContent>
    </Tooltip>
  );
}
