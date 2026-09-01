"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import React, { useMemo } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/types";

import { Icons } from "./icons";
import { Badge } from "./ui/badge";
import { SignOutButton } from "./ui/signout-button";

const THEME_LABEL: Record<string, string> = {
  light: "jasny",
  dark: "ciemny",
  system: "automatyczny",
};

export function UserButton({ profile }: { profile: User }) {
  const [opened, setOpened] = React.useState(false);
  const { theme } = useTheme();

  return (
    <DropdownMenu open={opened} onOpenChange={setOpened}>
      <DropdownMenuTrigger className="focus:outline-none">
        <UserAvatar profile={profile} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-96 rounded-2xl p-0 shadow-md"
      >
        <div className="bg-muted/50 flex w-full flex-col items-center">
          <div className="bg-background flex w-full items-center gap-2 p-4">
            <UserAvatar profile={profile} />
            <div className="flex w-full items-start gap-3">
              <div className="flex flex-col gap-1">
                <h1 className="translate-y-0.5 text-lg leading-none font-semibold">
                  {profile.firstName} {profile.lastName}
                </h1>

                <p className="text-xs leading-none font-medium">
                  {profile.studentNumber}@student.pwr.edu.pl
                </p>
              </div>

              <Badge
                variant={profile.emailVerified ? "secondary" : "destructive"}
              >
                {profile.emailVerified ? "Zweryfikowany" : "Niezweryfikowany"}
              </Badge>
            </div>
          </div>
          <MenuLink
            href="/plans/account"
            icon={<Icons.Settings className="h-4 w-4" />}
            label="Ustawienia konta"
            onNavigate={() => {
              setOpened(false);
            }}
          />
          <MenuLink
            href="/plans/account/appearance"
            icon={<Icons.Palette className="h-4 w-4" />}
            label={`Motyw: ${THEME_LABEL[theme ?? "system"]}`}
            onNavigate={() => {
              setOpened(false);
            }}
          />
          <MenuLink
            href="/plans/account/calendar"
            icon={<Icons.CircleHelp className="h-4 w-4" />}
            label="Jak dodać do kalendarza?"
            onNavigate={() => {
              setOpened(false);
            }}
          />
          <SignOutButton
            render={
              <button className="bg-background hover:bg-muted/50 flex w-full items-center gap-3 rounded-b-lg border-t border-b p-4 py-4 shadow-sm transition-all dark:hover:shadow-black/50">
                <div className="mr-1 flex w-[40px] items-center justify-center">
                  <Icons.LogOut className="h-4 w-4" />
                </div>
                <h2 className="text-sm font-medium">Wyloguj się</h2>
              </button>
            }
          />
          <div className="flex w-full items-center justify-center gap-3 p-4 py-2.5">
            <p className="translate-y-px text-xs font-medium">
              Secured by{" "}
              <Link href="/" className="font-semibold">
                🔒 Solvro
              </Link>
            </p>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MenuLink({
  href,
  icon,
  label,
  onNavigate,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onNavigate: () => void;
}) {
  return (
    <Link href={href} className="w-full">
      <button
        className="bg-background hover:bg-muted/50 flex w-full items-center gap-3 border-t p-4 py-4 transition-all"
        onClick={onNavigate}
      >
        <div className="mr-1 flex w-[40px] items-center justify-center">
          {icon}
        </div>
        <h2 className="text-sm font-medium">{label}</h2>
      </button>
    </Link>
  );
}

export function UserAvatar({ profile }: { profile: User }) {
  const isFirstNameEmpty =
    profile.firstName == null || profile.firstName === "";
  const isLastNameEmpty = profile.lastName == null || profile.lastName === "";

  const fallback = useMemo(() => {
    if (isFirstNameEmpty && isLastNameEmpty) {
      return profile.studentNumber?.toString().slice(0, 2) ?? "??";
    }

    if (isFirstNameEmpty) {
      return profile.lastName?.slice(0, 1) ?? "?";
    }

    if (isLastNameEmpty) {
      return profile.firstName?.slice(0, 1) ?? "?";
    }

    return `${profile.firstName?.slice(0, 1) ?? ""}${profile.lastName?.slice(0, 1) ?? ""}`;
  }, [
    isFirstNameEmpty,
    isLastNameEmpty,
    profile.firstName,
    profile.lastName,
    profile.studentNumber,
  ]);

  return (
    <Avatar>
      <AvatarImage src={profile.image ?? "/assets/avatar_placeholder.png"} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}
