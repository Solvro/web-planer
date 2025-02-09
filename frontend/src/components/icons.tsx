import {
  AlertTriangle,
  BellRingIcon,
  Biohazard,
  Bug,
  CalendarPlusIcon,
  CalendarRangeIcon,
  Check,
  CircleHelp,
  Cloud,
  Copy,
  Download,
  DownloadCloud,
  EllipsisVertical,
  Fingerprint,
  GitPullRequestClosed,
  Link,
  Loader2Icon,
  Lock,
  LogOut,
  Menu,
  Moon,
  Paintbrush,
  Palette,
  Pencil,
  Plus,
  RefreshCw,
  RefreshCwOff,
  Settings2Icon,
  Share,
  Star,
  StarHalf,
  Sun,
  Timer,
  Trash,
  TriangleAlert,
  UploadCloud,
  UserIcon,
  UsersRound,
  Workflow,
  X,
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
  Plus,
  DownloadCloud,
  UploadCloud,
  Cloud,
  AlertTriangle,
  RefreshCw,
  GitPullRequestClosed,
  RefreshCwOff,
  Star,
  StarHalf,
  UsersRound,
  X,
  EllipsisVertical,
  Trash,
  Pencil,
  Sun,
  Moon,
  Settings: Settings2Icon,
  CircleHelp,
  LogOut,
  Check,
  Bug,
  Menu,
};
