import { GalleryHorizontal, GalleryVertical } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePlanOrientation } from "@/hooks/use-plan-orientation";

import { Button } from "./ui/button";

export function PlanOrientationButton() {
  const { isHorizontal, toggle } = usePlanOrientation();

  return (
    <Tooltip>
      <TooltipTrigger asChild={true}>
        <Button size="icon" className="min-w-10" onClick={toggle}>
          {isHorizontal ? <GalleryVertical /> : <GalleryHorizontal />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Obróć</p>
      </TooltipContent>
    </Tooltip>
  );
}
