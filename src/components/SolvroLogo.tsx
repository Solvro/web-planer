import Image from "next/image";
import Link from "next/link";

export const SolvroLogo = () => {
  return (
    <Link href="/" className="inline-block cursor-pointer">
      <Image
        src="/assets/logo/logo_solvro_mono.png"
        alt="Logo Koła Naukowego Solvro"
        width={50}
        height={50}
      />
    </Link>
  );
};
