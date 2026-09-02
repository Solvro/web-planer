import type { Metadata } from "next";

import { SecurityContent } from "../_components/security-content";

export const metadata: Metadata = {
  title: "Bezpieczeństwo",
};

export default function SecurityPage() {
  return <SecurityContent />;
}
