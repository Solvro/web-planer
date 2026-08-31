"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import type React from "react";

import { signOutFunction } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import type { PlanState } from "@/types";

const signOut = async () => {
  await signOutFunction();

  // usuwanie planów z localStorage ktore sa zsynchronizowane z serwerem
  // eslint-disable-next-line @typescript-eslint/no-misused-spread
  const items = { ...localStorage };
  const removedPlans: string[] = [];
  for (const key in items) {
    if (key === "plansIds-v2") {
      continue;
    }
    const storedItem = localStorage.getItem(key);
    const item =
      (storedItem ?? "") && storedItem?.startsWith("{") === true
        ? (JSON.parse(storedItem) as PlanState | null)
        : null;
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

function SignOutButtonRender({ render }: { render: React.ReactElement }) {
  return useRender({
    defaultTagName: "button",
    render,
    props: mergeProps<"button">(
      {
        className: "w-full",
        onClick: (event: React.MouseEvent) => {
          event.preventDefault();
          void signOut();
        },
      } as React.ComponentProps<"button">,
      {},
    ),
  });
}

export function SignOutButton({
  children,
  render,
}: {
  children?: React.ReactNode;
  render?: React.ReactElement;
}) {
  if (render !== undefined) {
    return <SignOutButtonRender render={render} />;
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
