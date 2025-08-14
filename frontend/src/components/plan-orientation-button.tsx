import { GalleryHorizontal, GalleryVertical } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePlanOrientation } from "@/hooks/use-plan-orientation";
import { cn } from "@/lib/utils";

import { Button } from "./ui/button";

export function PlanOrientationButton({ icon = false }: { icon?: boolean }) {
  const { isHorizontal, toggle } = usePlanOrientation();

  return (
    <Tooltip>
      <TooltipTrigger asChild={true}>
        <Button
          size={icon ? "icon" : "default"}
          variant={"secondary"}
          onClick={toggle}
          className={cn("w-full", {
            "w-10 min-w-10 rounded-full": icon,
          })}
        >
          {icon ? null : "Obróć"}
          {isHorizontal ? <GalleryVertical /> : <GalleryHorizontal />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Obróć</p>
      </TooltipContent>
    </Tooltip>
  );
}
