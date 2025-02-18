"use client";

import { motion, useAnimation, useInView } from "motion/react";
import React, { useEffect, useRef } from "react";

import { Icons } from "@/components/icons";
import { childVariants, parentVariants } from "@/constants";

export function ProblemSection() {
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
      variants={parentVariants}
      ref={ref}
      initial="hidden"
      animate={controls}
      transition={{ staggerChildren: 0.1 }}
    >
      <div className="container relative mx-auto max-w-7xl px-4 py-16">
        <div className="mx-auto space-y-4 pb-6 text-center">
          <motion.h2
            variants={childVariants}
            className="font-mono text-sm font-medium uppercase tracking-wider text-primary"
          >
            problem
          </motion.h2>
          <motion.h3
            variants={childVariants}
            className="mx-auto mt-4 max-w-xs text-3xl font-semibold sm:max-w-none sm:text-4xl md:text-5xl"
          >
            Układanie planu zajęć to nie lada wyzwanie.
          </motion.h3>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          <motion.div
            transition={{
              ease: [0.1, 0.25, 0.3, 1],
              duration: 0.4,
            }}
            variants={childVariants}
            className="rounded-lg border border-none bg-background text-card-foreground shadow-none"
          >
            <div className="space-y-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Icons.Biohazard className="size-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">Ogólny bałagan</h3>
              <p className="text-muted-foreground">
                USOS to nie jest najlepsze narzędzie do układania planów. Możesz
                się tam zapisać, czysto teoretycznie można też ułożyć plan ale
                jest to droga przez mękę.
              </p>
            </div>
          </motion.div>
          <motion.div
            transition={{
              ease: [0.1, 0.25, 0.3, 1],
              duration: 0.4,
            }}
            variants={childVariants}
            className="rounded-lg border border-none bg-background text-card-foreground shadow-none"
          >
            <div className="space-y-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Icons.Plans className="size-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">Nakładające się zajęcia</h3>
              <p className="text-muted-foreground">
                Bardzo dużo zajęć nakłada się na siebie. Przez to bardzo łatwo
                się pomylić i zapisać na jakieś zajęca jednocześnie. Wtedy
                trzeba być miłym dla Pań z dziekanatu.
              </p>
            </div>
          </motion.div>
          <motion.div
            transition={{
              ease: [0.1, 0.25, 0.3, 1],
              duration: 0.4,
            }}
            variants={childVariants}
            className="rounded-lg border border-none bg-background text-card-foreground shadow-none"
          >
            <div className="space-y-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Icons.Timer className="size-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">Zapisy na sekundy</h3>
              <p className="text-muted-foreground">
                Jeśli wcześniej nie przygotujesz sobie swojego wymarzonego
                planu, podczas zapisów nie będzie na to czasu. Najbardziej
                atrakcyjne zajęcia znikają w mgnieniu oka.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
