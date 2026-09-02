"use client";

import { AppearanceContent } from "@/app/plans/account/_components/appearance-content";
import { CalendarContent } from "@/app/plans/account/_components/calendar-content";
import { ProfileSummary } from "@/app/plans/account/_components/profile-summary";
import { SecurityContent } from "@/app/plans/account/_components/security-content";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

import { Icons } from "./icons";

export type SettingsTab = "profile" | "security" | "appearance" | "calendar";

const TABS: { id: SettingsTab; title: string; icon: React.ReactNode }[] = [
  { id: "profile", title: "Profil", icon: <Icons.User className="size-4" /> },
  {
    id: "security",
    title: "Bezpieczeństwo",
    icon: <Icons.Shield className="size-4" />,
  },
  {
    id: "appearance",
    title: "Motyw strony",
    icon: <Icons.Palette className="size-4" />,
  },
  {
    id: "calendar",
    title: "Dodawanie do kalendarza",
    icon: <Icons.AddCalendar className="size-4" />,
  },
];

export function SettingsDialog({
  open,
  onOpenChange,
  tab,
  onTabChange,
  profile,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
  profile: User;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[min(680px,85vh)] w-full max-w-4xl flex-col gap-0 overflow-hidden p-0 sm:rounded-2xl">
        <DialogHeader className="shrink-0 border-b px-6 py-5">
          <DialogTitle>Ustawienia</DialogTitle>
          <DialogDescription>
            Zarządzaj swoim kontem i ustawieniami planera.
          </DialogDescription>
        </DialogHeader>
        <div className="flex min-h-0 flex-1">
          <nav className="w-52 shrink-0 space-y-1 border-r p-3 sm:w-60">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onTabChange(item.id);
                }}
                className={cn(
                  "flex w-full items-start gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
                  tab === item.id
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                <span className="mt-0.5 shrink-0">{item.icon}</span>
                <span>{item.title}</span>
              </button>
            ))}
          </nav>
          <div className="min-w-0 flex-1 overflow-y-auto p-6">
            {tab === "profile" ? (
              <ProfileSummary profile={profile} />
            ) : tab === "security" ? (
              <SecurityContent />
            ) : tab === "appearance" ? (
              <AppearanceContent />
            ) : (
              <CalendarContent />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
