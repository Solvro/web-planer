"use client";

import { toPng } from "html-to-image";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useCallback, useMemo, useRef } from "react";

import { planFamily } from "@/atoms/plan-family";
import { plansIds } from "@/atoms/plans-ids";
import { ClassSchedule } from "@/components/class-schedule";
import { Button } from "@/components/ui/button";
import { usePlan } from "@/lib/use-plan";
import { Day } from "@/services/usos/types";

export function SharePlanPage({ planId }: { planId: string }) {
  const uuid = useMemo(() => crypto.randomUUID(), []);
  const [plans, setPlans] = useAtom(plansIds);
  const plan = usePlan({ planId });
  const [planToCopy, setPlanToCopy] = useAtom(planFamily({ id: uuid }));

  const router = useRouter();
  const captureRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      router.push(`/plans/edit/${newPlan.id}`);
    }, 200);
  };

  const downloadPlan = useCallback(async () => {
    if (captureRef.current === null) {
      return;
    }

    const element = captureRef.current;
    try {
      const dataUrl = await toPng(element, { cacheBust: true });
      const link = document.createElement("a");
      link.download = `${plan.name}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error: unknown) {
      console.error(error);
    }
  }, [captureRef, plan.name]);
  return (
    <div className="flex grow flex-col">
      <div className="flex items-center justify-center gap-4 p-2">
        <Button
          onClick={downloadPlan}
          className="flex items-center justify-center gap-4 text-nowrap rounded-md text-lg"
        >
          Pobierz .jpg
        </Button>
      </div>

      <div
        ref={captureRef}
        className="flex flex-col gap-2 overflow-auto bg-white p-1 scrollbar-thin scrollbar-track-sky-300 scrollbar-thumb-sky-900"
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
    </div>
  );
}
