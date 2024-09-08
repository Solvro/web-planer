import Link from "next/link";
import { useEffect, useState } from "react";
import { SlSizeFullscreen } from "react-icons/sl";

import { cn } from "@/lib/utils";

import { buttonVariants } from "./ui/button";

export function PlanDisplayLink({ hash }: { hash: string }) {
  const [linkURL, setLinkURL] = useState("");

  useEffect(() => {
    setLinkURL(`${window.location.origin}/shareplan/${hash}`);
  }, [hash]);

  return (
    <Link
      href={linkURL}
      className={cn(
        buttonVariants({ variant: "outline" }),
        "f bg-mainbutton2 font-semibold",
      )}
    >
      <span className="mr-2">Wyświetl</span>
      <SlSizeFullscreen />
    </Link>
  );
}
