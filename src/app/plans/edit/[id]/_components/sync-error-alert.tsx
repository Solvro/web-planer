"use client";

import { formatDistance, isAfter } from "date-fns";
import { pl } from "date-fns/locale";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function SyncErrorAlert({
  localUpdatedAt,
  onlineUpdatedAt,
  isPulling,
  isPushing,
  onPull,
  onPush,
}: {
  localUpdatedAt: string;
  onlineUpdatedAt: string;
  isPulling: boolean;
  isPushing: boolean;
  onPull: () => Promise<void>;
  onPush: () => Promise<void>;
}) {
  const local = new Date(localUpdatedAt);
  const online = new Date(onlineUpdatedAt);
  const busy = isPulling || isPushing;

  return (
    <div className="bg-primary/10 flex w-full flex-col rounded-md">
      <div className="p-4 pb-2">
        <h1 className="text-primary text-lg font-bold">
          Wystąpił konflikt w chmurze!
        </h1>
        <p className="text-xs font-medium text-black/90 dark:text-white">
          Posiadasz{" "}
          <strong>{isAfter(local, online) ? "najnowszą" : "starszą"}</strong>{" "}
          wersję o{" "}
          <span className="font-bold">
            {formatDistance(local, online, { locale: pl })}
          </span>{" "}
          w porównaniu do wersji zapisanej w chmurze.
        </p>
      </div>
      <div className="flex items-center justify-center gap-2 border-t p-4 pt-2">
        <Button
          disabled={busy}
          variant="outline"
          className="w-full rounded-sm text-xs"
          size="xs"
          onClick={() => {
            void onPull();
          }}
        >
          {isPulling ? (
            <Icons.Loader className="size-4 animate-spin" />
          ) : (
            <Icons.DownloadCloud className="size-4" />
          )}
          Pobierz zmiany
        </Button>
        <Button
          disabled={busy}
          variant="default"
          className="w-full rounded-sm text-xs"
          size="xs"
          onClick={() => {
            void onPush();
          }}
        >
          {isPushing ? (
            <Icons.Loader className="size-4 animate-spin" />
          ) : (
            <Icons.UploadCloud className="size-4" />
          )}
          Zapisz w chmurze
        </Button>
      </div>
    </div>
  );
}
