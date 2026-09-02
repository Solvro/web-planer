import type { Metadata } from "next";

import { ProfileContent } from "./_components/profile-content";

export const metadata: Metadata = {
  title: "Profil",
};

export default function AccountPage() {
  return <ProfileContent />;
}
