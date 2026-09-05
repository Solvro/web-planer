"use client";

import { motion } from "motion/react";
import Link from "next/link";

import {
  AnimatedTitle,
  TitleHighlight,
  TitleText,
} from "@/components/animated-title";
import { Icons } from "@/components/icons";
import { AvatarCircles } from "@/components/magicui/avatars";
import { Button } from "@/components/ui/button";
import { childVariants, parentVariants } from "@/constants";
import type { Contributor } from "@/types";

export function GithubItem({
  contributorsCount,
  contributors,
  stars,
}: {
  contributorsCount: number;
  contributors: Contributor[];
  stars: number;
}) {
  return (
    <motion.section
      variants={parentVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ staggerChildren: 0.1 }}
    >
      <div className="relative container mx-auto max-w-7xl px-4 py-16">
        <div className="mx-auto space-y-4 pb-6 text-center">
          <motion.p
            variants={childVariants}
            className="text-primary font-mono text-sm font-medium tracking-wider uppercase"
          >
            autorzy
          </motion.p>
          <AnimatedTitle>
            <TitleHighlight>{contributorsCount} developerów</TitleHighlight>
            <TitleText> tworzy ten projekt</TitleText>
          </AnimatedTitle>
        </div>
        <motion.div
          variants={childVariants}
          className="mt-2 flex flex-col items-center justify-center"
        >
          <AvatarCircles contributors={contributors} />
          <Icons.FlexyArrow className="text-muted-foreground mt-12" />
          <Button
            className="group bg-primary mt-4 rounded-full text-white ring-amber-500 ring-offset-2 transition-all hover:bg-blue-600 hover:ring-2 dark:bg-white dark:text-black dark:hover:bg-slate-200"
            size="lg"
            nativeButton={false}
            render={
              <Link href="https://github.com/Solvro/web-planer" target="_blank">
                <Icons.Github className="size-4" />
                Walnij nam gwiazdkę
                <Icons.StarFilledIcon className="text-slate-300 transition-all group-hover:scale-125 group-hover:text-amber-500 dark:text-slate-600" />
                {stars}
              </Link>
            }
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
