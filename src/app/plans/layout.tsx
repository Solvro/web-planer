import type React from "react";

import { SidebarProvider } from "@/components/ui/sidebar";

import { PlansTopbar } from "./_components/plans-topbar";

export default function PlansLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  // const year = await getCurrentYear();

  return (
    <div className="flex h-screen min-h-screen flex-col items-center overflow-x-hidden">
      <SidebarProvider>
        <PlansTopbar />

        {children}
        {modal}
      </SidebarProvider>

      {/* <div className="flex w-full flex-col items-center justify-center p-2 py-6">
        <p className="text-center text-white">
          Made with ❤️ by{" "}
          <a
            href="https://solvro.pwr.edu.pl/"
            className="text-mainbutton font-bold hover:underline"
          >
            SOLVRO
          </a>{" "}
          © {year}
        </p>
        <p className="dark:text-muted-foreground text-center text-xs text-balance text-gray-300">
          Źródłem danych o zajęciach jest USOS i ich prawnym właścicielem jest
          Politechnika Wrocławska
        </p>
      </div> */}
    </div>
  );
}
