"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export function ToPWrAd() {
  return (
    <section className="bg-background" id="topwr">
      <div className="rounded-xl bg-orange-500/20 py-16 dark:bg-orange-500/10">
        <div className="container relative mx-auto max-w-7xl px-4 py-16">
          <div className="mx-auto space-y-4 pb-6 text-center">
            <h2 className="font-mono text-sm font-medium uppercase tracking-wider text-orange-600">
              jesteś studentem politechniki wrocławskiej?
            </h2>
            <h3 className="mx-auto mt-4 max-w-xs text-3xl font-bold sm:max-w-none sm:text-4xl md:text-5xl">
              Koniecznie zainstaluj aplikację{" "}
              <Image
                src={"/assets/logo/topwr_logo.svg"}
                alt={"ToPWR Logo"}
                className="inline brightness-0 dark:invert"
                width={140}
                height={50}
              />
            </h3>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-6 text-slate-600 dark:text-slate-300">
              Znajdziesz w niej wszystkie potrzebne informacje o parkingach,
              menu w SKS, mapie kampusu i wiele więcej.
            </p>
          </div>

          <div className="flex w-full flex-col items-center justify-center space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="mt-4 flex items-center gap-2">
              <Link
                href="https://play.google.com/store/apps/details?id=com.solvro.topwr"
                onClick={() => {
                  void window.umami?.track("Download", {
                    type: "Google Play",
                  });
                }}
              >
                <Image
                  src={"/assets/google_play.png"}
                  alt={"Download on google play"}
                  width={300}
                  height={50}
                  className="w-[160px]"
                />
              </Link>
              <Link
                href="https://apps.apple.com/us/app/topwr/id1644647395"
                onClick={() => {
                  void window.umami?.track("Download", { type: "App Store" });
                }}
              >
                <Image
                  src={"/assets/apple_store.png"}
                  alt={"Download on google play"}
                  width={300}
                  height={50}
                  className="w-[144px]"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
