import type React from "react";
import { PlansTopbar } from "./_components/PlansTopbar";

export default function PlansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen min-h-screen flex-col items-center overflow-x-hidden">
      <PlansTopbar />

      {children}

      <div className="flex w-full items-center justify-center bg-mainbutton7 p-2 py-6">
        <p className="text-center text-white">
          Made with ❤️ by{" "}
          <a
            href="https://solvro.pwr.edu.pl/"
            className="font-bold text-mainbutton hover:underline"
          >
            SOLVRO
          </a>
        </p>
      </div>
    </div>
  );
}
