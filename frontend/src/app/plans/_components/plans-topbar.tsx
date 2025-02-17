import Link from "next/link";
import React, { Suspense } from "react";

import { SolvroLogo } from "@/components/solvro-logo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserButton } from "@/components/user-button";
import { auth } from "@/lib/auth";

import { FeedbackButton } from "./feedback-button";
import { SidebarTriggerButton } from "./sidebar-trigger-button";

export function PlansTopbar() {
  return (
    <div className="fixed inset-x-0 left-0 top-0 z-30 flex w-full items-center justify-between bg-mainbutton7 py-4 shadow-sm backdrop-blur-[12px] dark:border-b dark:bg-white/5">
      <div className="flex w-full items-center justify-between md:container md:mx-auto">
        <div className="ml-4 flex items-center gap-4 text-2xl font-bold text-white md:w-1/4">
          <SolvroLogo />
          <h1 className="hidden text-2xl font-semibold md:block">Planer</h1>
        </div>
        <div className="mr-4 flex w-1/4 items-center justify-end">
          <SidebarTriggerButton />
          <Button
            asChild={true}
            variant={"ghost"}
            className="hidden text-white hover:bg-blue-200/40 hover:text-white dark:hover:bg-white/5 md:flex"
          >
            <Link href="/plans">Moje plany</Link>
          </Button>
          <Button
            asChild={true}
            variant={"ghost"}
            className="hidden text-white hover:bg-blue-200/40 hover:text-white dark:hover:bg-white/5 md:flex"
          >
            <Link
              href="https://web.usos.pwr.edu.pl/kontroler.php?_action=news/default&panel=DOMYSLNY&file=zapisyPL.html"
              target="_blank"
            >
              Terminarz USOS
            </Link>
          </Button>
          <FeedbackButton
            ghost={true}
            className="mr-2 hidden text-white hover:text-white md:flex"
          />
          {/* <ModeToggle className="ml-1 mr-2 min-w-10" /> */}

          <Suspense
            fallback={<Skeleton className="size-[40px] rounded-full" />}
          >
            <UserProfile />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function UserProfile() {
  try {
    const profile = await auth({ type: "adonis" });
    if (profile == null) {
      throw new Error("No profile");
    }

    return <UserButton profile={profile} />;
  } catch {
    return (
      <Button variant="default" size="sm" asChild={true}>
        <Link href="/login" prefetch={false}>
          Zaloguj się
        </Link>
      </Button>
    );
  }
}
