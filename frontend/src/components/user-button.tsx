"use client";

import Link from "next/link";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { GetProfile } from "@/services/usos/get-profile";

import { Icons } from "./icons";
import { Badge } from "./ui/badge";
import { SignOutButton } from "./ui/signout-button";

export function UserButton({ profile }: { profile: GetProfile }) {
  const [opened, setOpened] = React.useState(false);

  return (
    <DropdownMenu open={opened} onOpenChange={setOpened}>
      <DropdownMenuTrigger className="focus:outline-none">
        <UserAvatar profile={profile} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-96 rounded-2xl p-0 shadow-md"
      >
        <div className="flex w-full flex-col items-center bg-muted/50">
          <div className="flex w-full items-center gap-2 bg-background p-4">
            <UserAvatar profile={profile} />
            <div className="flex w-full items-start gap-3">
              <div className="flex flex-col gap-1">
                <h1 className="translate-y-0.5 text-lg font-semibold leading-none">
                  {`${profile.first_name} ${profile.last_name}`}
                </h1>
                <p className="text-xs font-medium leading-none">
                  {profile.student_number}@student.pwr.edu.pl
                </p>
              </div>

              <Badge variant="secondary">Zweryfikowany</Badge>
            </div>
          </div>
          <Link href="/plans/account" className="w-full">
            <button
              className="flex w-full items-center gap-3 border-t bg-background p-4 py-4 transition-all hover:bg-muted/50"
              onClick={() => {
                setOpened(false);
              }}
            >
              <div className="mr-1 flex w-[40px] items-center justify-center">
                <Icons.Settings className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-medium">Ustawienia</h2>
            </button>
          </Link>
          <Link href="/plans/account/calendar" className="w-full">
            <button
              className="flex w-full items-center gap-3 border-t bg-background p-4 py-4 transition-all hover:bg-muted/50"
              onClick={() => {
                setOpened(false);
              }}
            >
              <div className="mr-1 flex w-[40px] items-center justify-center">
                <Icons.CircleHelp className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-medium">Jak dodać do kalendarza?</h2>
            </button>
          </Link>
          <SignOutButton asChild={true}>
            <button className="flex w-full items-center gap-3 rounded-b-lg border-b border-t bg-background p-4 py-4 shadow-sm transition-all hover:bg-muted/50 dark:hover:shadow-black/50">
              <div className="mr-1 flex w-[40px] items-center justify-center">
                <Icons.LogOut className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-medium">Wyloguj się</h2>
            </button>
          </SignOutButton>
          <div className="flex w-full items-center justify-center gap-3 p-4 py-2.5">
            <p className="translate-y-[1px] text-xs font-medium">
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

function UserAvatar({ profile }: { profile: GetProfile }) {
  return (
    <Avatar>
      <AvatarImage src={profile.photo_urls["50x50"]} />
      <AvatarFallback>
        {profile.first_name.slice(0, 1) + profile.last_name.slice(0, 1)}
      </AvatarFallback>
    </Avatar>
  );
}
