import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { Space_Grotesk } from "next/font/google";
import Head from "next/head";
import Script from "next/script";

import { Seo } from "@/components/SEO";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import type { UmamiTracker } from "@/types/umami";

const inter = Space_Grotesk({ subsets: ["latin"] });

const queryClient = new QueryClient();

declare global {
  interface Window {
    umami: UmamiTracker;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
