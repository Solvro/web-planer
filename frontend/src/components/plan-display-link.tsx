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
      <TooltipTrigger asChild={true}>
        <Button
          size="icon"
          className="min-w-10"
          onClick={openDialog}
          data-testid="share-plan-button"
        >
          <Icons.Share className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Udostępnij</p>
      </TooltipContent>
    </Tooltip>
  );
}
