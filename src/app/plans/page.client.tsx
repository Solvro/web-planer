"use client";

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

import PlansLoading from "./loading";

export function PlansPage({
  onlinePlans,
}: {
  /** Online plans of the signed-in user, null when logged out. */
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
              Ostatnio edytowany {lastEdited.toLocaleString("pl-PL")}
            </p>
          )}
        </div>
        <Button onClick={addNewPlan}>
          <Icons.Plus className="size-4" />
          Nowy plan
        </Button>
      </div>
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

/**
 * Local copies of plans deleted online on another device are dropped once per
 * visit. Each candidate is re-checked against the server so a stale router
 * cache never removes a plan that still exists.
 */
function useRemoveOrphanedLocalPlans(
  localPlans: StoredPlan[],
  onlinePlans: UserSchedulesDTO[] | null,
  remove: (id: string) => void,
) {
  const checked = useRef(false);

  // Reconciling browser storage with server data is a genuine side effect,
  // not something a parent could do in an event handler.
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
