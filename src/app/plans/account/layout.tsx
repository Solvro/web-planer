import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getCachedSession } from "@/lib/get-session";

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
    title: "Dodawanie do kalendarza",
    href: "/plans/account/calendar",
    icon: <Icons.AddCalendar className="size-4" />,
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full overflow-y-auto pt-20 pb-10">
      <div className="container mx-auto flex h-full min-h-screen flex-col space-y-6 p-4 pb-0 md:p-10">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Ustawienia</h2>
          <p className="text-muted-foreground">
            Zarządzaj swoim kontem i ustawieniami powiadomień mailowych.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarSettings items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-3xl">
            <Suspense fallback={<Skeleton className="h-40 w-full" />}>
              <AuthGuard>{children}</AuthGuard>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

async function AuthGuard({ children }: { children: React.ReactNode }) {
  const session = await getCachedSession();
  if (session == null) {
    notFound();
  }
  return children;
}
