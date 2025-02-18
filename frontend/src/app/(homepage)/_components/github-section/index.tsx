import { env } from "@/env.mjs";
import type { Contributor } from "@/types";

import { GithubItem } from "./github-item";

export async function GithubSection() {
  let stars = 0;
  let contributorsCount = 0;
  const contributors: Contributor[] = [];

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
    <GithubItem
      contributorsCount={contributorsCount}
      contributors={contributors}
      stars={stars}
    />
  );
}
