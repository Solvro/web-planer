import { FolderSearch } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { buttonVariants } from "./ui/button";

export function PlanDisplayLink({ id }: { id: string }) {
  return (
    <Link
      href={`/plans/preview/${id}`}
      className={cn(buttonVariants({ size: "icon" }), "font-semibold")}
    >
      <FolderSearch className="size-4" />
    </Link>
  );
}
