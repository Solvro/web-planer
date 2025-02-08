"use client";

import { formatDistance, isAfter, isEqual } from "date-fns";
import { pl } from "date-fns/locale";
import { DownloadCloudIcon, Loader2Icon, UploadCloudIcon } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PlanResponseType {
  name: string;
  userId: number;
  id: number;
  createdAt: string;
  updatedAt: string;
  courses: {
    id: string;
    name: string;
    department: string;
    lecturer: string;
    type: string;
    ects: number;
    semester: number;
    groups: {
      id: number;
      name: string;
      day: string;
      time: string;
      room: string;
    }[];
  }[];
  registrations: {
    id: string;
    name: string;
  }[];
}

export function SyncErrorAlert({
  onlinePlan,
  planDate,
  downloadChanges,
  sendChanges,
}: {
  onlinePlan: PlanResponseType | null | undefined;
  planDate: Date;
  downloadChanges: () => void;
  sendChanges: () => void;
}) {
  const [loadingSending, setLoadingSending] = useState(false);
  const [loadingDownloading, setLoadingDownloading] = useState(false);
  if (onlinePlan == null) {
    return null;
  }
  if (isEqual(planDate, new Date(onlinePlan.updatedAt))) {
    return null;
  }

  const timePassed = formatDistance(planDate, new Date(onlinePlan.updatedAt), {
    addSuffix: false,
    locale: pl,
  });

  const clearLoading = () => {
    setTimeout(() => {
      setLoadingDownloading(false);
      setLoadingSending(false);
    }, 5000);
  };

  return (
    <div
      className={cn(
        "flex w-full flex-col rounded-md bg-primary/10 transition-all",
      )}
    >
      <div className="flex w-full items-start justify-start p-4 pb-2">
        <div className="">
          <h1 className="text-lg font-bold text-primary">
            Wystąpił konflikt w chmurze!
          </h1>
          <p className="text-xs font-medium text-black/90 dark:text-white">
            Posiadasz{" "}
            <strong>
              {isAfter(planDate, onlinePlan.updatedAt)
                ? "najnowszą"
                : "starszą"}
            </strong>{" "}
            wersję o <span className="font-bold">{timePassed}</span> w
            porównaniu do wersji zapisanej w chmurze.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 border-t p-4 pt-2">
        <Button
          disabled={loadingSending || loadingDownloading}
          variant="outline"
          className="w-full rounded-sm text-xs"
          size="xs"
          onClick={() => {
            setLoadingDownloading(true);
            downloadChanges();
            clearLoading();
          }}
        >
          {loadingDownloading ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <DownloadCloudIcon className="size-4" />
          )}
          Pobierz zmiany
        </Button>
        <Button
          disabled={loadingSending || loadingDownloading}
          variant="default"
          className="w-full rounded-sm text-xs"
          size="xs"
          onClick={() => {
            setLoadingSending(true);
            sendChanges();
            clearLoading();
          }}
        >
          {loadingSending ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <UploadCloudIcon className="size-4" />
          )}
          Zapisz w chmurze
        </Button>
      </div>
    </div>
  );
}
