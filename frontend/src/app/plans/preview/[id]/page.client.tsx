"use client";

import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useMemo, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import { planFamily } from "@/atoms/plan-family";
import { plansIds } from "@/atoms/plans-ids";
import { ClassSchedule } from "@/components/class-schedule";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import type { SharedPlan } from "@/lib/types";
import { Day } from "@/services/usos/types";

export function SharePlanPage({ plan }: { plan: SharedPlan["plan"] }) {
  const uuid = useMemo(() => uuidv4(), []);
  const [plans, setPlans] = useAtom(plansIds);
  const [planToCopy, setPlanToCopy] = useAtom(planFamily({ id: uuid }));

  const router = useRouter();
  const captureRef = useRef<HTMLDivElement>(null);

  const copyPlan = () => {
    const newPlan = {
      id: uuid,
      ...plan,
    };

    void window.umami?.track("Create plan", {
      numberOfPlans: plans.length,
    });

    setPlans([...plans, newPlan]);
    setPlanToCopy({
      ...planToCopy,
      ...plan,
    });

    setTimeout(() => {
      router.push(`/plans/edit/${newPlan.id}`);
    }, 200);
  };

  return (
    <div className="flex w-full grow flex-col overflow-x-auto">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4 md:px-14">
        <h1 className="text-xl font-semibold">{plan.name}</h1>

        <div className="flex items-center gap-1">
          <Button
            size={"sm"}
            className="bg-white text-black"
            onClick={copyPlan}
          >
            <Icons.Copy className="size-4" />
            Skopiuj do siebie
          </Button>
        </div>
      </div>

      <div
        ref={captureRef}
        className="flex flex-col gap-2 overflow-auto bg-background p-1 scrollbar-thin"
      >
        {[
          { day: Day.MONDAY, label: "Poniedziałek" },
          { day: Day.TUESDAY, label: "Wtorek" },
          { day: Day.WEDNESDAY, label: "Środa" },
          { day: Day.THURSDAY, label: "Czwartek" },
          { day: Day.FRIDAY, label: "Piątek" },
        ].map(({ day, label }) => (
          <ClassSchedule
            key={day}
            day={label}
            isReadonly={true}
            selectedGroups={[]}
            groups={plan.allGroups.filter((g) => g.day === day && g.isChecked)}
            onSelectGroup={() => {
              return null;
            }}
          />
        ))}
        {[
          { day: Day.SATURDAY, label: "Sobota" },
          { day: Day.SUNDAY, label: "Niedziela" },
        ].map(
          ({ day, label }) =>
            plan.allGroups.some((g) => g.day === day) && (
              <ClassSchedule
                key={day}
                day={label}
                isReadonly={true}
                selectedGroups={[]}
                groups={plan.allGroups.filter(
                  (g) => g.day === day && g.isChecked,
                )}
              />
            ),
        )}
      </div>
    </div>
  );
}
