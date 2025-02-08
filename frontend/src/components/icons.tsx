import {
  BellRingIcon,
  Biohazard,
  CalendarPlusIcon,
  CalendarRangeIcon,
  Copy,
  Download,
  Fingerprint,
  Link,
  Loader2Icon,
  Lock,
  Paintbrush,
  Palette,
  Share,
  Timer,
  TriangleAlert,
  UserIcon,
  Workflow,
} from "lucide-react";
import Image from "next/image";

import LogoColor from "../../public/assets/logo/logo_solvro_color.png";
import LogoWhite from "../../public/assets/logo/logo_solvro_mono.png";

export const Icons = {
  Logo: () => (
    <>
      <Image
        src={LogoColor}
        alt="Logo Koła Naukowego Solvro"
        width={50}
        className="block dark:hidden"
      />
      <Image
        src={LogoWhite}
        alt="Logo Koła Naukowego Solvro"
        width={50}
        className="hidden dark:block"
      />
    </>
  ),
  Loader: Loader2Icon,
  Plans: CalendarRangeIcon,
  Fingerprint,
  Alert: TriangleAlert,
  Lock,
  Timer,
  Biohazard,
  Download,
  Palette,
  User: UserIcon,
  Bell: BellRingIcon,
  AddCalendar: CalendarPlusIcon,
  Share,
  Link,
  Copy,
  Workflow,
  Paintbrush,
};
