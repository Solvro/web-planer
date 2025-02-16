import { redirect } from "next/navigation";
import type React from "react";

import { auth } from "@/lib/auth";

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await auth({ disableThrow: true });
  if (user != null) {
    redirect("/plans");
  }
  return children;
}
