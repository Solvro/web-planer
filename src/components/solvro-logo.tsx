import Image from "next/image";
import Link from "next/link";

import logoColored from "@/../public/assets/logo/logo_solvro_color.png";
import logo from "@/../public/assets/logo/logo_solvro_mono.png";

export function SolvroLogo({ colored = false }: { colored?: boolean }) {
  return (
    <Link href="/" className="inline-block cursor-pointer">
      <Image
        src={colored ? logoColored : logo}
        alt="Logo Koła Naukowego Solvro"
        width={50}
      />
    </Link>
  );
}
