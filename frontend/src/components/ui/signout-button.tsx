// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair

/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { Slot } from "@radix-ui/react-slot";
import type React from "react";

import { signOutFunction } from "@/actions/logout";
import { Button } from "@/components/ui/button";

// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-misused-promises */

export function SignOutButton({
  children,
  asChild = false,
}: {
  children?: React.ReactNode;
  asChild?: boolean;
}) {
  if (asChild) {
    return (
      <Slot
        className="w-full"
        onClick={async (e) => {
          e.preventDefault();
          await signOutFunction();
          // refresh
          window.location.reload();
        }}
      >
        {children}
      </Slot>
    );
  }
  return (
    <form
      action={async () => {
        await signOutFunction();
      }}
    >
      <Button type="submit">{children}</Button>
    </form>
  );
}
