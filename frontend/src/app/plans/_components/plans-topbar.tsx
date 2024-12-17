import Link from "next/link";
import React, { Suspense } from "react";

import { SolvroLogo } from "@/components/solvro-logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserButton } from "@/components/user-button";
import { createUsosService } from "@/lib/usos";
import { cn } from "@/lib/utils";

export function PlansTopbar() {
  return (
    <div className="flex w-full items-center justify-between bg-mainbutton7 py-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="ml-4 flex items-center gap-4 text-2xl font-bold text-white md:w-1/4">
          <SolvroLogo />
          <h1 className="hidden text-2xl font-semibold md:block">Kreator</h1>
        </div>
        <div className="mr-4 flex w-1/4 items-center justify-end">
          <Link
            href="/plans"
            data-umami-event="Back to plans"
            className={cn(buttonVariants({ variant: "link" }), "text-white")}
          >
            <span className="text-nowrap">Moje plany</span>
          </Link>
          <Link
            href="https://web.usos.pwr.edu.pl/kontroler.php?_action=news/default&panel=DOMYSLNY&file=zapisyPL.html"
            target="_blank"
            data-umami-event="Go to USOS"
            className={cn(
              buttonVariants({ variant: "link" }),
              "hidden text-white md:flex",
            )}
          >
            <span className="text-nowrap">Terminarz USOS</span>
          </Link>

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
