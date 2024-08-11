import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center gap-8">
      <span className="text-5xl">
        💸
        <span className="animate-gradient bg-[linear-gradient(to_left,theme(colors.sky.600),theme(colors.blue.200),theme(colors.sky.300),theme(colors.blue.400),theme(colors.sky.300),theme(colors.blue.300),theme(colors.sky.400))] bg-[length:200%_auto] bg-clip-text text-5xl font-extrabold text-transparent">
          DARMOWY Zapisownik PWr
        </span>
        💸
      </span>

      <a
        href="/api/login"
        className={buttonVariants({
          size: "lg",
          class: "text-md transition-all hover:shadow-lg",
        })}
      >
        Zaloguj się z USOSem
      </a>
    </div>
  );
}
