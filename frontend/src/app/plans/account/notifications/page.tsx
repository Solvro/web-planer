import { notFound } from "next/navigation";
import React from "react";

import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";

import { NotificationsForm } from "../../_components/notifications-form";

export default async function NotificationsPage() {
  let user;
  try {
    user = await auth();
    if (user == null) {
      throw new Error("Not logged in");
    }
  } catch {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Powiadomienia</h3>
        <p className="text-sm text-muted-foreground">
          Zarządzaj swoimi powiadomieniami.
        </p>
      </div>
      <Separator />
      <NotificationsForm defaultUser={user} />
    </div>
  );
}
