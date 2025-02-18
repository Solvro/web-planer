import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { Icons } from "@/components/icons";
import { AnimatedGradientText } from "@/components/magicui/animated-text";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Particles } from "@/components/magicui/particles";
import { Block } from "@/components/ui/block";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";

import HeroImageDark from "../../../public/assets/planer-dark.png";
import HeroImageLight from "../../../public/assets/planer-light.png";
import { GithubSection } from "./_components/github-section";
import { ProblemSection } from "./_components/problem-section";
import { SolutionSection } from "./_components/solution-section";
import { ToPWrSection } from "./_components/topwr-section";
import { TrustedSection } from "./_components/trusted-section";

function AnimationLogo() {
  return (
    <Block
      whileHover={{
        rotate: "0.0deg",
        scale: 1.01,
      }}
      className="flex animate-fade-in-2 content-center items-center justify-center text-center align-middle opacity-0 [--animation-delay:200ms] md:mt-10"
    >
      <div className="items-center justify-center gap-4 sm:gap-6 md:flex">
        <h1 className="mb-5 text-6xl font-bold text-blue-900 dark:text-white sm:text-5xl lg:text-7xl">
          SOLVRO
        </h1>

        <Link
          href="https://solvro.pwr.edu.pl/"
          className="flex items-center justify-center"
        >
          <Image
            src="/assets/logo/logo_solvro_color.png"
            alt="Logo Koła Naukowego Solvro w kolorze"
            width={200}
            height={200}
            className="animate-waving-hand cursor-pointer rounded-md pb-10 duration-5000"
            unoptimized
          />
        </Link>

        <h1 className="mb-5 text-6xl font-bold text-blue-900 dark:text-white sm:text-5xl lg:text-7xl">
          PLANER
        </h1>
      </div>
    </Block>
  );
}

async function JoinUsBlock() {
  const user = await auth({ type: "adonis", noThrow: true });

  if (user === null) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 md:flex-row">
        <Button
          className="animate-fade-in-2 opacity-0 [--animation-delay:500ms]"
          asChild={true}
        >
          <Link href="/login">
            <Icons.Lock className="size-4" />
            Zaloguj się do planera
          </Link>
        </Button>

        <Button
          asChild={true}
          className="animate-fade-in-2 opacity-0 [--animation-delay:600ms]"
          variant="outline"
        >
          <Link href="/plans">
            <Icons.Plans className="size-4" />
            Kontynuuj bez logowania
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3">
      <Button
        className="animate-fade-in-2 opacity-0 [--animation-delay:500ms]"
        asChild={true}
      >
        <Link href="/plans">
          <Icons.Plans className="size-4" />
          Przejdź do swoich planów
        </Link>
      </Button>
    </div>
  );
}

export default function Home() {
  return (
    <main className="mx-auto flex-1 overflow-hidden">
      <section
        id="hero"
        className="relative mx-auto mt-28 max-w-[80rem] px-2 text-center md:mt-44 md:px-8"
      >
        <div className="z-10 flex animate-fade-in-2 items-center justify-center opacity-0 [--animation-delay:1000ms]">
          <Link href="#topwr">
            <AnimatedGradientText>
              <Image
                src={"/assets/logo/topwr_logo.svg"}
                alt={"ToPWR Logo"}
                className="inline"
                width={60}
                height={10}
              />{" "}
              <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />{" "}
              <span
                className={cn(
                  `inline animate-gradient text-balance bg-gradient-to-r from-[#ffd5a2] via-[#cea1ff] to-[#ffd5a2] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent dark:from-[#ffaa40] dark:via-[#9c40ff] dark:to-[#ffaa40]`,
                )}
              >
                Obowiązkowa apka dla każdego studenta!
              </span>
            </AnimatedGradientText>
          </Link>
        </div>
        <AnimationLogo />
        <p className="mb-2 translate-y-[-1rem] animate-fade-in-2 text-balance text-lg tracking-tight text-muted-foreground opacity-0 [--animation-delay:400ms] md:text-xl">
          Stwórz swój plan używając{" "}
          <span className="font-bold uppercase">darmowego</span> planera!
        </p>
        <div className="mx-auto mb-12 flex w-max animate-fade-in-2 items-center gap-3 rounded-md border-2 border-amber-400 bg-amber-100 p-2 opacity-0 [--animation-delay:400ms] dark:bg-amber-500/40">
          <div className="hidden size-6 items-center justify-center rounded-sm bg-amber-500 md:flex">
            <Icons.Alert className="size-3 text-white" />
          </div>
          <h3 className="text-center text-sm font-medium text-amber-950 dark:text-white">
            Planer jest narzędziem tylko układającym plany,
            <br className="block md:hidden" /> zapisy należy wykonać
            własnoręcznie w USOS
          </h3>
        </div>
        <Suspense
          fallback={
            <div className="flex h-20 animate-spin items-center justify-center text-xl text-white">
              <Icons.Loader size={32} />
            </div>
          }
        >
          <JoinUsBlock />
        </Suspense>

        <div className="relative mt-[8rem] animate-fade-up opacity-0 [--animation-delay:400ms] [perspective:2000px] after:absolute after:inset-0 after:z-20 after:[background:linear-gradient(to_top,hsl(var(--background))_30%,transparent)]">
          <div className="rounded-xl border border-white/10 bg-white bg-opacity-[0.01] before:absolute before:bottom-1/2 before:left-0 before:top-0 before:h-full before:w-full before:animate-image-glow before:opacity-0 before:[background-image:linear-gradient(to_bottom,hsl(var(--primary)),hsl(var(--primary)),transparent_40%)] before:[filter:blur(180px)]">
            <BorderBeam colorFrom="hsl(var(--primary))" />
            <Image
              src={HeroImageDark}
              alt="Hero Image"
              className="relative hidden h-full w-full rounded-[inherit] border object-contain dark:block"
            />
            <Image
              src={HeroImageLight}
              alt="Hero Image"
              className="relative block h-full w-full rounded-[inherit] border object-contain dark:hidden"
            />
          </div>
        </div>
        <Particles
          className="absolute inset-0 -z-10 animate-fade-up opacity-0 [--animation-delay:400ms]"
          quantity={80}
          ease={40}
          color={"#2f81f5"}
          refresh
        />
      </section>

      <TrustedSection />
      <div className="pointer-events-none relative -z-[2] mx-auto my-[-18.8rem] h-[50rem] overflow-hidden [--color:hsl(var(--primary))] [mask-image:radial-gradient(ellipse_at_center_center,#000,transparent_50%)] before:absolute before:inset-0 before:h-full before:w-full before:opacity-40 before:[background-image:radial-gradient(circle_at_bottom_center,var(--color),transparent_70%)] after:absolute after:-left-1/2 after:top-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[50%] after:border-t after:border-[hsl(var(--border))] after:bg-background"></div>

      <ProblemSection />

      <SolutionSection />

      <Suspense>
        <GithubSection />
      </Suspense>

      <ToPWrSection />
    </main>
  );
}
