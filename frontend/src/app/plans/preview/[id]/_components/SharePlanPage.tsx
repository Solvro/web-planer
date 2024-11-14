"use client";

import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import * as React from "react";
import { LuDownloadCloud } from "react-icons/lu";

import { planFamily } from "@/atoms/planFamily";
import { plansIds } from "@/atoms/plansIds";
import { ClassSchedule } from "@/components/ClassSchedule";
import { Button } from "@/components/ui/button";
import { usePlan } from "@/lib/usePlan";
import { Day } from "@/services/usos/types";

export function SharePlanPage({ planId }: { planId: string }) {
  const uuid = React.useMemo(() => crypto.randomUUID(), []);
  const [plans, setPlans] = useAtom(plansIds);
  const plan = usePlan({ planId });
  const [planToCopy, setPlanToCopy] = useAtom(planFamily({ id: uuid }));

  const router = useRouter();

  const copyPlan = () => {
    const newPlan = {
      id: uuid,
      courses: plan.courses,
    };

    void window.umami?.track("Create plan", {
      numberOfPlans: plans.length,
    });

    setPlans([...plans, newPlan]);
    setPlanToCopy({
      ...planToCopy,
      courses: plan.courses,
    });

    setTimeout(() => {
      router.push(`/plans/create/${newPlan.id}`);
    }, 200);
  };
  return (
    <>
      <div className="flex items-center justify-center gap-4 p-2">
        <Button
          onClick={copyPlan}
          className="flex items-center justify-center gap-4 text-nowrap rounded-md text-lg"
        >
          Skopiuj
          <LuDownloadCloud />
        </Button>
      </div>
      <div className="flex flex-col gap-2 overflow-auto p-1 scrollbar-thin scrollbar-track-sky-300 scrollbar-thumb-sky-900">
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
            onSelectGroup={(groupdId) => {
              plan.selectGroup(groupdId);
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
    </>
  );
}
