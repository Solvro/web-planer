import { ArrowRight as ArrowRightIcon } from "lucide-react";
import type { MotionProps, Transition, Variants } from "motion/react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

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
  /** Illustration rendered inside the inset panel at the top of the card. */
  background: ReactNode;
  description: ReactNode;
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
  description,
  href,
  cta,
  ...props
}: BentoCardProps) {
  return (
    <motion.div
      key={name}
      className={cn(
        "group border-border/70 bg-card/60 relative col-span-3 flex flex-col overflow-hidden rounded-2xl border p-3 backdrop-blur-sm",
        "hover:border-primary/40 transition-[border-color,box-shadow] duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:shadow-[0_20px_50px_-30px_hsl(var(--primary)/.5)]",
        className,
      )}
      {...props}
    >
      <a
        href={href}
        aria-label={`${name} – ${cta}`}
        className="focus-visible:ring-primary/60 absolute inset-0 z-20 rounded-2xl focus-visible:ring-2 focus-visible:outline-none"
      />
      <div className="border-border/60 bg-background/70 relative min-h-0 flex-1 overflow-hidden rounded-xl border shadow-[inset_0_1px_0_hsl(var(--foreground)/.04)] dark:bg-black/30">
        <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.02]">
          {background}
        </div>
      </div>
      <div className="flex flex-col gap-1.5 px-3 pt-4 pb-2">
        <h3 className="text-foreground text-lg font-semibold tracking-tight">
          {name}
        </h3>
        <p className="text-muted-foreground text-sm text-balance">
          {description}
        </p>
        <span className="text-primary mt-1 inline-flex items-center gap-1 text-sm font-medium opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-x-0.5 group-hover:opacity-100">
          {cta}
          <ArrowRightIcon className="size-4" />
        </span>
      </div>
    </motion.div>
  );
}

/** Inline keycap-like chip used in bento descriptions. */
function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="bg-muted text-foreground/80 border-border/70 rounded-md border px-1.5 py-0.5 font-mono text-[11px] font-medium shadow-[inset_0_-1px_0_hsl(var(--foreground)/.08)]">
      {children}
    </kbd>
  );
}

export { BentoCard, BentoGrid, Kbd };
