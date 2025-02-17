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
              Jesteś studentem politechniki wrocławskiej?
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
                data-umami-event="Download"
                data-umami-event-type="Google Play"
                target="_blank"
              >
                <Image
                  src={"/assets/google_play.png"}
                  alt={"Pobierz z google play"}
                  width={160}
                  height={50}
                  className="w-[160px]"
                />
              </Link>
              <Link
                href="https://apps.apple.com/us/app/topwr/id1644647395"
                data-umami-event="Download"
                data-umami-event-type="App Store"
                target="_blank"
              >
                <Image
                  src={"/assets/apple_store.png"}
                  alt={"Pobierz z app store"}
                  width={144}
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
