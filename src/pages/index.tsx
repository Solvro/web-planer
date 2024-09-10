import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
// import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { type ComponentProps, useState } from "react";
import { twMerge } from "tailwind-merge";

import { Seo } from "@/components/SEO";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <div className="relative z-50 flex h-20 items-center justify-between">
      <Logo />

      {/* Desktop Navigation */}
      <nav className="hidden h-20 flex-row items-center gap-10 pr-10 text-white md:flex lg:pr-40">
        <ul className="flex gap-6">
          <li className="cursor-pointer">
            <a href="https://www.facebook.com/knsolvro">Aktualności</a>
          </li>

          <li className="cursor-pointer">
            <a
              target="_blank"
              href="https://web.usos.pwr.edu.pl/kontroler.php?_action=news/default&panel=DOMYSLNY&file=zapisyPL.html"
              rel="noreferrer"
            >
              Terminarz USOS
            </a>
          </li>
          <li className="cursor-pointer">
            <a href="https://solvro.pwr.edu.pl/contact/">Kontakt</a>
          </li>
          <li className="cursor-pointer">
            <a href="https://forms.gle/4tBCPkLMFKptB1iZ7">Zgłoś błąd</a>
          </li>
        </ul>
      </nav>

      {/* Mobile Menu Icon */}
      <div className="flex items-center md:hidden">
        <button onClick={toggleMenu} className="text-white focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen ? (
        <div className="absolute left-0 top-full w-full animate-fade-in bg-mainbutton6 shadow-lg md:hidden">
          <ul className="flex flex-col gap-4 p-4 text-center uppercase text-white">
            <li className="cursor-pointer p-2">
              <a href="https://www.facebook.com/knsolvro">Aktualności</a>
            </li>
            <li className="cursor-pointer p-2">
              <a href="https://web.usos.pwr.edu.pl/kontroler.php?_action=news/default&panel=DOMYSLNY&file=instrukcjePL.html">
                Instrukcje
              </a>
            </li>
            <li className="cursor-pointer p-2">
              <a href="https://web.usos.pwr.edu.pl/kontroler.php?_action=news/default&panel=DOMYSLNY&file=zapisyPL.html">
                Terminarz
              </a>
            </li>
            <li className="cursor-pointer p-2">
              <a href="https://solvro.pwr.edu.pl/contact/">Kontakt</a>
            </li>
            <li className="cursor-pointer p-2">
              <a href="https://forms.gle/4tBCPkLMFKptB1iZ7">Zgłoś błąd</a>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
};

const Block = ({
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
      className={twMerge("col-span-4 rounded-lg p-6", className)}
      {...rest}
    />
  );
};

const AnimationLogo = () => (
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

const JoinUsBlock = ({
  canPlan,
  isLoading,
}: {
  canPlan: boolean;
  isLoading: boolean;
}) => (
  <Block className="flex flex-col items-center justify-center gap-6 md:gap-10">
    <div className="">
      <h1 className="text-center text-4xl font-medium leading-tight md:text-left">
        <span className="font-inter tracking-wide text-white animate-in">
          Stwórz swój plan używając{" "}
          <span className="font-bold uppercase">darmowego</span> zapisownika!
        </span>
      </h1>
    </div>
    <div className="">
      <p className="text-center text-white md:mr-4 md:text-2xl">
        Zaloguj się do platformy USOS i stwórz swój plan na semestr!
      </p>
    </div>
    <div className="z-50">
      {isLoading ? (
        <div className="text-white">Loading...</div>
      ) : canPlan ? (
        <Link
          href="/plans"
          data-umami-event="Landing - Go to planning"
          className={buttonVariants({
            size: "lg",
            variant: "outline",
            className: cn(
              "cursor-pointer hover:bg-white hover:shadow-[0_0_5px_rgb(200,200,255),0_0_10px_rgb(164,200,255)]",
            ),
          })}
        >
          {/* Przejdź do planowania <ChevronRightIcon className="ml-2" /> */}
          Przejdź do planowania
        </Link>
      ) : (
        <Link
          href="/api/login"
          data-umami-event="Landing - Go to planning"
          className={buttonVariants({
            size: "lg",
            variant: "outline",
            className: cn(
              "cursor-pointer hover:bg-white hover:shadow-[0_0_5px_rgb(200,200,255),0_0_10px_rgb(164,200,255)]",
            ),
          })}
        >
          {/* Przejdź do planowania <ChevronRightIcon className="ml-2" /> */}
          Zaloguj się
        </Link>
      )}
    </div>
  </Block>
);

const Logo = () => {
  return (
    <a href="https://solvro.pwr.edu.pl/">
      <Image
        src="/assets/logo/solvro_white.png"
        alt="Logo Koła Naukowego Solvro"
        width={150}
        height={150}
        className="mx-auto ml-20 cursor-pointer"
      />
    </a>
  );
};

export const Footer = () => {
  return (
    <footer className="sm:mt-12">
      <p className="p-4 text-center text-white">
        Made with ❤️ by{" "}
        <a
          href="https://solvro.pwr.edu.pl/"
          className="font-bold text-mainbutton hover:underline"
        >
          SOLVRO
        </a>
      </p>
    </footer>
  );
};

const Home = () => {
  const query = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await fetch("/api/profile");
      return response.json();
    },
  });
  const isLoading = query.isLoading;
  let canPlan = false;
  canPlan = Boolean(query.data?.first_name);
  return (
    <>
      <Seo />
      {/* Main Page */}
      <div className="relative min-h-screen overflow-hidden bg-mainbutton7">
        {/* Blobs */}
        <div className="hidden md:block">
          <svg
            style={{
              position: "absolute",
              top: "50%",
              overflow: "hidden",
              boxShadow: "100 100 ",
            }}
            width="685"
            height="725"
            viewBox="0 0 685 725"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M666 733C554.346 1014.97 311 818 -12 733C-247.475 733 -227.275 728.837 -227.275 464.181C-227.275 344.785 -212.174 257.477 -125.373 132.524C-79.4254 -47.6951 190.184 -54.0001 249 176C285.195 317.541 479.451 382.961 596.021 481.796C668.874 543.566 711.384 618.388 666 733Z"
              fill="url(#paint0_linear_396_121)"
              fillOpacity="0.2"
            />
            <defs>
              <linearGradient
                id="paint0_linear_396_121"
                x1="228.505"
                y1="0.113281"
                x2="228.505"
                y2="879.428"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FFFFFF" />
                <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
          <svg
            style={{
              position: "absolute",
              top: "-30%",
              right: "-20%",
              overflow: "hidden",
              rotate: "180deg",
            }}
            width="1085"
            height="1025"
            viewBox="0 0 685 725"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M666 733C554.346 1014.97 311 818 -12 733C-247.475 733 -227.275 728.837 -227.275 464.181C-227.275 344.785 -212.174 257.477 -125.373 132.524C-79.4254 -47.6951 190.184 -54.0001 249 176C285.195 317.541 479.451 382.961 596.021 481.796C668.874 543.566 711.384 618.388 666 733Z"
              fill="url(#paint0_linear_396_121)"
              fillOpacity="0.2"
            />
            <defs>
              <linearGradient
                id="paint0_linear_396_121"
                x1="228.505"
                y1="0.113281"
                x2="228.505"
                y2="879.428"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FFFFFF" />
                <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        {/* Particles */}
        <div className="">
          <div className="particleX absolute right-10 top-32 animate-move-top duration-10000 md:right-80 md:top-36">
            <Image
              src="/assets/particle/particleX.png"
              alt="Kształt cząsteczki X"
              width={20}
              height={20}
            />
          </div>
          <div className="particleX absolute bottom-12 left-20 animate-move-bottom duration-10000 md:bottom-48 md:left-80">
            <Image
              src="/assets/particle/particleX.png"
              alt="Kształt cząsteczki X"
              width={20}
              height={20}
            />
          </div>
          <div className="particleO absolute bottom-52 right-4 animate-bounce duration-2000 md:bottom-64 md:right-1/3">
            <Image
              src="/assets/particle/particleO.png"
              alt="Kształt cząsteczki O"
              width={20}
              height={20}
            />
          </div>
          <div className="absolute left-5 top-72 animate-bounce duration-2000 md:left-40 md:top-40">
            <Image
              src="/assets/particle/particleO.png"
              alt="Kształt cząsteczki O"
              width={20}
              height={20}
            />
          </div>
        </div>
        {/* Main Content page */}
        <div className="container mx-auto">
          <Navbar />
          <div className="flex flex-col">
            <div className="flex justify-center">
              <div className="px-10">
                <AnimationLogo />
              </div>
            </div>
            <section className="flex justify-center">
              <JoinUsBlock canPlan={canPlan} isLoading={isLoading} />
            </section>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
