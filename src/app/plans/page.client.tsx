"use client";

import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import type { UserSchedulesDTO } from "@/actions/plans";
import { getPlan } from "@/actions/plans";
import { localPlansAtom } from "@/atoms/plans-ids";
import { Icons } from "@/components/icons";
import { PlanItem } from "@/components/plan-item";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";
import { useLocalPlans } from "@/lib/plan/local-plans";
import type { StoredPlan } from "@/types";

import { AgentPromoBanner } from "./_components/agent-promo-banner";
import PlansLoading from "./loading";

export function PlansPage({
  onlinePlans,
}: {
  onlinePlans: UserSchedulesDTO[] | null;
}) {
  const hydrated = useHydrated();

  if (!hydrated) {
    return <PlansLoading />;
  }

  return <PlansList onlinePlans={onlinePlans} />;
}

function PlansList({
  onlinePlans,
}: {
  onlinePlans: UserSchedulesDTO[] | null;
}) {
  const localPlans = useAtomValue(localPlansAtom);
  const { create, remove } = useLocalPlans();
  const router = useRouter();

  useRemoveOrphanedLocalPlans(localPlans, onlinePlans, remove);

  const addNewPlan = () => {
    void window.umami?.track("Create plan", {
      numberOfPlans: localPlans.length,
    });
    const plan = create();
    router.push(`/plans/edit/${plan.id}`);
  };

  const localIds = new Set(localPlans.map((plan) => plan.id));
  const onlineOnlyPlans = (onlinePlans ?? []).filter(
    (plan) => !localIds.has(plan.id),
  );
  const lastEdited =
    localPlans.length > 0
      ? new Date(
          Math.max(
            ...localPlans.map((plan) => new Date(plan.updatedAt).getTime()),
          ),
        )
      : null;

  return (
    <div className="container mx-auto max-h-full flex-1 grow overflow-y-auto p-4 pt-20">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Moje plany</h1>
          {lastEdited === null ? null : (
            <p className="text-muted-foreground text-sm">
              Ostatnia zmiana{" "}
              {format(lastEdited, "d MMM yyyy, HH:mm", { locale: pl })}
            </p>
          )}
        </div>
        <Button onClick={addNewPlan}>
          <Icons.Plus className="size-4" />
          Nowy plan
        </Button>
      </div>
      <AgentPromoBanner />
      {localPlans.length === 0 && onlineOnlyPlans.length === 0 ? (
        <div className="border-border/70 text-muted-foreground flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-16 text-center">
          <Icons.Plans className="text-primary/70 size-8" />
          <p className="text-foreground text-lg font-semibold">
            Nie masz jeszcze żadnego planu
          </p>
          <p className="max-w-sm text-sm text-balance">
            Utwórz pierwszy plan, dodaj rejestrację z USOS i poukładaj grupy
            tak, jak lubisz.
          </p>
          <Button onClick={addNewPlan} className="mt-2">
            <Icons.Plus className="size-4" />
            Utwórz plan
          </Button>
        </div>
      ) : null}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {localPlans.map((plan) => (
          <PlanItem key={plan.id} local={plan} />
        ))}
        {onlineOnlyPlans.map((plan) => (
          <PlanItem key={plan.id} online={plan} />
        ))}
      </div>
    </div>
  );
}

function useRemoveOrphanedLocalPlans(
  localPlans: StoredPlan[],
  onlinePlans: UserSchedulesDTO[] | null,
  remove: (id: string) => void,
) {
  const checked = useRef(false);

  /* eslint-disable react-you-might-not-need-an-effect/no-event-handler, react-you-might-not-need-an-effect/no-pass-data-to-parent */
  useEffect(() => {
    if (checked.current || onlinePlans === null) {
      return;
    }
    checked.current = true;

    const onlineIds = new Set(onlinePlans.map((plan) => plan.id));
    const candidates = localPlans.filter(
      (plan) => plan.onlineId !== null && !onlineIds.has(plan.onlineId),
    );
    if (candidates.length === 0) {
      return;
    }

    void (async () => {
      const results = await Promise.all(
        candidates.map(async (plan) => ({
          id: plan.id,
          exists: (await getPlan({ id: plan.onlineId ?? "" })) !== null,
        })),
      );
      const orphaned = results.filter((result) => !result.exists);
      if (orphaned.length === 0) {
        return;
      }
      for (const { id } of orphaned) {
        remove(id);
      }
      toast.success("Usunięto plany, które usunąłeś na innym urządzeniu.", {
        duration: 5000,
      });
    })();
  }, [localPlans, onlinePlans, remove]);
  /* eslint-enable react-you-might-not-need-an-effect/no-event-handler, react-you-might-not-need-an-effect/no-pass-data-to-parent */
}
