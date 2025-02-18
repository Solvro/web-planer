"use client";

/* eslint-disable @next/next/no-img-element */
import { motion, useAnimation, useInView } from "motion/react";
import React, { useEffect, useRef } from "react";

import PWrLogoColor from "@/../public/assets/logo/pwr_color.png";
import PWrLogoMono from "@/../public/assets/logo/pwr_mono.png";

const parentVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

const childVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export function TrustedSection() {
  const ref = useRef(null);
  const isInview = useInView(ref, { once: true, amount: 0.6 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInview) {
      void controls.start("visible");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInview]);
  return (
    <motion.section
      id="clients"
      className="mx-auto max-w-[80rem] px-6 text-center md:px-8"
      variants={parentVariants}
      ref={ref}
      initial="hidden"
      animate={controls}
      transition={{ staggerChildren: 0.1 }}
    >
      <div className="py-14">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <motion.h2
            variants={childVariants}
            className="text-center text-sm font-semibold text-gray-600"
          >
            ZAUFANY PRZEZ WIELU STUDENTÓW I PARTNERÓW
          </motion.h2>
          <div className="mt-6">
            <ul className="[&amp;_path]:fill-white flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-16">
              <motion.li variants={childVariants}>
                <img
                  alt="PWr"
                  src={PWrLogoMono.src}
                  className="hidden h-8 w-40 px-2 dark:block dark:brightness-0 dark:invert"
                />
                <img
                  alt="PWr"
                  src={PWrLogoColor.src}
                  className="block h-8 w-40 px-2 dark:hidden"
                />
              </motion.li>
              <motion.li variants={childVariants}>
                <img
                  alt="Solvro"
                  src="/assets/logo/solvro_black.png"
                  className="w-34 h-8 px-2 dark:brightness-0 dark:invert"
                />
              </motion.li>
              <motion.li variants={childVariants}>
                <img
                  alt="WiT"
                  src="https://wit.pwr.edu.pl/thumb/oUg5KFBRVEAZtCSs0BwRePEMbBxc8HxcHEzcOUhwOCTkGGQolAw,190/pl/news/189/115/11/FABoNM1cPfU9nAkY,logo_wit_przezroczyste.png"
                  className="h-14 w-auto px-2 dark:brightness-0 dark:invert"
                />
              </motion.li>
              <motion.li variants={childVariants}>
                <img
                  alt="SeoHost"
                  src="https://cms.solvro.pl/assets/357529a6-a9b9-41eb-97dc-8be7ce994400"
                  className="h-8 w-32 px-2 dark:brightness-0 dark:invert"
                />
              </motion.li>
              <motion.li variants={childVariants}>
                <img
                  alt="Best"
                  src="https://cms.solvro.pl/assets/73d61c14-88e3-4d69-bf5b-51799e8d75f5"
                  className="h-14 w-auto px-2 dark:brightness-0 dark:invert"
                />
              </motion.li>
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
