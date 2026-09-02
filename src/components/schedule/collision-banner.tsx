import { AlertTriangle } from "lucide-react";

import { ALL_DAYS } from "@/constants/days";
import { pluralize } from "@/lib/utils";
import type { Collision } from "@/lib/utils/detect-collisions";

import { formatMinutes } from "./time-scale";

export function CollisionBanner({ collisions }: { collisions: Collision[] }) {
  if (collisions.length === 0) {
    return null;
  }

  const first = collisions[0];
  const dayLabel =
    ALL_DAYS.find((d) => d.day === first.day)?.label ?? first.day;

  return (
    <div className="border-status-collision/40 bg-status-collision/10 text-status-collision flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium">
      <AlertTriangle className="size-4 shrink-0" />
      <span>
        {collisions.length}{" "}
        {pluralize(collisions.length, "kolizja", "kolizje", "kolizji")} —{" "}
        {dayLabel.slice(0, 2).toLowerCase()}.{" "}
        {formatMinutes(first.startMinutes)}
      </span>
    </div>
  );
}
