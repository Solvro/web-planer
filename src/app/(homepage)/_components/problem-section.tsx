"use client";

import { motion } from "motion/react";

import {
  AnimatedTitle,
  TitleHighlight,
  TitleText,
} from "@/components/animated-title";
import { Icons } from "@/components/icons";
import { childVariants, parentVariants } from "@/constants";

const PROBLEMS = [
  {
    Icon: Icons.Biohazard,
    title: "Ogólny bałagan",
    text: "USOS to nie jest najlepsze narzędzie do układania planów. Możesz się tam zapisać, czysto teoretycznie można też ułożyć plan, ale jest to droga przez mękę.",
  },
  {
    Icon: Icons.Plans,
    title: "Nakładające się zajęcia",
    text: "Bardzo dużo zajęć nakłada się na siebie. Łatwo się pomylić i zapisać na dwa kursy jednocześnie. Wtedy trzeba być miłym dla Pań z dziekanatu.",
  },
  {
    Icon: Icons.Timer,
    title: "Zapisy na sekundy",
    text: "Jeśli wcześniej nie przygotujesz sobie wymarzonego planu, podczas zapisów nie będzie na to czasu. Najlepsze grupy znikają w mgnieniu oka.",
  },
];

export function ProblemSection() {
  return (
    <motion.section
      variants={parentVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      transition={{ staggerChildren: 0.12 }}
    >
      <div className="relative container mx-auto max-w-7xl px-4 py-16">
        <div className="mx-auto space-y-4 pb-6 text-center">
          <motion.p
            variants={childVariants}
            className="text-primary font-mono text-sm font-medium tracking-wider uppercase"
          >
            problem
          </motion.p>
          <AnimatedTitle>
            <TitleText>Układanie planu zajęć to </TitleText>
            <TitleHighlight>nie lada wyzwanie</TitleHighlight>
            <TitleText>.</TitleText>
          </AnimatedTitle>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {PROBLEMS.map(({ Icon, title, text }) => (
            <motion.article
              key={title}
              variants={childVariants}
              transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.6 }}
              className="group border-border/60 bg-card/60 hover:border-primary/40 relative overflow-hidden rounded-2xl border p-6 backdrop-blur-sm transition-[transform,border-color] duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 [background:radial-gradient(70%_60%_at_20%_0%,hsl(var(--primary)/.14),transparent_70%)] group-hover:opacity-100" />
              <div className="relative space-y-4">
                <div className="bg-primary/10 text-primary ring-primary/15 flex size-12 items-center justify-center rounded-xl ring-1 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Icon className="size-6" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight">
                  {title}
                </h3>
                <p className="text-muted-foreground">{text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
