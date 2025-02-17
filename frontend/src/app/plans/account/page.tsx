import { notFound } from "next/navigation";
import React from "react";

import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/user-button";
import { auth } from "@/lib/auth";

export default async function ProfilePage() {
  let profile;

  try {
    profile = await auth({ type: "adonis" });
    if (profile == null) {
      return notFound();
    }
  } catch {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profil</h3>
        <p className="text-sm text-muted-foreground">
          Są to oficjalne dane z USOSweb i możesz je zmienić właśnie tam.
        </p>
      </div>
      <Separator />
      <div className="flex flex-col items-start gap-4 rounded-md border p-5 md:flex-row">
        <UserAvatar profile={profile} />
        <div className="flex w-full flex-col">
          <h1 className="text-lg font-semibold">
            {profile.firstName} {profile.lastName}
          </h1>
          <div className="mt-2 w-full">
            <div className="flex w-full items-center justify-between">
              <p>Adres e-mail:</p>
              <h3 className="font-medium">
                {profile.studentNumber}@student.pwr.edu.pl
              </h3>
            </div>
            <div className="flex w-full items-center justify-between">
              <p>Numer indeksu:</p>
              <h3 className="font-medium">{profile.studentNumber}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
