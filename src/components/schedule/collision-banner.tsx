import { AlertTriangle } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ALL_DAYS } from "@/constants/days";
import { pluralize } from "@/lib/utils";
import type { Collision } from "@/lib/utils/detect-collisions";

import { formatMinutes } from "./time-scale";

function dayLabel(day: Collision["day"]) {
  return ALL_DAYS.find((d) => d.day === day)?.label ?? day;
}

export function CollisionBanner({ collisions }: { collisions: Collision[] }) {
  if (collisions.length === 0) {
    return null;
  }

  const dayOrder = new Map(ALL_DAYS.map((d, index) => [d.day, index]));
  const sorted = [...collisions].toSorted(
    (a, b) =>
      (dayOrder.get(a.day) ?? 0) - (dayOrder.get(b.day) ?? 0) ||
      a.startMinutes - b.startMinutes,
  );

  return (
    <Popover>
      <PopoverTrigger className="border-status-collision/40 bg-status-collision/10 text-status-collision flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium">
        <AlertTriangle className="size-4 shrink-0" />
        <span>
          {collisions.length}{" "}
          {pluralize(collisions.length, "kolizja", "kolizje", "kolizji")}
        </span>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">
            {collisions.length}{" "}
            {pluralize(collisions.length, "kolizja", "kolizje", "kolizji")}
          </p>
          <ul className="flex flex-col gap-2 text-sm">
            {sorted.map((collision) => {
              const [a, b] = collision.groups;
              return (
                <li
                  key={`${collision.day}-${collision.startMinutes.toString()}-${a.groupId}-${b.groupId}`}
                  className="border-border/60 flex flex-col gap-0.5 border-b pb-2 last:border-0 last:pb-0"
                >
                  <span className="text-foreground font-medium">
                    {dayLabel(collision.day)},{" "}
                    {formatMinutes(collision.startMinutes)}–
                    {formatMinutes(collision.endMinutes)}
                  </span>
                  <span className="text-muted-foreground">
                    {a.courseName} ({a.courseType}) vs {b.courseName} (
                    {b.courseType})
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
}
