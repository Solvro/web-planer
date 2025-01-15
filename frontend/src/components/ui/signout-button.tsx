"use client";

import { Slot } from "@radix-ui/react-slot";
import type React from "react";

import { signOutFunction } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import type { PlanState } from "@/types";

const signOut = async () => {
  await signOutFunction();

  // usuwanie planów z localStorage ktore sa zsynchronizowane z serwerem
  const items = { ...localStorage };
  const removedPlans: string[] = [];
  for (const key in items) {
    if (key === "plansIds-v2") {
      continue;
    }
    const storedItem = localStorage.getItem(key);
    const item =
      storedItem === null ? null : (JSON.parse(storedItem) as PlanState | null);
    if (item === null) {
      continue;
    }
    if (item.onlineId !== null && item.synced) {
      removedPlans.push(item.id);
      localStorage.removeItem(key);
    }
  }
  const plansIds = localStorage.getItem("plansIds-v2");
  if (plansIds !== null) {
    const parsedPlansIds = JSON.parse(plansIds) as { id: string }[];
    const newPlansIds = parsedPlansIds.filter(
      (plan) => !removedPlans.includes(plan.id),
    );
    localStorage.setItem("plansIds-v2", JSON.stringify(newPlansIds));
  }

  window.location.reload();
};

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
        void signOut();
      }}
    >
      <Button type="submit">{children}</Button>
    </form>
  );
}
