"use client";

import { useRouter } from "next/navigation";
import type React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { SettingsTabs } from "../../account/_components/settings-tabs";

export default function AccountModalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
    >
      <DialogContent className="max-h-[85vh] w-full overflow-y-auto md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Ustawienia</DialogTitle>
          <DialogDescription>
            Zarządzaj swoim kontem i ustawieniami planera.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6 md:flex-row">
          <aside className="md:w-1/4">
            <SettingsTabs />
          </aside>
          <div className="flex-1">{children}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
