"use client";

import { Slot } from "@radix-ui/react-slot";
import type React from "react";

import { signOutFunction } from "@/actions/logout";
import { Button } from "@/components/ui/button";

export function SignOutButton({
  children,
  asChild = false,
}: {
  children?: React.ReactNode;
  asChild?: boolean;
}) {
  if (asChild) {
    const signOut = async () => {
      await signOutFunction();
      localStorage.clear();
      // refresh
      window.location.reload();
    };
    return (
      <Slot
        className="w-full"
        onClick={(event) => {
          event.preventDefault();
          void signOut();
        }}
      >
        {children}
      </Slot>
    );
  }
  return (
    <form
      action={() => {
        void signOutFunction();
        localStorage.clear();
      }}
    >
      <Button type="submit">{children}</Button>
    </form>
  );
}
