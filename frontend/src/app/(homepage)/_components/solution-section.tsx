"use client";

/* eslint-disable @next/next/no-img-element */
import { motion, useAnimation, useInView } from "motion/react";
import React, { useEffect, useRef } from "react";

import {
  AnimatedGroupsDemo,
  AnimatedNotificationsDemo,
} from "@/components/animated-list-components";
import {
  AnimatedTitle,
  TitleHighlight,
  TitleText,
} from "@/components/animated-title";
import { Icons } from "@/components/icons";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { childVariants, parentVariants } from "@/constants";

const features = [
  {
    Icon: Icons.Workflow,
    name: "Automatyczne pobieranie zajęć",
    description:
      "Dzięki planerowi masz gwarancję aktualnych danych o zapisach.",
    className: "lg:col-span-1 lg:row-span-1",
    href: "/plans",
    cta: "Przejdź do planowania",
    background: (
      <AnimatedGroupsDemo className="absolute top-10 h-[240px] [--duration:40s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)]" />
    ),
  },
  {
    Icon: Icons.Share,
    name: "Udostępnij znajomym",
    description:
      "Po stworzeniu swojego arcydzieła, możesz je udostępnić znajomym.",
    className: "lg:col-span-1 lg:row-span-1",
    href: "/plans",
    cta: "Przejdź do planowania",
    background: (
      <img className="absolute -right-20 -top-20 opacity-60" alt="" />
    ),
  },
  {
    Icon: Icons.Bell,
    name: "Powiadomienia o zmianach",
    description: "Coś się zmieniło w planie? Dowiesz się o tym jako pierwszy.",
    className: "lg:col-span-1 lg:row-span-2",
    href: "/plans/account/notifications",
    cta: "Sprawdź ustawienia",
    background: (
      <AnimatedNotificationsDemo className="absolute right-2 top-4 h-[600px] w-full scale-75 border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-90" />
    ),
  },
  {
    Icon: Icons.Logo,
    name: "Od studentów dla studentów",
    description:
      "Razem z grupą znajomych KN Solvro stworzyliśmy planer dla Ciebie.",
    className: "lg:col-span-2 lg:row-span-1",
    href: "https://solvro.pwr.edu.pl/",
    cta: "Odwiedź stronę koła",
    background: (
      <img className="absolute -right-20 -top-20 opacity-60" alt="" />
    ),
  },
];

export function SolutionSection() {
  const ref = useRef(null);
  const isInview = useInView(ref, { once: true, amount: 0.4 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInview) {
      void controls.start("visible");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInview]);

  return (
    <section>
      <div className="bg-neutral-100 dark:bg-white/5">
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
              className="font-mono text-sm font-medium uppercase tracking-wider text-primary"
            >
              rozwiązanie
            </motion.h2>
            <AnimatedTitle>
              <TitleText>Ułóż swój </TitleText>
              <TitleHighlight>wymarzony plan</TitleHighlight>
              <TitleText> z planerem!</TitleText>
            </AnimatedTitle>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-6 text-slate-600">
              Wybierz swój wydział, kierunek i już. Możesz ułożyć swój plan
              widząc swoje wszystkie zajęcia na jednej stronie.
            </p>
          </div>

          <BentoGrid className="min-h-[750px] lg:grid-cols-3 lg:grid-rows-2">
            {features.map((feature) => (
              <BentoCard
                key={feature.name}
                {...feature}
                variants={childVariants}
              />
            ))}
          </BentoGrid>
        </motion.div>
      </div>
    </section>
  );
}
