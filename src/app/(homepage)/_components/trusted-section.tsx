"use client";

/* eslint-disable @next/next/no-img-element */
import { motion } from "motion/react";

import PWrLogoColor from "@/../public/assets/logo/pwr_color.png";
import PWrLogoMono from "@/../public/assets/logo/pwr_mono.png";
import { childVariants, parentVariants } from "@/constants";

const PARTNERS = [
  {
    alt: "Solvro",
    src: "/assets/logo/solvro_black.png",
    className: "h-8 w-34",
  },
  { alt: "WiT", src: "/assets/logo/wit_logo.svg", className: "h-14 w-auto" },
  {
    alt: "SeoHost",
    src: "https://cms.solvro.pl/assets/357529a6-a9b9-41eb-97dc-8be7ce994400",
    className: "h-8 w-32",
  },
  {
    alt: "Best",
    src: "https://cms.solvro.pl/assets/73d61c14-88e3-4d69-bf5b-51799e8d75f5",
    className: "h-14 w-auto",
  },
];

const logoClass =
  "px-2 opacity-70 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0 dark:brightness-0 dark:invert dark:hover:brightness-0 dark:hover:invert";

export function TrustedSection() {
  return (
    <motion.section
      id="clients"
      className="mx-auto max-w-[80rem] px-6 text-center md:px-8"
      variants={parentVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ staggerChildren: 0.08 }}
    >
      <div className="py-14">
        <div className="mx-auto max-w-[theme(screens.xl)] px-4 md:px-8">
          <motion.h2
            variants={childVariants}
            className="text-muted-foreground text-center text-xs font-semibold tracking-[0.2em] uppercase"
          >
            Zaufany przez wielu studentów i partnerów
          </motion.h2>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-16">
            <motion.li variants={childVariants}>
              <img
                alt="PWr"
                src={PWrLogoMono.src}
                className="hidden h-8 w-40 px-2 opacity-70 transition-opacity hover:opacity-100 dark:block dark:brightness-0 dark:invert"
              />
              <img
                alt="PWr"
                src={PWrLogoColor.src}
                className="block h-8 w-40 px-2 opacity-70 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0 dark:hidden"
              />
            </motion.li>
            {PARTNERS.map((partner) => (
              <motion.li key={partner.alt} variants={childVariants}>
                <img
                  alt={partner.alt}
                  src={partner.src}
                  className={`${partner.className} ${logoClass}`}
                />
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.section>
  );
}
