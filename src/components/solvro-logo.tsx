import Image from "next/image";
import Link from "next/link";

import logoColored from "@/../public/assets/logo/logo_solvro_color.png";
import logo from "@/../public/assets/logo/logo_solvro_mono.png";

export function SolvroLogo({
  colored = false,
  href = "/",
}: {
  colored?: boolean;
  href?: string | null;
}) {
  const image = (
    <Image
      src={colored ? logoColored : logo}
      alt="Logo Koła Naukowego Solvro"
      className={colored ? undefined : "invert-0 dark:invert"}
      width={30}
    />
  );

  if (href === null) {
    return image;
  }

  return (
    <Link href={href} className="inline-block cursor-pointer">
      {image}
    </Link>
  );
}
