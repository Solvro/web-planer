import Link from "next/link";
import React, { Suspense } from "react";

import { SolvroLogo } from "@/components/solvro-logo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserButton } from "@/components/user-button";
import { getCachedSession } from "@/lib/get-session";

import { FeedbackButton } from "./feedback-button";
import { SidebarTriggerButton } from "./sidebar-trigger-button";

export function PlansTopbar() {
  return (
    <header className="border-border/60 bg-background/85 fixed inset-x-0 top-0 z-30 border-b backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full items-center gap-3 px-4">
        <Link href="/plans" className="flex shrink-0 items-center gap-2">
          <SolvroLogo href={null} />
          <span className="hidden text-lg font-semibold sm:block">Planer</span>
        </Link>

        <div
          id="plan-header-slot"
          className="flex min-w-0 flex-1 items-center gap-2"
        />

        <Suspense fallback={null}>
          <SidebarTriggerButton />
        </Suspense>

        <nav className="hidden shrink-0 items-center gap-1 md:flex">
          <Button
            nativeButton={false}
            variant="secondary"
            size="sm"
            render={<Link href="/plans">Moje plany</Link>}
          />
          <Button
            nativeButton={false}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            render={
              <Link
                href="https://web.usos.pwr.edu.pl/kontroler.php?_action=news/default&panel=DOMYSLNY&file=zapisyPL.html"
                target="_blank"
              >
                Terminarz USOS
              </Link>
            }
          />
          <FeedbackButton
            ghost={true}
            className="text-muted-foreground hover:text-foreground"
          />
        </nav>

        <Suspense fallback={<Skeleton className="size-9 rounded-full" />}>
          <UserProfile />
        </Suspense>
      </div>
    </header>
  );
}

async function UserProfile() {
  const session = await getCachedSession();

  if (session == null) {
    return (
      <Button
        variant="default"
        size="sm"
        nativeButton={false}
        render={<Link href="/login">Zaloguj się</Link>}
      />
    );
  }
  return <UserButton profile={session.user} />;
}
