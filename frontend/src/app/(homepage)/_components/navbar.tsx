"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function Logo() {
  return (
    <Link href="https://solvro.pwr.edu.pl/">
      <Image
        src="/assets/logo/solvro_white.png"
        alt="Logo Koła Naukowego Solvro"
        width={150}
        height={150}
        className="mx-auto cursor-pointer"
      />
    </Link>
  );
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <div className="relative z-50 h-20 border-b border-white/10 backdrop-blur-[12px]">
      <div className="container mx-auto flex items-center justify-between px-6 md:px-20">
        <Logo />

        <nav className="hidden h-20 items-center text-white md:flex">
          <ul className="flex gap-6">
            <li>
              <Link href="https://www.facebook.com/knsolvro">Aktualności</Link>
            </li>

            <li>
              <Link
                href="https://web.usos.pwr.edu.pl/kontroler.php?_action=news/default&panel=DOMYSLNY&file=zapisyPL.html"
                target="_blank"
              >
                Terminarz USOS
              </Link>
            </li>
            <li>
              <Link href="https://solvro.pwr.edu.pl/contact/">Kontakt</Link>
            </li>
            <li>
              <Link href="https://forms.gle/4tBCPkLMFKptB1iZ7">Zgłoś błąd</Link>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Icon */}
        <div className="flex h-20 items-center md:hidden">
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
        {isMenuOpen ? (
          <div className="absolute left-0 top-full w-full animate-fade-in bg-mainbutton6 shadow-lg md:hidden">
            <ul className="flex flex-col gap-4 p-4 text-center uppercase text-white">
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
                <Link href="https://forms.gle/4tBCPkLMFKptB1iZ7">
                  Zgłoś błąd
                </Link>
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
