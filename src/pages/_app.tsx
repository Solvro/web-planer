import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import type { AppProps } from "next/app";
import { Space_Grotesk } from "next/font/google";
import Head from "next/head";
import Script from "next/script";
import { useState } from "react";

import { Seo } from "@/components/SEO";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import type { UmamiTracker } from "@/types/umami";

const inter = Space_Grotesk({ subsets: ["latin"] });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

declare global {
  interface Window {
    umami?: UmamiTracker;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const [persister] = useState(() =>
    createSyncStoragePersister({
      storage: typeof window !== "undefined" ? window.localStorage : null,
    }),
  );

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Seo />
      <Script
        defer={true}
        src="https://analytics.solvro.pl/script.js"
        data-website-id="ab126a0c-c0ab-401b-bf9d-da652aab69ec"
        data-domains="planer.solvro.pl"
      />
      <div className={cn(inter.className, "min-h-screen")}>
        <Component {...pageProps} />
      </div>
    </PersistQueryClientProvider>
  );
}
