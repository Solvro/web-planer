"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @next/next/no-img-element */

interface Contributor {
  name: string;
  avatar: string;
  id: number;
  contributions: number;
}
interface AvatarCirclesProps {
  className?: string;
  contributors: Contributor[];
}

export function AvatarCircles({ className, contributors }: AvatarCirclesProps) {
  return (
    <div className={cn("z-10 flex -space-x-4 rtl:space-x-reverse", className)}>
      {contributors.map((contributor, index) => (
        <Tooltip key={contributor.id}>
          <TooltipTrigger asChild={true}>
            <Link
              href={`https://github.com/${contributor.name}`}
              target="_blank"
              className="relative -mx-0.5 transition-all hover:z-10 hover:scale-125"
              rel="noopener noreferrer"
            >
              <img
                key={index}
                className="h-16 w-16 rounded-full border-2 border-white bg-background dark:border-gray-800"
                src={contributor.avatar}
                width={64}
                height={64}
                alt={`Avatar ${index + 1}`}
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent align="center" side="top">
            <div>
              <h1 className="font-semibold">@{contributor.name}</h1>
              <p>{contributor.contributions} contributions</p>
            </div>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
