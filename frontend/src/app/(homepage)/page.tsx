/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { Icons } from "@/components/icons";
import { AnimatedGradientText } from "@/components/magicui/animated-text";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Particles } from "@/components/magicui/particles";
import { Block } from "@/components/ui/block";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";

import PWrLogoColor from "../../../public/assets/logo/pwr_color.png";
import PWrLogoMono from "../../../public/assets/logo/pwr_mono.png";
import HeroImageDark from "../../../public/assets/planer-dark.png";
import HeroImageLight from "../../../public/assets/planer-light.png";
import { GithubRepo } from "./_components/github-repo";
import { ToPWrAd } from "./_components/topwr-ad";

const features = [
  {
    Icon: Icons.Workflow,
    name: "Automatyczne pobieranie zajęć",
    description:
      "Dzięki planerowi masz gwarancję aktualnych danych o zapisach.",
    className: "lg:col-span-1 lg:row-span-1",
    href: "/plans",
    cta: "Przejdź do planowania",
    background: (
      <img className="absolute -right-20 -top-20 opacity-60" alt="" />
    ),
  },
  {
    Icon: Icons.Share,
    name: "Udostępnij znajomym",
    description:
      "Po stworzeniu swojego arcydzieła, możesz je udostępnić znajomym.",
    className: "lg:col-span-1 lg:row-span-1",
    href: "/plans",
    cta: "Przejdź do planowania",
    background: (
      <img className="absolute -right-20 -top-20 opacity-60" alt="" />
    ),
  },
  {
    Icon: Icons.Bell,
    name: "Powiadomienia o zmianach",
    description: "Coś się zmieniło w planie? Dowiesz się o tym jako pierwszy.",
    className: "lg:col-span-1 lg:row-span-2",
    href: "/plans/account/notifications",
    cta: "Sprawdź ustawienia",
    background: (
      <img className="absolute -right-20 -top-20 opacity-60" alt="" />
    ),
  },
  {
    Icon: Icons.Logo,
    name: "Od studentów dla studentów",
    description:
      "Razem z grupą znajomych KN Solvro stworzyliśmy planer dla Ciebie.",
    className: "lg:col-span-2 lg:row-span-1",
    href: "/plans",
    cta: "Przejdź do planowania",
    background: (
      <img className="absolute -right-20 -top-20 opacity-60" alt="" />
    ),
  },
];

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

const JoinUsBlock = async () => {
  try {
    await auth({ type: "adonis" });

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
  } catch {
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
          variant={"outline"}
        >
          <Link href="/plans">
            <Icons.Plans className="size-4" />
            Kontynuuj bez logowania
          </Link>
        </Button>
      </div>
    );
  }
};

export default function Home() {
  return (
    <main className="mx-auto flex-1 overflow-hidden">
      <section
        id="hero"
        className="relative mx-auto mt-28 max-w-[80rem] px-2 text-center md:mt-40 md:px-8 lg:mt-56"
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
      <section
        id="clients"
        className="mx-auto max-w-[80rem] px-6 text-center md:px-8"
      >
        <div className="py-14">
          <div className="mx-auto max-w-screen-xl px-4 md:px-8">
            <h2 className="text-center text-sm font-semibold text-gray-600">
              ZAUFANY PRZEZ WIELU STUDENTÓW I PARTNERÓW
            </h2>
            <div className="mt-6">
              <ul className="[&amp;_path]:fill-white flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-16">
                <li>
                  <img
                    alt="PWr"
                    src={PWrLogoMono.src}
                    className="hidden h-8 w-40 px-2 dark:block dark:brightness-0 dark:invert"
                  />
                  <img
                    alt="PWr"
                    src={PWrLogoColor.src}
                    className="block h-8 w-40 px-2 dark:hidden"
                  />
                </li>
                <li>
                  <img
                    alt="Solvro"
                    src="/assets/logo/solvro_black.png"
                    className="w-34 h-8 px-2 dark:brightness-0 dark:invert"
                  />
                </li>
                <li>
                  <img
                    alt="WiT"
                    src="https://wit.pwr.edu.pl/thumb/oUg5KFBRVEAZtCSs0BwRePEMbBxc8HxcHEzcOUhwOCTkGGQolAw,190/pl/news/189/115/11/FABoNM1cPfU9nAkY,logo_wit_przezroczyste.png"
                    className="h-14 w-auto px-2 dark:brightness-0 dark:invert"
                  />
                </li>
                <li>
                  <img
                    alt="SeoHost"
                    src="https://cms.solvro.pl/assets/357529a6-a9b9-41eb-97dc-8be7ce994400"
                    className="h-8 w-32 px-2 dark:brightness-0 dark:invert"
                  />
                </li>
                <li>
                  <img
                    alt="Best"
                    src="https://cms.solvro.pl/assets/73d61c14-88e3-4d69-bf5b-51799e8d75f5"
                    className="h-14 w-auto px-2 dark:brightness-0 dark:invert"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <div className="pointer-events-none relative -z-[2] mx-auto my-[-18.8rem] h-[50rem] overflow-hidden [--color:hsl(var(--primary))] [mask-image:radial-gradient(ellipse_at_center_center,#000,transparent_50%)] before:absolute before:inset-0 before:h-full before:w-full before:opacity-40 before:[background-image:radial-gradient(circle_at_bottom_center,var(--color),transparent_70%)] after:absolute after:-left-1/2 after:top-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[50%] after:border-t after:border-[hsl(var(--border))] after:bg-background"></div>

      <section>
        <div className="container relative mx-auto max-w-7xl px-4 py-16">
          <div className="mx-auto space-y-4 pb-6 text-center">
            <h2 className="font-mono text-sm font-medium uppercase tracking-wider text-primary">
              problem
            </h2>
            <h3 className="mx-auto mt-4 max-w-xs text-3xl font-semibold sm:max-w-none sm:text-4xl md:text-5xl">
              Układanie planu zajęć to nie lada wyzwanie.
            </h3>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-none bg-background text-card-foreground shadow-none">
              <div className="space-y-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Icons.Biohazard className="size-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Ogólny bałagan</h3>
                <p className="text-muted-foreground">
                  USOS to nie jest najlepsze narzędzie do układania planów.
                  Możesz się tam zapisać, czysto teoretycznie można też ułożyć
                  plan ale jest to droga przez mękę.
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-none bg-background text-card-foreground shadow-none">
              <div className="space-y-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Icons.Plans className="size-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">
                  Nakładające się zajęcia
                </h3>
                <p className="text-muted-foreground">
                  Bardzo dużo zajęć nakłada się na siebie. Przez to bardzo łatwo
                  się pomylić i zapisać na jakieś zajęca jednocześnie. Wtedy
                  trzeba być miłym dla Pań z dziekanatu.
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-none bg-background text-card-foreground shadow-none">
              <div className="space-y-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Icons.Timer className="size-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Zapisy na sekundy</h3>
                <p className="text-muted-foreground">
                  Jeśli wcześniej nie przygotujesz sobie swojego wymarzonego
                  planu, podczas zapisów nie będzie na to czasu. Najbardziej
                  atrakcyjne zajęcia znikają w mgnieniu oka.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="bg-neutral-100 dark:bg-white/5">
          <div className="container relative mx-auto max-w-7xl px-4 py-16">
            <div className="mx-auto space-y-4 pb-6 text-center">
              <h2 className="font-mono text-sm font-medium uppercase tracking-wider text-primary">
                rozwiązanie
              </h2>
              <h3 className="mx-auto mt-4 max-w-xs text-3xl font-semibold sm:max-w-none sm:text-4xl md:text-5xl">
                Ułóż swój wymarzony plan z planerem!
              </h3>
              <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-6 text-slate-600">
                Wybierz swój wydział, kierunek i już. Możesz ułożyć swój plan
                widząc swoje wszystkie zajęcia na jednej stronie.
              </p>
            </div>

            <BentoGrid className="min-h-[750px] lg:grid-cols-3 lg:grid-rows-2">
              {features.map((feature) => (
                <BentoCard key={feature.name} {...feature} />
              ))}
            </BentoGrid>
          </div>
        </div>
      </section>

      <section>
        <div className="container relative mx-auto max-w-7xl px-4 py-16">
          <Suspense>
            <GithubRepo />
          </Suspense>
        </div>
      </section>

      <ToPWrAd />
    </main>
  );
}
