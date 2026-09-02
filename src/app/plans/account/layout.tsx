import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getCachedSession } from "@/lib/get-session";

import { SettingsTabs } from "./_components/settings-tabs";

export const metadata: Metadata = {
  title: "Ustawienia",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full overflow-y-auto pt-16 pb-10">
      <div className="container mx-auto flex h-full min-h-screen flex-col space-y-6 p-4 pb-0 md:p-10">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Ustawienia</h2>
          <p className="text-muted-foreground">
            Zarządzaj swoim kontem i ustawieniami planera.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
          <aside className="lg:w-1/5">
            <SettingsTabs />
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
