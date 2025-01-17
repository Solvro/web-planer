import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

import { Separator } from "@/components/ui/separator";
import { createUsosService } from "@/lib/usos";

const USER_STATUSES = {
  0: "Nigdy nie byłeś studentem",
  1: "Były Student",
  2: "Aktywny Student",
};

const USER_SEX = {
  M: "Mężczyzna",
  K: "Kobieta",
};

export default async function ProfilePage() {
  let profile;

  try {
    const usos = await createUsosService();
    profile = await usos.getProfile();
  } catch {
    return notFound();
  }

  const sex = USER_SEX[profile.sex as keyof typeof USER_SEX] || "Nieznana";

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
        <div className="size-[51px] min-w-[51px] rounded-full border">
          <Image
            src={profile.photo_urls["50x50"]}
            alt={""}
            width={50}
            height={50}
            unoptimized
            className="size-[50px] rounded-full"
          />
        </div>
        <div className="flex w-full flex-col">
          <h1 className="text-lg font-semibold">
            {profile.first_name} {profile.last_name}
          </h1>
          <div className="mt-2 w-full">
            <div className="flex w-full items-center justify-between">
              <p>Adres e-mail:</p>
              <h3 className="font-medium">
                {profile.student_number}@student.pwr.edu.pl
              </h3>
            </div>
            <div className="flex w-full items-center justify-between">
              <p>Płeć:</p>
              <h3 className="font-medium">{sex}</h3>
            </div>
            <div className="flex w-full items-center justify-between">
              <p>Numer indeksu:</p>
              <h3 className="font-medium">{profile.student_number}</h3>
            </div>
            <div className="flex w-full items-center justify-between">
              <p>Status studenta:</p>
              <h3 className="font-medium">
                {
                  USER_STATUSES[
                    profile.student_status as keyof typeof USER_STATUSES
                  ]
                }
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
