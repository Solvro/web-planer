"use client";

import React from "react";
import { toast } from "sonner";

import { sharePlan, unsharePlan } from "@/actions/plans";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { env } from "@/env.mjs";
import type { PlanState } from "@/types";

export function SharePlanButton({ plan }: { plan: PlanState }) {
  const [currentSharedPlanId, setCurrentSharedPlanId] = React.useState<
    string | null | undefined
  >(plan.sharedId);
  const [generatingLink, setGeneratingLink] = React.useState<boolean>(false);
  const [unsharing, setUnsharing] = React.useState<boolean>(false);

  const handleCopyLink = async (id: string) => {
    await navigator.clipboard.writeText(
      `${env.NEXT_PUBLIC_SITE_URL}/plans/preview/${id}`,
    );
    toast.success("Skopiowano link do schowka");
  };

  const handleSharePlan = async () => {
    if (plan.onlineId === null) {
      toast.error("Najpierw zapisz plan online, aby móc go udostępnić");
      return;
    }

    setGeneratingLink(true);
    try {
      const response = await sharePlan({
        id: plan.onlineId,
        snapshot: {
          name: plan.name,
          registrations: plan.registrations,
          courses: plan.courses,
          allGroups: plan.allGroups,
        },
      });

      if (response.success) {
        setCurrentSharedPlanId(plan.onlineId);
        await handleCopyLink(plan.onlineId);
        plan.setPlan({ ...plan, sharedId: plan.onlineId });
      } else {
        toast.error(response.message);
      }
    } catch {
      toast.error("Wystąpił błąd podczas generowania linku");
    } finally {
      setGeneratingLink(false);
    }
  };

  const handleUnsharePlan = async () => {
    if (plan.onlineId === null) {
      return;
    }

    setUnsharing(true);
    try {
      const response = await unsharePlan({ id: plan.onlineId });

      if (response.success) {
        setCurrentSharedPlanId(null);
        plan.setPlan({ ...plan, sharedId: null });
      } else {
        toast.error(response.message);
      }
    } finally {
      setUnsharing(false);
    }
  };

  return (
    <div className="bg-background/50 flex items-center gap-2 rounded-full border p-1">
      <p className="hidden truncate pl-2 md:block">
        {env.NEXT_PUBLIC_SITE_URL}/plans/preview/{currentSharedPlanId ?? "..."}
      </p>
      {currentSharedPlanId === null || currentSharedPlanId === undefined ? (
        <Button
          size="sm"
          className="rounded-full"
          variant="secondary"
          disabled={generatingLink || plan.onlineId === null}
          onClick={handleSharePlan}
        >
          {generatingLink ? (
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
            disabled={generatingLink}
            onClick={handleSharePlan}
          >
            {generatingLink ? (
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
            onClick={async () => handleCopyLink(currentSharedPlanId)}
          >
            <Icons.Copy className="size-4" />
          </Button>
          <Button
            size="sm"
            className="rounded-full rounded-l-none"
            variant="outline"
            disabled={unsharing}
            onClick={handleUnsharePlan}
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
