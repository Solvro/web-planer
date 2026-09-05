"use client";

import { toPng } from "html-to-image";
import type { RefObject } from "react";
import { useState } from "react";
import { toast } from "sonner";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function DownloadPlanButton({
  captureRef,
  planName,
  hideDays,
  hideLectures,
  disabled = false,
}: {
  captureRef: RefObject<HTMLDivElement | null>;
  planName: string;
  hideDays: boolean;
  hideLectures: boolean;
  disabled?: boolean;
}) {
  const [loading, setLoading] = useState(false);

  const downloadPlan = async () => {
    const element = captureRef.current;
    if (element === null) {
      return;
    }
    setLoading(true);
    try {
      const dataUrl = await toPng(element, {
        cacheBust: true,
        pixelRatio: 2,
        width: element.scrollWidth,
        height: element.scrollHeight,
        style: { transform: "none", transformOrigin: "top left", margin: "0" },
      });
      const link = document.createElement("a");
      link.download = `${planName || "plan"}.png`;
      link.href = dataUrl;
      link.click();

      void window.umami?.track("Download plan", {
        withHiddenDays: hideDays.toString(),
        withHiddenLectures: hideLectures.toString(),
      });
    } catch (error) {
      console.error(error);
      toast.error("Nie udało się wygenerować obrazka");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className="rounded-full dark:bg-white dark:text-black"
      disabled={loading || disabled}
      onClick={() => {
        void downloadPlan();
      }}
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
