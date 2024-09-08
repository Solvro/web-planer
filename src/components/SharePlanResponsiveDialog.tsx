import { Copy } from "lucide-react";
import * as React from "react";
import { MdOutlineIosShare } from "react-icons/md";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/lib/useMediaQuery";

export const SharePlanResponsiveDialog = ({ hash }: { hash: string }) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild={true}>
          <Button className="flex items-center justify-center gap-4 rounded-xl text-lg">
            Udostępnij
            <MdOutlineIosShare />
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[425px]"
          aria-describedby="Link do udostępnienia"
        >
          <DialogHeader>
            <DialogTitle>Udostępnij plan</DialogTitle>
            <DialogDescription>Skopiuj link</DialogDescription>
          </DialogHeader>
          <CopyLink hash={hash} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild={true}>
        <Button className="rounded-md bg-mainbutton3 text-lg text-black">
          <MdOutlineIosShare />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="items-center px-4">
        <DrawerHeader className="w-full max-w-[400px] text-left">
          <DrawerTitle>Udostępnij plan</DrawerTitle>
          <DrawerDescription>Skopiuj link</DrawerDescription>
        </DrawerHeader>
        <CopyLink hash={hash} />
        <DrawerFooter className="w-full max-w-[400px] px-0 pt-6">
          <DrawerClose asChild={true}>
            <Button variant="outline">Wróć</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

function CopyLink({ hash }: { hash: string }) {
  const sharePlan = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/shareplan/${hash}`)
      .catch(() => {
        alert("Something went wrong :(");
      });
  };
  return (
    <div className="flex w-full max-w-[400px] items-center space-x-2 pt-4">
      <Input
        value={`${window.location.origin}/shareplan/${hash}`}
        readOnly={true}
      />
      <Button onClick={sharePlan} className="rounded-md text-lg md:text-2xl">
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
}
