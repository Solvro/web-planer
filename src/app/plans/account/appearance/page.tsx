import type { Metadata } from "next";

import { AppearanceContent } from "../_components/appearance-content";

export const metadata: Metadata = {
  title: "Motyw strony",
};

export default function AppearancePage() {
  return <AppearanceContent />;
}
