import Image from "next/image";
import Link from "next/link";

// eslint-disable-next-line no-restricted-imports
import logo from "../../public/assets/logo/logo_solvro_mono.png";

export const SolvroLogo = () => {
  return (
    <Link href="/" className="inline-block cursor-pointer">
      <Image src={logo} alt="Logo Koła Naukowego Solvro" width={50} />
    </Link>
  );
};
