import { fetchGithubStats } from "@/lib/utils/get-github-stats";

import { GithubItem } from "./github-item";

export async function GithubSection() {
  const { stars, contributorsCount, contributors } = await fetchGithubStats();
  return (
    <GithubItem
      contributorsCount={contributorsCount}
      contributors={contributors}
      stars={stars}
    />
  );
}
