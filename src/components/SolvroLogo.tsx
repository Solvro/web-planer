import Image from "next/image";

export const SolvroLogo = () => {
  return (
    <a href="https://planer.solvro.pl/" className="inline-block">
      <Image
        src="/assets/logo/logo_solvro_mono.png"
        alt="Logo Koła Naukowego Solvro"
        width={50}
        height={50}
        className="cursor-pointer"
      />
    </a>
  );
};
