"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

const TABS = [
  {
    title: "Profil",
    href: "/plans/account",
    icon: <Icons.User className="size-4" />,
  },
  {
    title: "Motyw strony",
    href: "/plans/account/appearance",
    icon: <Icons.Palette className="size-4" />,
  },
  {
    title: "Dodawanie do kalendarza",
    href: "/plans/account/calendar",
    icon: <Icons.AddCalendar className="size-4" />,
  },
];

export function SettingsTabs({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col gap-1", className)}>
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname === tab.href
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
          )}
        >
          {tab.icon}
          {tab.title}
        </Link>
      ))}
    </nav>
  );
}
