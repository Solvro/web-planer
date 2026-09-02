"use client";

import type { CSSProperties } from "react";

import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import type { ExtendedGroup } from "@/types";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { TYPE_BAR, TYPE_BG, TYPE_BG_MUTED } from "./type-colors";

export function ClassCard({
  group,
  style,
  isCollision,
  isDisabled,
  isReadonly = false,
  onClick,
}: {
  group: ExtendedGroup;
  style: CSSProperties;
  isCollision: boolean;
  isDisabled: boolean;
  isReadonly?: boolean;
  onClick?: () => void;
}) {
  const session = useSession();
  const isLoggedIn = session.data !== null;
  const isFull = group.spotsOccupied >= group.spotsTotal;
  const occupancyRatio =
    group.spotsTotal > 0 ? group.spotsOccupied / group.spotsTotal : 0;

  return (
    <Tooltip>
      <TooltipTrigger
        delay={400}
        render={
          <button
            type="button"
            suppressHydrationWarning={true}
            disabled={isDisabled}
            onClick={isReadonly ? undefined : onClick}
            style={style}
            className={cn(
              "border-border/40 absolute flex flex-col justify-between overflow-hidden rounded-lg border p-2 pl-3 text-left text-[11px] shadow-sm transition-all",
              group.isChecked
                ? TYPE_BG[group.courseType]
                : TYPE_BG_MUTED[group.courseType],
              group.isChecked
                ? "cursor-pointer"
                : isDisabled
                  ? "cursor-not-allowed opacity-25"
                  : "cursor-pointer opacity-90 hover:opacity-100",
              isCollision &&
                "border-status-collision ring-status-collision/60 border-dashed ring-1",
              isReadonly && "cursor-default",
            )}
          >
            <span
              className={cn(
                "absolute inset-y-0 left-0 w-1",
                TYPE_BAR[group.courseType],
              )}
            />
            <div className="flex items-center justify-between gap-1 text-[10px] font-semibold tracking-wide uppercase">
              <span>
                {group.courseType}
                {group.week === "" ? "" : `|${group.week}`}
              </span>
              <span>G{group.groupNumber}</span>
            </div>
            <div className="min-w-0">
              <p className="truncate font-bold">{group.courseName}</p>
              <p className="text-muted-foreground truncate">{group.lecturer}</p>
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <div className="bg-background/50 h-1 flex-1 overflow-hidden rounded-full">
                <div
                  className={cn(
                    "h-full rounded-full",
                    isFull ? "bg-status-collision" : "bg-status-ready",
                  )}
                  style={{
                    width: `${Math.min(occupancyRatio * 100, 100).toString()}%`,
                  }}
                />
              </div>
              <span
                className={cn(
                  "shrink-0 font-semibold",
                  isFull && "text-status-collision",
                )}
              >
                {group.spotsOccupied}/{group.spotsTotal}
              </span>
            </div>
            {isLoggedIn ? (
              <p className="text-muted-foreground mt-0.5 truncate text-[10px]">
                ★{" "}
                {group.averageRating > 0 ? group.averageRating.toFixed(1) : "–"}{" "}
                ({group.opinionsCount})
              </p>
            ) : null}
          </button>
        }
      />
      <TooltipContent>
        <p>
          {group.courseName} - {group.lecturer}
          {group.week === ""
            ? ""
            : group.week === "!"
              ? " | zajęcia niestandardowe (sprawdź usos)"
              : ` | ${group.week}`}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
