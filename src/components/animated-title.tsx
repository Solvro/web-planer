"use client";

import { motion } from "motion/react";
import React from "react";

import { childVariants } from "@/constants";

export function AnimatedTitle({ children }: { children: React.ReactNode }) {
  return (
    <motion.h1
      whileHover={{ scale: 1.05 }}
      variants={childVariants}
      className="group relative z-10 mx-auto mt-4 max-w-xs transform-gpu text-3xl font-semibold transition-all sm:max-w-none sm:text-4xl md:text-5xl"
    >
      {children}
    </motion.h1>
  );
}

export function TitleHighlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative whitespace-nowrap text-white">
      <span className="absolute -left-[5%] -top-[2.5%] z-0 h-[110%] w-[110%] -rotate-1 transform-gpu bg-blue-400/20 transition-all group-hover:-rotate-0 dark:bg-blue-200/10"></span>
      <span className="relative z-10 text-blue-600 dark:text-blue-400">
        {children}
      </span>
    </span>
  );
}

export function TitleText({ children }: { children: React.ReactNode }) {
  return <span className="relative z-10">{children}</span>;
}
