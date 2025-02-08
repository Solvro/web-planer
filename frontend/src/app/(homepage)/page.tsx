/* eslint-disable @next/next/no-img-element */
import { InputIcon } from "@radix-ui/react-icons";
import { BellIcon, CalendarIcon, FileTextIcon, GlobeIcon } from "lucide-react";
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
import { createUsosService } from "@/lib/usos";
import { cn } from "@/lib/utils";

import HeroImageDark from "../../../public/assets/planer-dark.png";
import HeroImageLight from "../../../public/assets/planer-light.png";

const features = [
  {
    Icon: FileTextIcon,
    name: "Save your files",
    description: "We automatically save your files as you type.",
    href: "/",
    cta: "Learn more",
    background: (
      <img className="absolute -right-20 -top-20 opacity-60" alt="" />
    ),
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: InputIcon,
    name: "Full text search",
    description: "Search through all your files in one place.",
    href: "/",
    cta: "Learn more",
    background: (
      <img className="absolute -right-20 -top-20 opacity-60" alt="" />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: GlobeIcon,
    name: "Multilingual",
    description: "Supports 100+ languages and counting.",
    href: "/",
    cta: "Learn more",
    background: (
      <img className="absolute -right-20 -top-20 opacity-60" alt="" />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: CalendarIcon,
    name: "Calendar",
    description: "Use the calendar to filter your files by date.",
    href: "/",
    cta: "Learn more",
    background: (
      <img className="absolute -right-20 -top-20 opacity-60" alt="" />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: BellIcon,
    name: "Notifications",
    description:
      "Get notified when someone shares a file or mentions you in a comment.",
    href: "/",
    cta: "Learn more",
    background: (
      <img className="absolute -right-20 -top-20 opacity-60" alt="" />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
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
        <div className="mb-5 md:mb-0 md:mt-5">
          <p className="text-4xl font-bold text-blue-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
            SOLVRO
          </p>
        </div>

        <a href="https://solvro.pwr.edu.pl/">
          <Image
            src="/assets/logo/logo_solvro_color.png"
            alt="Logo Koła Naukowego Solvro w kolorze"
            width={200}
            height={200}
            className="animate-waving-hand cursor-pointer rounded-md pb-10 duration-5000"
            unoptimized
          />
        </a>

        <div className="mb:mt-5">
          <p className="text-4xl font-bold text-blue-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
            PLANER
          </p>
        </div>
      </div>
    </Block>
  );
}

const JoinUsBlock = async () => {
  try {
    const usos = await createUsosService();
    await usos.getProfile();

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
      <div className="flex items-center justify-center gap-3">
        <Button
          className="animate-fade-in-2 opacity-0 [--animation-delay:500ms]"
          asChild={true}
        >
          <Link href="/api/login">
            <Icons.Lock className="size-4" />
            Zaloguj się z USOS
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
      {/* <Button>Click me</Button>
            <ModeToggle /> */}
      <section
        id="hero"
        className="relative mx-auto mt-56 max-w-[80rem] px-6 text-center md:px-8"
      >
        <div className="z-10 flex animate-fade-in-2 items-center justify-center opacity-0 [--animation-delay:1000ms]">
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
                `inline animate-gradient bg-gradient-to-r from-[#ffd5a2] via-[#cea1ff] to-[#ffd5a2] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent dark:from-[#ffaa40] dark:via-[#9c40ff] dark:to-[#ffaa40]`,
              )}
            >
              Obowiązkowa apka dla każdego studenta!
            </span>
          </AnimatedGradientText>
        </div>
        <AnimationLogo />
        <p className="mb-2 translate-y-[-1rem] animate-fade-in-2 text-balance text-lg tracking-tight text-muted-foreground opacity-0 [--animation-delay:400ms] md:text-xl">
          Stwórz swój plan używając{" "}
          <span className="font-bold uppercase">darmowego</span> planera!
        </p>
        <div className="mx-auto mb-12 flex w-max animate-fade-in-2 items-center gap-3 rounded-md border-2 border-amber-400 bg-amber-100 p-2 opacity-0 [--animation-delay:400ms] dark:bg-amber-500/40">
          <div className="flex size-6 items-center justify-center rounded-sm bg-amber-500">
            <Icons.Alert className="size-3 text-white" />
          </div>
          <h3 className="text-center text-sm font-medium text-amber-950 dark:text-white">
            Planer jest narzędziem tylko układającym plany, zapisy należy
            wykonać własnoręcznie w USOS
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
      </section>
      <section
        id="clients"
        className="mx-auto max-w-[80rem] px-6 text-center md:px-8"
      >
        <div className="py-14">
          <div className="mx-auto max-w-screen-xl px-4 md:px-8">
            <h2 className="text-center text-sm font-semibold text-gray-600">
              TRUSTED BY MANY USERS AND ORGANIZATIONS
            </h2>
            <div className="mt-6">
              <ul className="[&amp;_path]:fill-white flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-16">
                <li>
                  <img
                    alt="PWr"
                    src="https://makroklaster.pl/wp-content/uploads/2022/04/logo-pwr.png"
                    className="w-34 h-8 px-2 dark:brightness-100 dark:invert"
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
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Veritatis, rem quibusdam dolores neque voluptatem ut illo
                  dolorum quae aliquid vitae.
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
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Veritatis, rem quibusdam dolores neque voluptatem ut illo
                  dolorum quae aliquid vitae.
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
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Veritatis, rem quibusdam dolores neque voluptatem ut illo
                  dolorum quae aliquid vitae.
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
                Ułóż swój wymażony plan z planerem!
              </h3>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Veritatis, rem quibusdam dolores neque voluptatem ut illo
                dolorum quae aliquid vitae.
              </p>
            </div>

            <BentoGrid className="lg:grid-rows-3">
              {features.map((feature) => (
                <BentoCard key={feature.name} {...feature} />
              ))}
            </BentoGrid>
          </div>
        </div>
      </section>

      <Particles
        className="absolute inset-0 -z-10 animate-fade-up opacity-0 [--animation-delay:400ms]"
        quantity={80}
        ease={40}
        color={"#2f81f5"}
        refresh
      />
    </main>
  );
}
