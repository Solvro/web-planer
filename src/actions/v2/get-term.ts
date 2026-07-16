"use server";

import redis from "@/lib/redis";
import { getOrSetRedis } from "@/lib/redis/get-set";
import { fetchUsosApi } from "@/lib/usos";

interface TermDTO {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  finishDate: string;
  isActive: boolean;
}

interface UsosTerm {
  id: string;
  name: { pl: string };
  start_date: string;
  end_date: string;
  finish_date: string;
  is_active: boolean;
}

function normalizeTerm(data: UsosTerm): TermDTO {
  return {
    id: data.id,
    name: data.name.pl,
    startDate: data.start_date,
    endDate: data.end_date,
    finishDate: data.finish_date,
    isActive: data.is_active,
  };
}

export async function getTermAction(termId: string): Promise<TermDTO> {
  return getOrSetRedis({
    redis,
    key: `usos:term:${termId}:`,
    ttlSeconds: 60 * 60 * 24 * 7,
    fetcher: async () => {
      const data = await fetchUsosApi<UsosTerm>("terms/term", {
        term_id: termId,
      });
      return normalizeTerm(data);
    },
  });
}
