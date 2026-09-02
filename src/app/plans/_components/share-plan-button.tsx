"use client";

import { useState } from "react";
import { toast } from "sonner";

import { sharePlan, unsharePlan } from "@/actions/plans";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { env } from "@/env.mjs";
import type { PlanHandle } from "@/lib/plan/use-plan";

const previewUrl = (id: string) =>
  `${env.NEXT_PUBLIC_SITE_URL}/plans/preview/${id}`;

async function copyLink(id: string) {
  await navigator.clipboard.writeText(previewUrl(id));
  toast.success("Skopiowano link do schowka");
}

export function SharePlanButton({ plan }: { plan: PlanHandle }) {
  const [sharing, setSharing] = useState(false);
  const [unsharing, setUnsharing] = useState(false);
  const { onlineId, sharedId } = plan;

  const share = async () => {
    if (onlineId === null) {
      toast.error("Najpierw zapisz plan online, aby móc go udostępnić");
      return;
    }
    setSharing(true);
    try {
      const result = await sharePlan({
        id: onlineId,
        snapshot: {
          name: plan.name,
          registrations: plan.registrations,
          courses: plan.courses,
          allGroups: plan.allGroups,
        },
      });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      plan.setSharedId(onlineId, result.data.updatedAt);
      await copyLink(onlineId);
    } catch {
      toast.error("Wystąpił błąd podczas generowania linku");
    } finally {
      setSharing(false);
    }
  };

  const unshare = async () => {
    if (onlineId === null) {
      return;
    }
    setUnsharing(true);
    try {
      const result = await unsharePlan({ id: onlineId });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      plan.setSharedId(null, result.data.updatedAt);
    } catch {
      toast.error("Nie udało się wyłączyć udostępniania");
    } finally {
      setUnsharing(false);
    }
  };

  return (
    <div className="bg-background/50 flex items-center gap-2 rounded-full border p-1">
      <p className="hidden truncate pl-2 md:block">
        {previewUrl(sharedId ?? "...")}
      </p>
      {sharedId === null ? (
        <Button
          size="sm"
          className="rounded-full"
          variant="secondary"
          disabled={sharing || onlineId === null}
          onClick={() => {
            void share();
          }}
        >
          {sharing ? (
            <Icons.Loader className="size-4 animate-spin" />
          ) : (
            <Icons.Link className="size-4" />
          )}
          Wygeneruj link
        </Button>
      ) : (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            className="rounded-full rounded-r-none"
            variant="secondary"
            disabled={sharing}
            onClick={() => {
              void share();
            }}
          >
            {sharing ? (
              <Icons.Loader className="size-4 animate-spin" />
            ) : (
              <Icons.Link className="size-4" />
            )}
            Odśwież
          </Button>
          <Button
            size="sm"
            className="rounded-none"
            variant="outline"
            aria-label="Kopiuj link"
            onClick={() => {
              void copyLink(sharedId);
            }}
          >
            <Icons.Copy className="size-4" />
          </Button>
          <Button
            size="sm"
            className="rounded-full rounded-l-none"
            variant="outline"
            aria-label="Wyłącz udostępnianie"
            disabled={unsharing}
            onClick={() => {
              void unshare();
            }}
          >
            {unsharing ? (
              <Icons.Loader className="size-4 animate-spin" />
            ) : (
              <Icons.X className="size-4" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
