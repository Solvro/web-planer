import React from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { FiMapPin } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChevronRightIcon } from "lucide-react";
import { fadeIn } from "@/lib/variants";
import { GrSchedules } from "react-icons/gr";
import { GoDatabase } from "react-icons/go";
import { MdOutlineFreeCancellation } from "react-icons/md";
import { MdIosShare } from "react-icons/md";


export const RevealBento = () => {
  return (
    <div className="min-h-screen bg-solvrolight px-4 py-12 text-zinc-50 border-solvrodark">
      <Logo />
      <motion.div
        // Nw ktora animacje wybrac
        // initial="initial"
        // animate="animate"
        // transition={{
        //   staggerChildren: 0.05,
        // }}
        variants={fadeIn("center", 0.5)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: false, amount: 0.3 }}
        className="mx-auto grid max-w-screen-xl grid-flow-dense grid-cols-12 gap-x-5 gap-y-5"
      >
        <HeaderBlock />
        <SocialsBlock />
        <AboutBlock />
        <LocationBlock />
        <EmailListBlock />
      </motion.div>
      <Footer />
    </div>
  );
};

const Block: React.FC<any> = ({ className, ...rest }) => {
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
      className={twMerge(
        "col-span-4 rounded-lg p-6 bg-gradient-to-b from-solvrodark/90 via-solvroshadow/5 to-solvrolightshadow/20 border border-solvroshadow/10	",
        className
      )}
      {...rest}
    />
  );
};

const HeaderBlock = () => (
  <Block
    whileHover={{
      rotate: "0.0deg",
      scale: 1.01,
    }}
    className="col-span-12 row-span-2 md:col-span-8 text-center flex justify-center content-center align-middle items-center"
  >
    <a href="https://solvro.pwr.edu.pl/">
      <Image
        src="/assets/logo/logo_solvro_color.png"
        alt="Logo Koła Naukowego Solvro w kolorze"
        width={400}
        height={400}
        className="rounded-md animate-waving-hand duration-10000 cursor-pointer"
      />
    </a>
  </Block>
);

const SocialsBlock = () => (
  <>
    <Block
      whileHover={{
        rotate: "2.5deg",
        scale: 1.1,
      }}
      className="place-content-center col-span-3  md:col-span-2"
    >
      <div className="flex flex-col items-center justify-center gap-6">
        {/* <Image
          src="/assets/logo/pwr.png"
          alt="Logo Politechniki Wrocławskiej"
          width={40}
          height={40}
        /> */}
        <GrSchedules size={40} />
        <p className="text-center text-xs text-white uppercase font-semibold">
          Twórz wiele planów
        </p>
      </div>
    </Block>
    <Block
      whileHover={{
        rotate: "-2.5deg",
        scale: 1.1,
      }}
      className="col-span-3 md:col-span-2"
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <GoDatabase size={40}/>
        <p className="text-center text-xs text-white uppercase font-semibold">
        Automatyczne pobieranie zapisów z USOS'a
        </p>
      </div>
    </Block>
    <Block
      whileHover={{
        rotate: "-2.5deg",
        scale: 1.1,
      }}
      className="col-span-3  md:col-span-2"
    >
      <div className="flex flex-col items-center justify-center gap-6">
      <MdOutlineFreeCancellation size={40}/>
        <p className="text-center text-xs text-white uppercase font-semibold">
        Wykluczanie niemożliwych zajęć
        </p>
      </div>
    </Block>
    <Block
      whileHover={{
        rotate: "2.5deg",
        scale: 1.1,
      }}
      className="col-span-3 md:col-span-2"
    >
      <div className="flex flex-col items-center justify-center gap-6">
      <MdIosShare size={40}/>
        <p className="text-center text-xs text-white uppercase font-semibold">
        Udostępniaj swój plan innym
        </p>
      </div>
    </Block>
  </>
);

const AboutBlock = () => (
  <Block
    whileHover={{
      rotate: "0.0deg",
      scale: 1.01,
    }}
    className="col-span-12 text-3xl flex justify-center items-center text-center"
  >
    <h1 className=" text-4xl font-medium leading-tight">
      <span className="text-white">
        Stwórz z nami swój plan używając{" "}
        <span className="text-solvrolightshadow">DARMOWEGO</span> zapisownika!
      </span>
    </h1>
  </Block>
);

const LocationBlock = () => (
  <Block
    whileHover={{
      rotate: "0.0deg",
      scale: 1.01,
    }}
    className="col-span-12 flex flex-col items-center gap-4 md:col-span-3 "
  >
    <FiMapPin className="text-3xl" />
    <p className="text-center text-lg">Politechnika Wrocławska</p>
  </Block>
);

const EmailListBlock = () => (
  <Block className="flex flex-col md:flex-row items-center justify-center col-span-12 md:gap-10 md:col-span-9 text-center">
    <p className="text-center md:text-xl md:mr-4">
      Zaloguj się do platformy USOS i stwórz swój plan na semestr!
    </p>
    <Button
      variant="outline"
      className="bg-white text-black text-xl hover:bg-blue-700 hover:text-white border-4 hover:border-blue-700 mt-4 md:mt-0 self-center md:p-7"
    >
      Utwórz nowy plan
      <ChevronRightIcon className="ml-2 h-4 w-4" />
    </Button>
  </Block>
);

const Logo = () => {
  return (
    <a href="https://solvro.pwr.edu.pl/">
      <Image
        src="/assets/logo/solvro.png"
        alt="Logo Koła Naukowego Solvro"
        width={200}
        height={50}
        className="mx-auto mb-12 cursor-pointer"
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
          className="text-blue-300 hover:underline font-bold"
        >
          SOLVRO
        </a>
      </p>
    </footer>
  );
};

const Home = () => {
  return <RevealBento />;
};

export default Home;
