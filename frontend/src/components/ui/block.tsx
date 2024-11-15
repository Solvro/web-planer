"use client";

import { motion } from "framer-motion";
import type React from "react";
import { type ComponentProps } from "react";

import { cn } from "@/lib/utils";

export const Block = ({
  className,
  ...rest
}: ComponentProps<(typeof motion)["div"]> & { className: string }) => {
  return (
    <motion.div
      variants={{
        initial: {
          scale: 0.5,
          y: 50,
          opacity: 0,
        },
        animate: {
          scale: 1,
          y: 0,
          opacity: 1,
        },
      }}
      transition={{
        type: "spring",
        mass: 3,
        stiffness: 400,
        damping: 50,
      }}
      className={cn("col-span-4 rounded-lg p-6", className)}
      {...rest}
    />
  );
};
