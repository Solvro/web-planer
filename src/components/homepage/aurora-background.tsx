import { cn } from "@/lib/utils";

export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <div className="aurora-field absolute -inset-[15%] mask-[linear-gradient(to_bottom,#000_55%,transparent)]" />
      <div className="absolute inset-0 [background-image:radial-gradient(hsl(var(--foreground))_0.6px,transparent_0.6px)] [background-size:22px_22px] opacity-[0.045] dark:opacity-[0.06]" />
    </div>
  );
}
