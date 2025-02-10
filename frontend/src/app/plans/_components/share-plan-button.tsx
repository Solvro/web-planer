"use client";

import React from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { env } from "@/env.mjs";
import type { PlanState } from "@/types";

export function SharePlanButton({ plan }: { plan: PlanState }) {
  const [currentSharedPlanId, setCurrentSharedPlanId] = React.useState<
    string | null | undefined
  >(plan.sharedId);
  const [generatingLink, setGeneratingLink] = React.useState<boolean>(false);

  const handleCopyLink = async (id: string) => {
    await navigator.clipboard.writeText(
      `${env.NEXT_PUBLIC_API_URL.includes("localhost") ? "http://localhost:3000" : "https://planer.solvro.pl"}/plans/preview/${id}`,
    );
    toast.success("Skopiowano link do schowka");
  };

  const handleSharePlan = async () => {
    setGeneratingLink(true);
    const preparedData = {
      name: plan.name,
      registrations: plan.registrations,
      courses: plan.courses,
      allGroups: plan.allGroups,
    };

    const randomUUID = uuidv4();

    try {
      const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/shared`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: JSON.stringify(preparedData),
          id: randomUUID,
        }),
      });

      if (response.ok) {
        setCurrentSharedPlanId(randomUUID);
        await handleCopyLink(randomUUID);
        plan.setPlan({ ...plan, sharedId: randomUUID, synced: false });
      } else {
        toast.error("Wystąpił błąd podczas generowania linku");
      }
    } catch {
      toast.error("Wystąpił błąd podczas generowania linku");
    } finally {
      setGeneratingLink(false);
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-full border bg-background/50 p-1">
      <p className="hidden truncate pl-2 md:block">
        {env.NEXT_PUBLIC_API_URL.includes("localhost")
          ? "http://localhost:3000"
          : "https://planer.solvro.pl"}
        /plans/preview/{currentSharedPlanId ?? "..."}
      </p>
      {currentSharedPlanId === null || currentSharedPlanId === undefined ? (
        <Button
          size={"sm"}
          className="rounded-full"
          variant={"secondary"}
          disabled={generatingLink}
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
            size={"sm"}
            className="rounded-full rounded-r-none"
            variant={"secondary"}
            disabled={generatingLink}
            onClick={handleSharePlan}
          >
            {generatingLink ? (
              <Icons.Loader className="size-4 animate-spin" />
            ) : (
              <Icons.Link className="size-4" />
            )}
            Nowy link
          </Button>
          <Button
            size={"sm"}
            className="rounded-full rounded-l-none"
            variant={"outline"}
            onClick={async () => handleCopyLink(currentSharedPlanId)}
          >
            <Icons.Copy className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
