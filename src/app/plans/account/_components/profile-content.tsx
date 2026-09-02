import { notFound } from "next/navigation";

import { getCachedSession } from "@/lib/get-session";

import { ProfileSummary } from "./profile-summary";

export async function ProfileContent() {
  const session = await getCachedSession();
  if (session == null) {
    return notFound();
  }

  return <ProfileSummary profile={session.user} />;
}
