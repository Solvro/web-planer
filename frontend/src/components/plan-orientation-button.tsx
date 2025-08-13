import { GalleryHorizontal, GalleryVertical } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePlanOrientation } from "@/hooks/use-plan-orientation";
import { cn } from "@/lib/utils";

import { Button } from "./ui/button";

export function PlanOrientationButton({ rounded }: { rounded?: boolean }) {
  const { isHorizontal, toggle } = usePlanOrientation();

  return (
    <Tooltip>
      <TooltipTrigger asChild={true}>
        <Button
          size="icon"
          onClick={toggle}
          className={cn("min-w-10", (rounded ?? false) ? "rounded-full" : null)}
        >
          {isHorizontal ? <GalleryVertical /> : <GalleryHorizontal />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Obróć</p>
      </TooltipContent>
    </Tooltip>
  );
}
