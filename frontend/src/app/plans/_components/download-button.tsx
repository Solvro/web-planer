"use client";

import { toPng } from "html-to-image";
import React, { useCallback } from "react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import type { PlanState } from "@/types";

export function DownloadPlanButton({
  captureRef,
  plan,
  hideDays,
}: {
  captureRef: React.RefObject<HTMLDivElement>;
  plan: PlanState;
  hideDays: boolean;
}) {
  const [loading, setLoading] = React.useState(false);

  const downloadPlan = useCallback(async () => {
    if (captureRef.current === null) {
      return;
    }
    setLoading(true);
    const element = captureRef.current;
    try {
      const dataUrl = await toPng(element, { cacheBust: true });
      const link = document.createElement("a");
      link.download = `${plan.name}.png`;
      link.href = dataUrl;
      link.click();

      void window.umami?.track("Download plan", {
        withHiddenDays: hideDays.toString(),
      });
    } catch (error: unknown) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [captureRef, plan.name]);

  return (
    <Button
      className="rounded-full dark:bg-white dark:text-black"
      variant={"default"}
      disabled={loading}
      onClick={downloadPlan}
    >
      {loading ? (
        <Icons.Loader className="size-4 animate-spin" />
      ) : (
        <Icons.Download className="size-4" />
      )}
      Pobierz jako zdjęcie
    </Button>
  );
}
