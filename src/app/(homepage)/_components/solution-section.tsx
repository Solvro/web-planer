"use client";

import { motion } from "motion/react";

import {
  AnimatedTitle,
  TitleHighlight,
  TitleText,
} from "@/components/animated-title";
import {
  CollisionsArt,
  ScheduleSyncArt,
  ShareArt,
  StudentsArt,
} from "@/components/homepage/bento-illustrations";
import { BentoCard, BentoGrid, Kbd } from "@/components/magicui/bento-grid";
import { childVariants, parentVariants } from "@/constants";

const features = [
  {
    name: "Automatyczne pobieranie zajęć",
    description: (
      <>
        Grupy, godziny i wolne miejsca prosto z <Kbd>USOS</Kbd>. Zawsze
        aktualne, bez przepisywania.
      </>
    ),
    className: "lg:col-span-1 lg:row-span-1",
    href: "/plans",
    cta: "Przejdź do planowania",
    background: <ScheduleSyncArt className="p-2" />,
  },
  {
    name: "Udostępnij znajomym",
    description: (
      <>
        Wyślij link, pobierz <Kbd>.png</Kbd> albo wrzuć <Kbd>.ics</Kbd> do
        kalendarza.
      </>
    ),
    className: "lg:col-span-1 lg:row-span-1",
    href: "/plans",
    cta: "Przejdź do planowania",
    background: <ShareArt className="p-2" />,
  },
  {
    name: "Kolizje i wolne miejsca",
    description:
      "Nakładające się zajęcia i pełne grupy widzisz od razu, zanim klikniesz zapisz w USOS.",
    className: "lg:col-span-1 lg:row-span-2",
    href: "/plans",
    cta: "Sprawdź swój plan",
    background: <CollisionsArt className="p-3" />,
  },
  {
    name: "Od studentów dla studentów",
    description: (
      <>
        Razem z grupą znajomych z KN Solvro stworzyliśmy planer dla Ciebie. Kod
        jest otwarty na <Kbd>GitHub</Kbd>.
      </>
    ),
    className: "lg:col-span-2 lg:row-span-1",
    href: "https://solvro.pwr.edu.pl/",
    cta: "Odwiedź stronę koła",
    background: <StudentsArt className="p-2" />,
  },
];

export function SolutionSection() {
  return (
    <section className="relative">
      <div className="bg-muted/40 dark:bg-white/[0.03]">
        <motion.div
          className="relative container mx-auto max-w-7xl px-4 py-16"
          variants={parentVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <div className="mx-auto space-y-4 pb-6 text-center">
            <motion.p
              variants={childVariants}
              className="text-primary font-mono text-sm font-medium tracking-wider uppercase"
            >
              rozwiązanie
            </motion.p>
            <AnimatedTitle>
              <TitleText>Ułóż swój </TitleText>
              <TitleHighlight>wymarzony plan</TitleHighlight>
              <TitleText> z planerem!</TitleText>
            </AnimatedTitle>
            <motion.p
              variants={childVariants}
              className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-6 text-balance"
            >
              Wybierz swój wydział, rejestrację i już. Wszystkie zajęcia na
              jednej stronie, w widoku tygodnia, dnia albo listy.
            </motion.p>
          </div>

          <BentoGrid className="min-h-[750px] lg:grid-cols-3 lg:grid-rows-2">
            {features.map((feature) => (
              <BentoCard
                key={feature.name}
                {...feature}
                variants={childVariants}
                transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.6 }}
              />
            ))}
          </BentoGrid>
        </motion.div>
      </div>
    </section>
  );
}
