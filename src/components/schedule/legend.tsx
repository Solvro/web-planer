import { cn } from "@/lib/utils";

import { TYPE_BAR, TYPE_LABELS } from "./type-colors";

const TYPES = Object.keys(TYPE_LABELS) as (keyof typeof TYPE_LABELS)[];

export function ScheduleLegend() {
  return (
    <div className="text-muted-foreground b-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
      <span className="font-semibold tracking-wide">LEGENDA</span>
      {TYPES.map((type) => (
        <span key={type} className="flex items-center gap-1.5">
          <span className={cn("size-3 rounded-sm", TYPE_BAR[type])} />
          {type} - {TYPE_LABELS[type]}
        </span>
      ))}
      <span className="flex items-center gap-1.5">
        <span className="border-status-collision size-3 rounded-sm border-2 border-dashed" />
        kolizja
      </span>
      <span className="flex items-center gap-1.5">
        <span className="bg-status-collision size-3 rounded-sm" />
        komplet miejsc
      </span>
    </div>
  );
}
