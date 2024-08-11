import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { Space_Grotesk } from "next/font/google";

const inter = Space_Grotesk({ subsets: ["latin"] });

const queryClient = new QueryClient();
export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={cn(inter.className, "min-h-screen")}>
        <Component {...pageProps} />
      </div>
    </QueryClientProvider>
  );
}
