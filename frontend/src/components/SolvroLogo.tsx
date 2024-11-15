import Image from "next/image";
import Link from "next/link";

// eslint-disable-next-line no-restricted-imports
import logoColored from "../../public/assets/logo/logo_solvro_color.png";
// eslint-disable-next-line no-restricted-imports
import logo from "../../public/assets/logo/logo_solvro_mono.png";

export const SolvroLogo = ({ colored = false }: { colored?: boolean }) => {
  return (
    <Link href="/" className="inline-block cursor-pointer">
      <Image
        src={colored ? logoColored : logo}
        alt="Logo Koła Naukowego Solvro"
        width={50}
      />
    </Link>
  );
};
