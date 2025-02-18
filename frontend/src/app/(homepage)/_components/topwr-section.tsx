"use client";

import { motion, useAnimation, useInView } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";

import ToPwrBg from "@/../public/assets/topwr_bg.png";
import { childVariants, parentVariants } from "@/constants";

const imageVariant = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 0.3,
  },
};

export function ToPWrSection() {
  const ref = useRef(null);
  const isInview = useInView(ref, { once: true, amount: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInview) {
      void controls.start("visible");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInview]);

  return (
    <section
      className="relative overflow-hidden rounded-t-xl bg-background"
      id="topwr"
    >
      <div className="relative z-10 rounded-t-xl bg-orange-500/20 py-16 dark:bg-orange-900/50">
        <motion.div
          className="container relative mx-auto max-w-7xl px-4 py-16"
          variants={parentVariants}
          ref={ref}
          initial="hidden"
          animate={controls}
          transition={{ staggerChildren: 0.1 }}
        >
          <div className="mx-auto space-y-4 pb-6 text-center">
            <motion.h2
              variants={childVariants}
              className="font-mono text-sm font-semibold uppercase tracking-wider text-orange-500"
            >
              Jesteś studentem politechniki wrocławskiej?
            </motion.h2>
            <motion.h3
              variants={childVariants}
              className="mx-auto mt-4 max-w-xs text-3xl font-bold sm:max-w-none sm:text-4xl md:text-5xl"
            >
              Koniecznie zainstaluj aplikację{" "}
              <Image
                src={"/assets/logo/topwr_logo.svg"}
                alt={"ToPWR Logo"}
                className="inline brightness-0 dark:invert"
                width={140}
                height={50}
              />
            </motion.h3>
            <motion.p
              variants={childVariants}
              className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-6 text-slate-600 dark:text-slate-300"
            >
              Znajdziesz w niej wszystkie potrzebne informacje o parkingach,
              menu w SKS, mapie kampusu i wiele więcej.
            </motion.p>
          </div>

          <div className="flex w-full flex-col items-center justify-center space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <motion.div
              variants={childVariants}
              className="mt-4 flex items-center gap-2"
            >
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
            </motion.div>
          </div>
        </motion.div>
      </div>
      <motion.img
        variants={imageVariant}
        ref={ref}
        initial="hidden"
        animate={controls}
        transition={{ staggerChildren: 0.1 }}
        src={ToPwrBg.src}
        alt=""
        className="absolute inset-0 left-0 z-0 w-full rounded-t-xl object-contain object-center opacity-30 blur-md"
      />
    </section>
  );
}
