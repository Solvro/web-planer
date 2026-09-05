import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Script from "next/script";
import type React from "react";

import { ClientProviders } from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/env.mjs";
import { SITE_DESCRIPTION, SITE_ORIGIN, SITE_TITLE } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { UmamiTracker } from "@/types/umami";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Planer Solvro",
    default: SITE_TITLE,
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
  description: SITE_DESCRIPTION,
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
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_ORIGIN,
    images: [
      {
        url: "/og_image.png",
        width: 2170,
        height: 1064,
        alt: SITE_TITLE,
      },
    ],
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og_image.png"],
  },
  appleWebApp: {
    statusBarStyle: "black",
    title: SITE_TITLE,
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pl"
      suppressHydrationWarning={true}
      className="scroll-smooth"
      data-scroll-behavior="smooth"
    >
      <head>
        <meta
          httpEquiv="origin-trial"
          content="AqgFs1KEaYyU5h9n5Oy3/POxaSIMNi5iG1uqbJcLD3pz1203cHSC9tffZEXmDM7xUhLpCSqptiKr3m+RBBexYQkAAAB2eyJvcmlnaW4iOiJodHRwczovL3BsYW5lci5zb2x2cm8ucGw6NDQzIiwiZmVhdHVyZSI6IkVtYWlsVmVyaWZpY2F0aW9uUHJvdG9jb2wiLCJleHBpcnkiOjE3OTQ4NzM2MDAsImlzU3ViZG9tYWluIjp0cnVlfQ=="
        />
      </head>
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
          <GoogleAnalytics gaId="G-63K05JV85M" />
        </body>
      </ClientProviders>
    </html>
  );
}
