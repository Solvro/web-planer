"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import type React from "react";

import { signOutFunction } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import { removeSyncedLocalPlans } from "@/lib/plan/local-plans";

const signOut = async () => {
  await signOutFunction();
  // Synced plans stay available online; drop their local copies so the next
  // user of this browser does not see them.
  removeSyncedLocalPlans();
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
