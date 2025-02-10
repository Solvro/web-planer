import Link from "next/link";

import { Icons } from "@/components/icons";
import { AvatarCircles } from "@/components/magicui/avatars";
import { Button } from "@/components/ui/button";
import { env } from "@/env.mjs";

export async function GithubRepo() {
  let stars = 0;
  let contributorsCount = 0;
  const contributors: {
    name: string;
    avatar: string;
    id: number;
    contributions: number;
  }[] = [];

  const responseStars = await fetch(
    "https://api.github.com/repos/Solvro/web-planer",
    {
      headers:
        env.GITHUB_TOKEN == null
          ? {}
          : {
              Authorization: `Bearer ${env.GITHUB_TOKEN}`,
              "Content-Type": "application/json",
            },
      next: {
        revalidate: 3600,
      },
    },
  );

  if (responseStars.ok) {
    const data = (await responseStars.json()) as { stargazers_count: number };
    stars = data.stargazers_count;
  }

  const responseContributors = await fetch(
    "https://api.github.com/repos/Solvro/web-planer/contributors",
    {
      headers:
        env.GITHUB_TOKEN == null
          ? {}
          : {
              Authorization: `Bearer ${env.GITHUB_TOKEN}`,
              "Content-Type": "application/json",
            },
      next: {
        revalidate: 3600,
      },
    },
  );

  if (responseContributors.ok) {
    const data = (await responseContributors.json()) as {
      login: string;
      avatar_url: string;
      id: number;
      contributions: number;
    }[];
    contributorsCount = data.length;
    for (const contributor of data) {
      contributors.push({
        name: contributor.login,
        avatar: contributor.avatar_url,
        id: contributor.id,
        contributions: contributor.contributions,
      });
    }
  }
  return (
    <>
      <div className="mx-auto space-y-4 pb-6 text-center">
        <h2 className="font-mono text-sm font-medium uppercase tracking-wider text-primary">
          autorzy
        </h2>
        <h1 className="relative z-10 mx-auto mt-4 max-w-xs text-3xl font-semibold sm:max-w-none sm:text-4xl md:text-5xl">
          <span className="relative whitespace-nowrap text-white">
            <span className="absolute -left-[5%] -top-[2.5%] z-0 h-[110%] w-[110%] -rotate-1 bg-blue-400/20 dark:bg-blue-200/10"></span>
            <span className="relative z-10 text-blue-600 dark:text-blue-400">
              {contributorsCount} developerów
            </span>
          </span>
          <span className="relative z-10"> tworzy ten projekt</span>
        </h1>
      </div>
      <div className="mt-2 flex flex-col items-center justify-center">
        <AvatarCircles contributors={contributors} />
        <Icons.FlexyArrow className="mt-12" />
        <Button
          className="group mt-4 bg-primary text-white ring-amber-500 ring-offset-2 transition-all hover:bg-blue-600 hover:ring-2 dark:bg-white dark:text-black dark:hover:bg-slate-200"
          size={"lg"}
          asChild
        >
          <Link href="https://github.com/Solvro/web-planer" target="_blank">
            <Icons.Github className="size-4" />
            Walnij nam gwiazdkę
            <Icons.StarFilledIcon className="text-slate-300 transition-all group-hover:text-amber-500 dark:text-slate-600" />
            {stars}
          </Link>
        </Button>
      </div>
    </>
  );
}
