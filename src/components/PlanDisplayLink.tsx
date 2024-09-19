import Link from "next/link";

import { cn } from "@/lib/utils";

import { buttonVariants } from "./ui/button";

export function PlanDisplayLink({ id }: { id: string }) {
  return (
    <Link
      href={`/app/preview/${id}`}
      className={cn(buttonVariants(), "font-semibold")}
    >
      <span>Podgląd</span>
    </Link>
  );
}
