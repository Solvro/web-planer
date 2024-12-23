import React from "react";

import { Separator } from "@/components/ui/separator";

import { NotificationsForm } from "../../_components/notifications-form";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Powiadomienia</h3>
        <p className="text-sm text-muted-foreground">
          Zarządzaj swoimi powiadomieniami.
        </p>
      </div>
      <Separator />
      <NotificationsForm />
    </div>
  );
}
