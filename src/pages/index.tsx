import type React from "react";
import { useState, type ComponentProps } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <div className="flex items-center justify-between z-50 relative h-20">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-row h-20 gap-10 items-center text-white pr-10 lg:pr-40">
          <ul className="flex gap-6">
            <li className="cursor-pointer">
              <Link href="/">Strona główna</Link>
            </li>
            <li className="cursor-pointer">
              <a href="https://www.facebook.com/knsolvro">Aktualności</a>
            </li>
            <li className="cursor-pointer">
              <a href="https://web.usos.pwr.edu.pl/kontroler.php?_action=news/default&panel=DOMYSLNY&file=instrukcjePL.html">
                Instrukcje
              </a>
            </li>
            <li className="cursor-pointer">
              <a href="https://web.usos.pwr.edu.pl/kontroler.php?_action=news/default&panel=DOMYSLNY&file=zapisyPL.html">
                Terminarz
              </a>
            </li>
            <li className="cursor-pointer">
              <a href="https://solvro.pwr.edu.pl/contact/">Kontakt</a>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
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
        {isMenuOpen ? <div className="md:hidden absolute top-full left-0 w-full bg-mainbutton6 shadow-lg animate-fade-in">
            <ul className="flex flex-col text-center gap-4 p-4 text-white uppercase">
              <li className="cursor-pointer p-2">
                <Link href="/">Strona główna</Link>
              </li>
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
            </ul>
          </div> : null}
      </div>
  );
};

const Block = ({ className, ...rest }: ComponentProps<typeof motion["div"]> & { className: string }) => {
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
    className="md:mt-10 text-center flex justify-center content-center align-middle items-center"
  >
    <div className="md:flex justify-center items-center gap-4 sm:gap-6">
      <div className="md:mt-5 md:mb-0 mb-5">
        <p className="font-bold text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          SOLVRO
        </p>
      </div>

      <a href="https://solvro.pwr.edu.pl/">
        <Image
          src="/assets/logo/logo_solvro_mono.png"
          alt="Logo Koła Naukowego Solvro w kolorze"
          width={200}
          height={200}
          className="rounded-md animate-waving-hand duration-5000 cursor-pointer pb-10"
        />
      </a>

      <div className="mb:mt-5">
        <p className="font-bold text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          PLANER
        </p>
      </div>
    </div>
  </Block>
);

const JoinUsBlock = () => (
  <Block className="flex flex-col justify-center items-center gap-6 md:gap-10">
    <div className="">
      <h1 className="text-4xl font-medium leading-tight text-center md:text-left">
        <span className="text-white font-inter tracking-wide animate-in">
          Stwórz z nami swój plan używając{" "}
          <span className="uppercase font-bold">darmowego</span> zapisownika!
        </span>
      </h1>
    </div>
    <div className="">
      <p className="text-center md:text-2xl md:mr-4 text-white">
        Zaloguj się do platformy USOS i stwórz swój plan na semestr!
      </p>
    </div>
    <div className="">
      <Link
        href="plans"
        className={buttonVariants({
          size: "lg",
          variant: "outline",
          class:
            "transition-all h-20 hover:bg-white border-4 md:mt-0 self-center md:p-7 hover:shadow-[0_0_5px_rgb(200,200,255),0_0_10px_rgb(164,200,255)] animate-pulse duration-2000 hover:animate-none text-xl cursor-pointer",
        })}
      >
        Przejdź do planowania <ChevronRightIcon className="ml-2" />
      </Link>
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
        className="mx-auto cursor-pointer ml-20"
      />
    </a>
  );
};

const Footer = () => {
  return (
    <footer className="mt-12">
      <p className="text-center text-white">
        Made with ❤️ by{" "}
        <a
          href="https://solvro.pwr.edu.pl/"
          className="text-mainbutton hover:underline font-bold"
        >
          SOLVRO
        </a>
      </p>
    </footer>
  );
};

const Home = () => {


  return (
    <>
      {/* Main Page */}
      <div className="min-h-screen bg-mainbutton5 relative overflow-hidden">
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
          <div className="particleX animate-move-top duration-10000 absolute top-32 right-10 md:top-36 md:right-80">
            <Image
              src="/assets/particle/particleX.png"
              alt="Kształt cząsteczki X"
              width={20}
              height={20}
            />
          </div>
          <div className="particleX animate-move-bottom absolute bottom-12 left-20 md:bottom-48 md:left-80 duration-10000 ">
            <Image
              src="/assets/particle/particleX.png"
              alt="Kształt cząsteczki X"
              width={20}
              height={20}
            />
          </div>
          <div className="particleO animate-bounce duration-2000 absolute bottom-52 right-4 md:bottom-64 md:right-1/3">
            <Image
              src="/assets/particle/particleO.png"
              alt="Kształt cząsteczki O"
              width={20}
              height={20}
            />
          </div>
          <div className="animate-bounce duration-2000 absolute top-72 left-5 md:top-40 md:left-40">
            <Image
              src="/assets/particle/particleO.png"
              alt="Kształt cząsteczki O"
              width={20}
              height={20}
            />
          </div>
        </div>
        {/* Main Content page */}
        <div className="container mx-auto ">
          <Navbar />
          <div className="flex flex-col ">
            <div className="flex justify-center">
              <div className="px-10">
                <AnimationLogo />
              </div>
            </div>
            <section className="flex justify-center ">
              <JoinUsBlock />
            </section>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
