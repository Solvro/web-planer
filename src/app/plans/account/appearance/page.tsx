"use client";

import { useTheme } from "next-themes";
import React from "react";

import { cn } from "@/lib/utils";

export default function AppearancePage() {
  const { setTheme, theme } = useTheme();

  return (
    <>
      <div>
        <h3 className="text-lg font-medium">Wygląd</h3>
        <h2 className="text-muted-foreground text-sm">
          Wybierz preferowany motyw strony.
        </h2>
      </div>

      <div className="mt-10">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <button
            onClick={() => {
              setTheme("light");
            }}
          >
            <div
              className={cn(
                "border-muted items-center rounded-md border-2 p-1",
                {
                  "ring-ring ring-offset-background ring-2 ring-offset-2":
                    theme === "light",
                },
              )}
            >
              <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]"></div>
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]"></div>
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-[#ecedef]"></div>
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]"></div>
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-[#ecedef]"></div>
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]"></div>
                </div>
              </div>
            </div>
            <span className="font-cal text-muted-foreground mt-3 text-sm font-light">
              Jasny
            </span>
          </button>
          <button
            onClick={() => {
              setTheme("dark");
            }}
          >
            <div
              className={cn(
                "border-muted items-center rounded-md border-2 p-1",
                {
                  "ring-ring ring-offset-background ring-2 ring-offset-2":
                    theme === "dark",
                },
              )}
            >
              <div className="space-y-2 rounded-sm bg-zinc-950 p-2">
                <div className="space-y-2 rounded-md bg-zinc-800 p-2 shadow-sm">
                  <div className="h-2 w-[80px] rounded-lg bg-zinc-400"></div>
                  <div className="h-2 w-[100px] rounded-lg bg-zinc-400"></div>
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-zinc-800 p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-zinc-400"></div>
                  <div className="h-2 w-[100px] rounded-lg bg-zinc-400"></div>
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-zinc-800 p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-zinc-400"></div>
                  <div className="h-2 w-[100px] rounded-lg bg-zinc-400"></div>
                </div>
              </div>
            </div>
            <span className="font-cal text-muted-foreground mt-3 text-sm font-light">
              Ciemny
            </span>
          </button>
          <button
            onClick={() => {
              setTheme("system");
            }}
          >
            <div className="relative">
              <div
                className={cn(
                  "border-muted items-center rounded-md border-2 p-1",
                  {
                    "ring-ring ring-offset-background ring-2 ring-offset-2":
                      theme === "system",
                  },
                )}
              >
                <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                  <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                    <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]"></div>
                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]"></div>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-[#ecedef]"></div>
                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]"></div>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-[#ecedef]"></div>
                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]"></div>
                  </div>
                </div>
              </div>
              <div
                className="absolute top-0 right-0 bottom-0 left-0"
                style={{
                  clipPath: "polygon(100% 0, 0 0, 100% 100%)",
                }}
              >
                <div className="border-muted bg-popover items-center rounded-md border-2 p-1">
                  <div className="space-y-2 rounded-sm bg-zinc-950 p-2">
                    <div className="space-y-2 rounded-md bg-zinc-800 p-2 shadow-sm">
                      <div className="h-2 w-[80px] rounded-lg bg-zinc-400"></div>
                      <div className="h-2 w-[100px] rounded-lg bg-zinc-400"></div>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-zinc-800 p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-zinc-400"></div>
                      <div className="h-2 w-[100px] rounded-lg bg-zinc-400"></div>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-zinc-800 p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-zinc-400"></div>
                      <div className="h-2 w-[100px] rounded-lg bg-zinc-400"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <span className="font-cal text-muted-foreground mt-3 text-sm font-light">
              System
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
