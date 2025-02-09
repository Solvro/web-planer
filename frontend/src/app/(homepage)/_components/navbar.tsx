"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { FeedbackButton } from "@/app/plans/_components/feedback-button";
import { Icons } from "@/components/icons";
import { ModeToggle } from "@/components/theme-switch";
import { Button } from "@/components/ui/button";
import { useFeedback } from "@/hooks/use-feedback";

function Logo() {
  return (
    <Link href="https://solvro.pwr.edu.pl/">
      <Image
        src="/assets/logo/solvro_black.png"
        alt="Logo Koła Naukowego Solvro"
        width={150}
        height={30}
        className="mx-auto block cursor-pointer dark:hidden"
        unoptimized
      />
      <Image
        src="/assets/logo/solvro_white.png"
        alt="Logo Koła Naukowego Solvro"
        width={150}
        height={30}
        className="mx-auto hidden cursor-pointer dark:block"
        unoptimized
      />
    </Link>
  );
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openDialog } = useFeedback();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-20 border-b border-blue-900/20 bg-blue-100/50 backdrop-blur-[12px] dark:bg-blue-100/5">
      <div className="container mx-auto flex items-center justify-between px-6 md:px-20">
        <Logo />

        <nav className="hidden h-20 items-center font-semibold text-black dark:text-white md:flex">
          <div className="flex items-center gap-2">
            <Button
              asChild={true}
              variant={"ghost"}
              className="hover:bg-blue-200/40 dark:hover:bg-white/5"
            >
              <Link href="https://www.facebook.com/knsolvro" target="_blank">
                Aktualności
              </Link>
            </Button>
            <Button
              asChild={true}
              variant={"ghost"}
              className="hover:bg-blue-200/40 dark:hover:bg-white/5"
            >
              <Link
                href="https://web.usos.pwr.edu.pl/kontroler.php?_action=news/default&panel=DOMYSLNY&file=zapisyPL.html"
                target="_blank"
              >
                Terminarz USOS
              </Link>
            </Button>
            <Button
              asChild={true}
              variant={"ghost"}
              className="hover:bg-blue-200/40 dark:hover:bg-white/5"
            >
              <Link href="https://solvro.pwr.edu.pl/contact/" target="_blank">
                Kontakt
              </Link>
            </Button>
            <FeedbackButton />
            <ModeToggle />
          </div>
        </nav>

        {/* Mobile Menu Icon */}
        <div className="flex h-20 items-center md:hidden">
          <Button onClick={toggleMenu} size={"icon"} variant={"outline"}>
            {isMenuOpen ? (
              <Icons.X className="!size-6" />
            ) : (
              <Icons.Menu className="!size-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -400 }}
              animate={{ opacity: 100, y: 0 }}
              exit={{ opacity: 0, y: -400 }}
              className="absolute left-0 top-full w-full bg-background shadow-lg md:hidden"
            >
              <ul className="flex flex-col gap-4 p-4 text-center uppercase text-black dark:text-white">
                <li className="p-2">
                  <Link href="https://www.facebook.com/knsolvro">
                    Aktualności
                  </Link>
                </li>
                <li className="p-2">
                  <Link href="https://web.usos.pwr.edu.pl/kontroler.php?_action=news/default&panel=DOMYSLNY&file=instrukcjePL.html">
                    Instrukcje
                  </Link>
                </li>
                <li className="p-2">
                  <Link href="https://web.usos.pwr.edu.pl/kontroler.php?_action=news/default&panel=DOMYSLNY&file=zapisyPL.html">
                    Terminarz
                  </Link>
                </li>
                <li className="p-2">
                  <Link href="https://solvro.pwr.edu.pl/contact/">Kontakt</Link>
                </li>
                <li className="p-2">
                  <button onClick={openDialog}>Zgłoś błąd</button>
                </li>
              </ul>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
