"use client";

import { motion, useAnimation, useInView } from "motion/react";
import Link from "next/link";
import React, { useEffect, useRef } from "react";

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
            autorzy
          </motion.h2>
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
          <Icons.FlexyArrow className="mt-12" />
          <Button
            className="group mt-4 bg-primary text-white ring-amber-500 ring-offset-2 transition-all hover:bg-blue-600 hover:ring-2 dark:bg-white dark:text-black dark:hover:bg-slate-200"
            size="lg"
            asChild
          >
            <Link href="https://github.com/Solvro/web-planer" target="_blank">
              <Icons.Github className="size-4" />
              Walnij nam gwiazdkę
              <Icons.StarFilledIcon className="text-slate-300 transition-all group-hover:text-amber-500 dark:text-slate-600" />
              {stars}
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}
