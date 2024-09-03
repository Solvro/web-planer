import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { Space_Grotesk } from "next/font/google";
import Script from "next/script";

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
