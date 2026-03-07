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
        <h2 className="text-sm text-muted-foreground">
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
                "items-center rounded-md border-2 border-muted p-1",
                {
                  "ring-2 ring-ring ring-offset-2 ring-offset-background":
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
            <span className="font-cal mt-3 text-sm font-light text-muted-foreground">
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
                "items-center rounded-md border-2 border-muted p-1",
                {
                  "ring-2 ring-ring ring-offset-2 ring-offset-background":
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
            <span className="font-cal mt-3 text-sm font-light text-muted-foreground">
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
                  "items-center rounded-md border-2 border-muted p-1",
                  {
                    "ring-2 ring-ring ring-offset-2 ring-offset-background":
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
                className="absolute bottom-0 left-0 right-0 top-0"
                style={{
                  clipPath: "polygon(100% 0, 0 0, 100% 100%)",
                }}
              >
                <div className="items-center rounded-md border-2 border-muted bg-popover p-1">
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
            <span className="font-cal mt-3 text-sm font-light text-muted-foreground">
              System
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
