import type React from "react";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import ClientProviders from "@/components/Providers";
import { env } from "@/env.mjs";
import { cn } from "@/lib/utils";
import type { UmamiTracker } from "@/types/umami";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Planer Solvro",
    default: "Planer - utwórz swój plan zajęć na PWR!",
  },
  icons: "/favicon.ico",
  description:
    "Planer to strona stworzona z myślą o studentach PWR, którzy pragną w prosty i intuicyjny sposób zarządzać swoimi zapisami na kursy (za darmo!).",
  authors: {
    url: "https://kamilmarczak.pl",
    name: "Kamil Marczak",
  },
  creator: "Kamil Marczak",
  robots: "index, follow",
  keywords: [
    "planer",
    "zapisy",
    "zapisynapwr",
    "zapisownik",
    "usos",
    "nauka",
    "Solvro",
    "pwr",
    "wrocław",
    "politechnika",
  ],
  metadataBase: new URL(env.SITE_URL),
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "Planer - utwórz swój plan zajęć na PWR!",
    description:
      "Planer to strona stworzona z myślą o studentach PWR, którzy pragną w prosty i intuicyjny sposób zarządzać swoimi zapisami na kursy (za darmo!).",
    url: `https://kamilmarczak.pl/`,
    images: [
      {
        url: "/og-image.png",
        width: 2360,
        height: 1337,
        alt: "Planer - utwórz swój plan zajęć na PWR!",
      },
    ],
    locale: "pl_PL",
    type: "website",
  },
};

const inter = Space_Grotesk({ subsets: ["latin"] });

declare global {
  interface Window {
    umami?: UmamiTracker;
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning={true} className="scroll-smooth">
      <ClientProviders>
        <body className={cn(inter.className, "min-h-screen")}>{children}</body>
      </ClientProviders>
    </html>
  );
}
