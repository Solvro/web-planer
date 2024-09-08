import Link from "next/link";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { buttonVariants } from "./ui/button";

export function PlanDisplayLink({ hash }: { hash: string }) {
  const [linkURL, setLinkURL] = useState("");

  useEffect(() => {
    setLinkURL(`${window.location.origin}/shareplan/${hash}`);
  }, [hash]);

  return (
    <Link href={linkURL} className={cn(buttonVariants(), "font-semibold")}>
      <span>Podgląd</span>
    </Link>
  );
}
