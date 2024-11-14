import Image from "next/image";
import { Navbar } from "./_components/navbar";
import { Footer } from "@/components/footer";

export default function LayoutHomePage({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
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

      <div className="container mx-auto">
        <Navbar />
        {children}
        <Footer />
      </div>
    </div>
  );
}
