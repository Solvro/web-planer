import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { Suspense } from "react";

import { Block } from "@/components/ui/block";
import { buttonVariants } from "@/components/ui/button";
import { createUsosService } from "@/lib/usos";
import { cn } from "@/lib/utils";

function AnimationLogo() {
  return (
    <Block
      whileHover={{
        rotate: "0.0deg",
        scale: 1.01,
      }}
      className="flex content-center items-center justify-center text-center align-middle md:mt-10"
    >
      <div className="items-center justify-center gap-4 sm:gap-6 md:flex">
        <div className="mb-5 md:mb-0 md:mt-5">
          <p className="text-4xl font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl">
            SOLVRO
          </p>
        </div>

        <a href="https://solvro.pwr.edu.pl/">
          <Image
            src="/assets/logo/logo_solvro_mono.png"
            alt="Logo Koła Naukowego Solvro w kolorze"
            width={200}
            height={200}
            className="animate-waving-hand cursor-pointer rounded-md pb-10 duration-5000"
            unoptimized
          />
        </a>

        <div className="mb:mt-5">
          <p className="text-4xl font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl">
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
      <Link
        href="/plans"
        data-umami-event="Landing - Go to planning"
        className={buttonVariants({
          size: "lg",
          variant: "outline",
          className: cn(
            "h-20 cursor-wait self-center border-4 text-xl transition-all duration-300 md:mt-0 md:p-7",
            "cursor-pointer hover:bg-white hover:shadow-[0_0_5px_rgb(200,200,255),0_0_10px_rgb(164,200,255)]",
          ),
        })}
      >
        Twoje plany
      </Link>
    );
  } catch {
    return (
      <div className="flex flex-col items-center gap-2 md:flex-row md:gap-6">
        <Link
          href="/api/login"
          data-umami-event="Landing - Go to login"
          prefetch={false}
          className={buttonVariants({
            size: "lg",
            variant: "outline",
            className: cn(
              "h-20 cursor-wait self-center border-4 text-xl transition-all duration-300 md:mt-0 md:p-7",
              "cursor-pointer hover:bg-white hover:shadow-[0_0_5px_rgb(200,200,255),0_0_10px_rgb(164,200,255)]",
            ),
          })}
        >
          Zaloguj się
        </Link>
        <p className="text-sm text-white">lub</p>
        <Link
          href="/plans"
          data-umami-event="Landing - Go to planning wihout login"
          className={buttonVariants({
            size: "lg",
            variant: "outline",
            className: cn(
              "h-20 cursor-wait self-center border-4 text-xl transition-all duration-300 md:mt-0 md:p-7",
              "cursor-pointer hover:bg-white hover:shadow-[0_0_5px_rgb(200,200,255),0_0_10px_rgb(164,200,255)]",
            ),
          })}
        >
          Kontynuuj bez logowania
        </Link>
      </div>
    );
  }
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <div className="flex justify-center">
        <div className="px-10">
          <AnimationLogo />
        </div>
      </div>
      <section className="flex justify-center">
        <Block className="flex flex-col items-center justify-center gap-6 md:gap-10">
          <div className="">
            <h1 className="text-center text-4xl font-medium leading-tight">
              <span className="font-inter tracking-wide text-white animate-in">
                Stwórz swój plan używając{" "}
                <span className="font-bold uppercase">darmowego</span>{" "}
                zapisownika!
              </span>
            </h1>
          </div>
          <div className="">
            <p className="text-balance text-center text-white md:mr-4 md:text-2xl">
              Zaloguj się do platformy USOS i stwórz swój plan na semestr!
            </p>
          </div>
          <div className="z-50">
            <Suspense
              fallback={
                <div className="flex h-20 animate-spin items-center justify-center text-xl text-white">
                  <Loader2Icon size={32} />
                </div>
              }
            >
              <JoinUsBlock />
            </Suspense>
          </div>
        </Block>
      </section>

      <section className="mt-20 flex items-center justify-center">
        <div className="w-full max-w-lg rounded-md border-2 border-[#F67548] bg-gradient-to-r from-[#f6764868] via-[#EB614368] to-[#DB2B1068] p-5">
          <div className="flex items-start gap-1 text-2xl font-bold text-white">
            <h1 className="inline">Słyszałeś już o </h1>
            <Image
              src={"/assets/logo/topwr_logo.svg"}
              alt={"ToPWR Logo"}
              className="inline"
              width={100}
              height={20}
            />
            <h1 className="inline">?</h1>
          </div>

          <p className="mt-2 text-white/90">
            Jeśli nie, to koniecznie pobierz apkę na swój telefon już teraz, aby
            być na bieżąco ze studenckim życiem Politechniki Wrocławskiej!
          </p>

          <div className="mt-4 flex items-center gap-2">
            <Link href="https://play.google.com/store/apps/details?id=com.solvro.topwr">
              <Image
                src={"/assets/google_play.png"}
                alt={"Download on google play"}
                width={300}
                height={50}
                className="w-[160px]"
              />
            </Link>
            <Link href="https://apps.apple.com/us/app/topwr/id1644647395">
              <Image
                src={"/assets/apple_store.png"}
                alt={"Download on google play"}
                width={300}
                height={50}
                className="w-[144px]"
              />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
