import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Script from "next/script";
import type React from "react";

import { ClientProviders } from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/env.mjs";
import { SessionProvider } from "@/hooks/use-session";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { UmamiTracker } from "@/types/umami";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Planer Solvro",
    default: "Planer - utwórz swój plan zajęć na PWR!",
  },
  icons: [
    {
      url: "/favicon.ico",
      type: "image/x-icon",
    },
    {
      sizes: "32x32",
      type: "image/png",
      url: "/favicon-32x32.png",
    },
    {
      sizes: "16x16",
      type: "image/png",
      url: "/favicon-16x16.png",
    },
  ],
  description:
    "Planer to strona stworzona z myślą o studentach PWR, którzy pragną w prosty i intuicyjny sposób zarządzać swoimi zapisami na kursy (za darmo!).",
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
    url: `https://planer.solvro.pl/`,
    images: [
      {
        url: "/og_image.png",
        width: 2170,
        height: 1064,
        alt: "Planer - utwórz swój plan zajęć na PWR!",
      },
    ],
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Planer - utwórz swój plan zajęć na PWR!",
    description: "https://planer.solvro.pl/",
    images: ["/og_image.png"],
  },
  appleWebApp: {
    statusBarStyle: "black",
    title: "Planer - utwórz swój plan zajęć na PWR!",
    startupImage: "/apple_startup_image.png",
  },
  manifest: "/site.webmanifest",
};

const inter = Space_Grotesk({ subsets: ["latin"] });

declare global {
  interface Window {
    umami?: UmamiTracker;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await auth({ disableThrow: true });

  return (
    <html lang="pl" suppressHydrationWarning={true} className="scroll-smooth">
      <SessionProvider user={user}>
        <ClientProviders>
          <body className={cn(inter.className, "min-h-screen")}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
            <Script
              async={true}
              defer={true}
              src="https://analytics.solvro.pl/script.js"
              data-website-id="ab126a0c-c0ab-401b-bf9d-da652aab69ec"
              data-domains="planer.solvro.pl"
            />
            <Toaster richColors={true} />
          </body>
        </ClientProviders>
      </SessionProvider>
    </html>
  );
}
