import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/user-button";
import type { User } from "@/types";

export function ProfileSummary({ profile }: { profile: User }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profil</h3>
        <p className="text-muted-foreground text-sm">Twoje dane profilowe.</p>
      </div>
      <Separator />
      <div className="flex flex-col items-start gap-4 rounded-md border p-5 md:flex-row">
        <UserAvatar profile={profile} />
        <div className="flex w-full flex-col">
          <h1 className="text-lg font-semibold">
            {profile.firstName == null || profile.lastName == null ? (
              <span className="text-muted-foreground font-medium italic">
                Nie podano imienia i nazwiska
              </span>
            ) : (
              <>
                {profile.firstName} {profile.lastName}
              </>
            )}
          </h1>
          <div className="mt-2 w-full">
            <div className="flex w-full items-center justify-between">
              <p>Adres e-mail:</p>
              <h3 className="font-medium">{profile.email}</h3>
            </div>
            {profile.studentNumber == null ? null : (
              <div className="flex w-full items-center justify-between">
                <p>Numer indeksu:</p>
                <h3 className="font-medium">{profile.studentNumber}</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
