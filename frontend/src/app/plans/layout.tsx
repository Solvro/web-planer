import Link from "next/link";
import type React from "react";

import { SolvroLogo } from "@/components/SolvroLogo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PlansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen min-h-screen flex-col items-center overflow-x-hidden">
      <div className="flex max-h-20 min-h-20 w-full items-center justify-between bg-mainbutton7">
        <div className="container mx-auto flex items-center justify-between">
          <div className="ml-4 flex items-center gap-2 text-2xl font-bold text-white md:w-1/4">
            <SolvroLogo />
            <div className="md:hidden">Kreator</div>
          </div>
          <div className="hidden w-1/2 items-center justify-center font-bold text-white md:flex md:text-4xl">
            Kreator
          </div>
          <div className="mr-4 flex w-1/4 items-center justify-end">
            <Link
              href="/plans"
              data-umami-event="Back to plans"
              className={cn(buttonVariants({ variant: "link" }), "text-white")}
            >
              <span className="text-nowrap">Moje plany</span>
            </Link>
          </div>
        </div>
      </div>

      {children}

      <div className="flex w-full items-center justify-center bg-mainbutton7 p-2 py-6">
        <p className="text-center text-white">
          Made with ❤️ by{" "}
          <a
            href="https://solvro.pwr.edu.pl/"
            className="font-bold text-mainbutton hover:underline"
          >
            SOLVRO
          </a>
        </p>
      </div>
    </div>
  );
}
