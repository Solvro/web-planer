import { ArrowRight as ArrowRightIcon } from "lucide-react";
import type { MotionProps, Transition, Variants } from "motion/react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BentoGridProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof MotionProps
> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof MotionProps
> {
  name: string;
  className: string;
  background: ReactNode;
  Icon: React.ElementType;
  description: string;
  href: string;
  cta: string;
  variants?: Variants | undefined;
  transition?: Transition | undefined;
}

function BentoGrid({ children, className, ...props }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function BentoCard({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) {
  return (
    <motion.div
      key={name}
      className={cn(
        "group relative col-span-3 flex flex-col justify-end overflow-hidden rounded-2xl",
        "border-border/60 bg-card/70 border shadow-[0_1px_2px_rgba(0,0,0,.04),0_12px_32px_-16px_rgba(15,23,42,.18)] backdrop-blur-sm",
        "transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(0,0,0,.04),0_24px_48px_-20px_hsl(var(--primary)/.35)]",
        "dark:bg-card/50 dark:hover:border-primary/40 dark:shadow-none",
        className,
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 [background:radial-gradient(60%_50%_at_50%_0%,hsl(var(--primary)/.14),transparent_70%)] group-hover:opacity-100" />
      <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]">
        {background}
      </div>
      <div className="from-card via-card/85 pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t to-transparent" />

      <div className="pointer-events-none relative z-10 flex flex-col gap-1.5 p-6 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-9">
        <span className="bg-primary/10 text-primary ring-primary/15 mb-1 inline-flex size-10 items-center justify-center rounded-xl ring-1">
          <Icon className="size-5" />
        </span>
        <h3 className="text-foreground text-xl font-semibold tracking-tight">
          {name}
        </h3>
        <p className="text-muted-foreground max-w-lg text-sm text-balance">
          {description}
        </p>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex translate-y-8 items-center p-4 opacity-0 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
        <Button
          variant="ghost"
          nativeButton={false}
          size="sm"
          className="pointer-events-auto"
          render={
            <a href={href}>
              {cta}
              <ArrowRightIcon className="ms-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
            </a>
          }
        />
      </div>
    </motion.div>
  );
}

export { BentoCard, BentoGrid };
