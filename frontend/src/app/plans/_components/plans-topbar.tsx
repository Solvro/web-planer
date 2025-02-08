import Link from "next/link";
import React, { Suspense } from "react";

import { SolvroLogo } from "@/components/solvro-logo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserButton } from "@/components/user-button";
import { createUsosService } from "@/lib/usos";

import { FeedbackButton } from "./feedback-button";

export function PlansTopbar() {
  return (
    <div className="flex w-full items-center justify-between bg-mainbutton7 py-4 shadow-sm dark:border-b dark:bg-white/5">
      <div className="container mx-auto flex items-center justify-between">
        <div className="ml-4 flex items-center gap-4 text-2xl font-bold text-white md:w-1/4">
          <SolvroLogo />
          <h1 className="hidden text-2xl font-semibold md:block">Planer</h1>
        </div>
        <div className="mr-4 flex w-1/4 items-center justify-end">
          <Button
            asChild={true}
            variant={"ghost"}
            className="text-white hover:bg-blue-200/40 hover:text-white dark:hover:bg-white/5"
          >
            <Link href="/plans">Moje plany</Link>
          </Button>
          <Button
            asChild={true}
            variant={"ghost"}
            className="text-white hover:bg-blue-200/40 hover:text-white dark:hover:bg-white/5"
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
            className="mr-2 text-white hover:text-white"
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
    const usos = await createUsosService();
    const profile = await usos.getProfile();

    return <UserButton profile={profile} />;
  } catch {
    return (
      <Button variant="default" size="sm" asChild={true}>
        <Link href="/api/login" prefetch={false}>
          Zaloguj się
        </Link>
      </Button>
    );
  }
}
