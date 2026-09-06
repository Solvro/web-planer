"use client";

import { useAtom } from "jotai";
import Link from "next/link";
import { toast } from "sonner";

import { settingsDialogAtom } from "@/atoms/settings-dialog";
import { Icons } from "@/components/icons";
import type { SettingsTab } from "@/components/settings-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { env } from "@/env.mjs";
import { useCalendarDialog } from "@/hooks/use-calendar";

function previewUrl(id: string) {
  return `${env.NEXT_PUBLIC_SITE_URL}/calendar/${id}.ics`;
}

async function copyLink(id: string) {
  await navigator.clipboard.writeText(previewUrl(id));
  toast.success("Skopiowano link do schowka");
}

export function AddCalendarDialog({ planId }: { planId: string }) {
  const { isDialogOpen, setIsDialogOpen } = useCalendarDialog();

  const [_settings, setSettings] = useAtom(settingsDialogAtom);

  const openSettings = (tab: SettingsTab) => {
    setSettings({ open: true, tab });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="flex h-[50vh] w-full max-w-[min(800px,50vw)] flex-col gap-4 overflow-hidden">
        <DialogHeader>
          <DialogTitle>Dodaj plan do kalendarza</DialogTitle>
          <DialogDescription className="text-balance">
            Od teraz Planer wspiera dodawanie Twojego planu do kalendarza w
            formie subskrypcji.
          </DialogDescription>
        </DialogHeader>

        <div className="flex w-full flex-row gap-x-8">
          <div className="bg-muted/40 flex w-1/2 flex-col flex-wrap justify-start gap-x-8 gap-y-4 rounded-xl border p-3">
            <h1 className="text-center text-xl">Subskrypcja</h1>
            <p>
              Możesz dodać zajęcia z tego planu jako subskrypcję do aplikacji
              swojego kalendarza
            </p>
            <p>
              Dzięki temu zmiany w terminach zajęć, lub Twoje modyfikacje planu
              automatycznie się zaktualizują{" "}
            </p>
            <p>
              Skopiuj poniższy link, a następnie dodaj go jako kalendarz
              subskrybowany
            </p>
            <div className="bg-background/50 flex max-w-full items-center gap-2 rounded-full border p-1">
              <p className="hidden truncate pl-2 md:block">
                {previewUrl(planId)}
              </p>
              <Button
                size="sm"
                className="rounded-full"
                variant="secondary"
                onClick={async () => {
                  await copyLink(planId);
                }}
              >
                <Icons.Link className="size-4" />
                Skopiuj
              </Button>
            </div>
          </div>
          <div className="bg-muted/40 flex w-full flex-col flex-wrap justify-start gap-x-8 gap-y-4 rounded-xl border p-3">
            <h1 className="text-center text-xl">Pobierz plik .ics</h1>
            <p>
              Możesz również wygenerować klasyczny plik .ics, a następnie
              zaimportować go do swojego kalendarza
            </p>
            <Button
              onClick={() => {
                setIsDialogOpen(false);
                openSettings("calendar");
              }}
              variant={"outline"}
            >
              Jak zaimportować plik do kalendarza?
            </Button>
            <Button>
              <Link href={previewUrl(planId)} target="_blank">
                Pobierz plik .ics
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
