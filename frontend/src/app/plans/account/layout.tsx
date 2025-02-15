import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";

import { SidebarSettings } from "../_components/settings-sidebar";

export const metadata: Metadata = {
  title: "Ustawienia",
  description: "Advanced form example using react-hook-form and Zod.",
};

const sidebarNavItems = [
  {
    title: "Profil",
    href: "/plans/account",
    icon: <Icons.User className="size-4" />,
  },
  {
    title: "Motyw strony",
    href: "/plans/account/appearance",
    icon: <Icons.Palette className="size-4" />,
  },
  {
    title: "Powiadomienia",
    href: "/plans/account/notifications",
    icon: <Icons.Bell className="size-4" />,
  },
  {
    title: "Dodawanie do kalendarza",
    href: "/plans/account/calendar",
    icon: <Icons.AddCalendar className="size-4" />,
  },
];

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await auth();
  if (user === null) {
    return notFound();
  }

  return (
    <div className="w-full pb-10 pt-24">
      <div className="container mx-auto flex h-full min-h-screen flex-col space-y-6 p-4 pb-0 md:p-10">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Ustawienia</h2>
          <p className="text-muted-foreground">
            Zarządzaj swoim kontem i ustawieniami powiadomień mailowych.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarSettings items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-3xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
