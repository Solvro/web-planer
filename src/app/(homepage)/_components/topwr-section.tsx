"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import ToPwrBg from "@/../public/assets/topwr_bg.png";
import { childVariants, parentVariants } from "@/constants";

export function ToPWrSection() {
  return (
    <section
      className="bg-background relative overflow-hidden rounded-t-3xl"
      id="topwr"
    >
      <div className="relative z-10 rounded-t-3xl bg-orange-500/15 py-16 dark:bg-orange-900/40">
        <motion.div
          className="relative container mx-auto max-w-7xl px-4 py-16"
          variants={parentVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <div className="mx-auto space-y-4 pb-6 text-center">
            <motion.p
              variants={childVariants}
              className="font-mono text-sm font-semibold tracking-wider text-orange-500 uppercase"
            >
              Jesteś studentem politechniki wrocławskiej?
            </motion.p>
            <motion.h2
              variants={childVariants}
              className="mx-auto mt-4 max-w-xs text-3xl font-bold tracking-tight sm:max-w-none sm:text-4xl md:text-5xl"
            >
              Koniecznie zainstaluj aplikację{" "}
              <Image
                src="/assets/logo/topwr_logo.svg"
                alt="ToPWR Logo"
                className="inline brightness-0 dark:invert"
                width={140}
                height={50}
              />
            </motion.h2>
            <motion.p
              variants={childVariants}
              className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-6 text-balance"
            >
              Znajdziesz w niej wszystkie potrzebne informacje o parkingach,
              menu w SKS, mapie kampusu i wiele więcej.
            </motion.p>
          </div>

          <motion.div
            variants={childVariants}
            className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href="https://play.google.com/store/apps/details?id=com.solvro.topwr"
              data-umami-event="Download"
              data-umami-event-type="Google Play"
              target="_blank"
              className="transition-transform duration-300 hover:-translate-y-0.5"
            >
              <Image
                src="/assets/google_play.png"
                alt="Pobierz z Google Play"
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
              className="transition-transform duration-300 hover:-translate-y-0.5"
            >
              <Image
                src="/assets/apple_store.png"
                alt="Pobierz z App Store"
                width={144}
                height={50}
                className="w-[144px]"
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>
      <motion.img
        initial={{ opacity: 0, scale: 1.05 }}
        whileInView={{ opacity: 0.3, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        src={ToPwrBg.src}
        alt=""
        className="absolute inset-0 left-0 z-0 w-full rounded-t-3xl object-contain object-center blur-md"
      />
    </section>
  );
}
