"use client"

import { useState } from "react";
import Image from "next/image";

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

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <div className="relative z-50 h-20 backdrop-blur-[12px] border-b border-white/10">
      <div className="flex items-center justify-between container mx-auto">
        <Logo />

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
    </div>
  );
};