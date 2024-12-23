import { FolderSearch } from "lucide-react";
import Link from "next/link";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "./ui/button";

export function PlanDisplayLink({ id }: { id: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild={true}>
        <Button asChild={true} size="icon" className="min-w-10">
          <Link href={`/plans/preview/${id}`}>
            <FolderSearch className="size-4" />
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Podgląd</p>
      </TooltipContent>
    </Tooltip>
  );
}
