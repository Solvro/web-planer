import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { Alerts } from "@/components/alerts";
import { AuroraBackground } from "@/components/homepage/aurora-background";
import { ParticleLogo } from "@/components/homepage/particle-logo";
import { Icons } from "@/components/icons";
import { BorderBeam } from "@/components/magicui/border-beam";
import { StructuredData } from "@/components/structured-data";
import { Button } from "@/components/ui/button";
import { getCachedAlerts } from "@/lib/get-cached-alerts";
import { getCachedSession } from "@/lib/get-session";

import HeroImageDark from "../../../public/assets/planer-dark.png";
import HeroImageLight from "../../../public/assets/planer-light.png";
import { GithubSection } from "./_components/github-section";
import { ProblemSection } from "./_components/problem-section";
import { SolutionSection } from "./_components/solution-section";
import { ToPWrSection } from "./_components/topwr-section";
import { TrustedSection } from "./_components/trusted-section";

async function JoinUsBlock() {
  const session = await getCachedSession();

  if (session == null) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 md:flex-row">
        <Button
          size="lg"
          className="animate-fade-up shadow-primary/30 rounded-full opacity-0 shadow-lg [--animation-delay:500ms]"
          nativeButton={false}
          render={
            <Link href="/login">
              <Icons.Lock className="size-4" />
              Zaloguj się do planera
            </Link>
          }
        />
        <Button
          size="lg"
          nativeButton={false}
          className="animate-fade-up bg-background/60 rounded-full opacity-0 backdrop-blur-sm [--animation-delay:600ms]"
          variant="outline"
          render={
            <Link href="/plans">
              <Icons.Plans className="size-4" />
              Kontynuuj bez logowania
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3">
      <Button
        size="lg"
        className="animate-fade-up shadow-primary/30 rounded-full opacity-0 shadow-lg [--animation-delay:500ms]"
        nativeButton={false}
        render={
          <Link href="/plans">
            <Icons.Plans className="size-4" />
            Przejdź do swoich planów
          </Link>
        }
      />
    </div>
  );
}

export default async function Home() {
  const alerts = await getCachedAlerts();

  return (
    <main className="mx-auto flex-1 overflow-hidden">
      <StructuredData />
      <section
        id="hero"
        className="relative mx-auto max-w-[80rem] px-2 text-center md:px-8"
      >
        <AuroraBackground className="-inset-x-[20vw] -top-24 h-[110vh]" />

        <div className="mt-[5.5rem] mb-2 min-h-4 text-start md:min-h-20">
          <Alerts
            variant="pill"
            className="animate-in fade-in slide-in-from-top"
            initialAlerts={alerts}
          />
        </div>

        <Link
          href="https://solvro.pwr.edu.pl/"
          aria-label="Koło Naukowe Solvro"
          className="animate-fade-in-2 mx-auto mt-4 block h-[200px] w-full max-w-[420px] opacity-0 [--animation-delay:200ms] md:h-[240px]"
        >
          <ParticleLogo />
        </Link>

        <h1 className="animate-fade-up mx-auto max-w-4xl text-5xl font-bold tracking-tight text-balance opacity-0 [--animation-delay:300ms] sm:text-6xl lg:text-7xl">
          <span className="text-shimmer">Planer</span> Solvro
        </h1>
        <p className="animate-fade-up text-muted-foreground mx-auto mt-4 max-w-2xl text-lg text-balance opacity-0 [--animation-delay:400ms] md:text-xl">
          Ułóż swój plan zajęć na PWr w kilka minut.{" "}
          <span className="text-foreground font-semibold">Za darmo</span>, bez
          kolizji i z aktualnymi danymi z USOS.
        </p>

        <div className="animate-fade-up mx-auto mt-6 mb-10 flex w-max max-w-full items-center gap-3 rounded-full border border-amber-400/40 bg-amber-100/70 px-4 py-2 opacity-0 backdrop-blur-sm [--animation-delay:450ms] dark:bg-amber-500/15">
          <div className="hidden size-6 shrink-0 items-center justify-center rounded-full bg-amber-500 md:flex">
            <Icons.Alert className="size-3 text-white" />
          </div>
          <p className="text-center text-sm font-medium text-amber-950 dark:text-amber-100">
            Planer tylko układa plan,
            <br className="block md:hidden" /> zapisy wykonujesz samodzielnie w
            USOS
          </p>
        </div>

        <Suspense fallback={<div className="h-11" />}>
          <JoinUsBlock />
        </Suspense>

        <div className="animate-fade-up relative mt-[6rem] opacity-0 [--animation-delay:600ms] perspective-[2000px] after:absolute after:inset-0 after:z-20 after:[background:linear-gradient(to_top,hsl(var(--background))_25%,transparent)]">
          <div className="before:animate-image-glow bg-card/40 rounded-2xl border border-white/10 backdrop-blur-sm before:absolute before:top-0 before:bottom-1/2 before:left-0 before:h-full before:w-full before:bg-[linear-gradient(to_bottom,hsl(var(--primary)),hsl(268_90%_66%),transparent_40%)] before:opacity-0 before:filter-[blur(180px)]">
            <BorderBeam colorFrom="hsl(var(--primary))" colorTo="#9c40ff" />
            <Image
              src={HeroImageDark}
              priority={true}
              quality={100}
              placeholder="blur"
              alt="Podgląd edytora planu"
              className="relative hidden h-full w-full rounded-[inherit] border object-contain dark:block"
            />
            <Image
              src={HeroImageLight}
              priority={true}
              quality={100}
              placeholder="blur"
              alt="Podgląd edytora planu"
              className="relative block h-full w-full rounded-[inherit] border object-contain dark:hidden"
            />
          </div>
        </div>
      </section>

      <TrustedSection />

      <div className="after:bg-background pointer-events-none relative z-[-2] mx-auto my-[-18.8rem] h-[50rem] overflow-hidden mask-[radial-gradient(ellipse_at_center_center,#000,transparent_50%)] [--color:hsl(var(--primary))] before:absolute before:inset-0 before:h-full before:w-full before:bg-[radial-gradient(circle_at_bottom_center,var(--color),transparent_70%)] before:opacity-40 after:absolute after:top-1/2 after:-left-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[50%] after:border-t after:border-[hsl(var(--border))]" />

      <ProblemSection />
      <SolutionSection />
      <Suspense>
        <GithubSection />
      </Suspense>
      <ToPWrSection />
    </main>
  );
}
