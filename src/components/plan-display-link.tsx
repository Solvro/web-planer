import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useShare } from "@/hooks/use-share";

import { Icons } from "./icons";
import { Button } from "./ui/button";

export function PlanDisplayLink() {
  const { openDialog } = useShare();

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button size="icon" className="min-w-10" onClick={openDialog}>
            <Icons.Share className="size-4" />
          </Button>
        }
      />
      <TooltipContent>
        <p>Udostępnij</p>
      </TooltipContent>
    </Tooltip>
  );
}
