import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/lib/useMediaQuery";

export const DeletePlanConfirmationResponsiveDialog = ({
  deletePlan,
}: {
  deletePlan: () => void;
}) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const closeDialog = () => {
    setOpen(false);
  };
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild={true}>
          <button className="w-full rounded-md rounded-t-none p-2 text-left hover:bg-slate-200">
            Usuń
          </button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[425px]"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle>Czy na pewno chcesz usunąć plan?</DialogTitle>
          </DialogHeader>
          <DeletePlan deletePlan={deletePlan} closeDialog={closeDialog} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild={true}>
        <button className="w-full rounded-md rounded-t-none p-2 text-left hover:bg-slate-200">
          Usuń
        </button>
      </DrawerTrigger>
      <DrawerContent
        className="items-center px-4 pb-6"
        aria-describedby={undefined}
      >
        <DrawerHeader className="w-full max-w-[400px] text-left">
          <DrawerTitle>Czy na pewno chcesz usunąć plan</DrawerTitle>
        </DrawerHeader>
        <DeletePlan deletePlan={deletePlan} closeDialog={closeDialog} />
      </DrawerContent>
    </Drawer>
  );
};

function DeletePlan({
  deletePlan,
  closeDialog,
}: {
  deletePlan: () => void;
  closeDialog: () => void;
}) {
  return (
    <div className="flex w-full max-w-[400px] items-center justify-end gap-4 space-x-2 pt-4">
      <button
        onClick={() => {
          closeDialog();
        }}
      >
        Anuluj
      </button>
      <Button
        onClick={() => {
          deletePlan();
        }}
        className="rounded-md bg-red-500 text-lg hover:bg-red-400"
      >
        Tak
      </Button>
    </div>
  );
}
