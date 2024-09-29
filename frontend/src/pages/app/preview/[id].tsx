import { useAtom } from "jotai";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { LuDownloadCloud } from "react-icons/lu";

import { planFamily } from "@/atoms/planFamily";
import { plansIds } from "@/atoms/plansIds";
import { ClassSchedule } from "@/components/ClassSchedule";
import { SolvroLogo } from "@/components/SolvroLogo";
import { Button, buttonVariants } from "@/components/ui/button";
import { usePlan } from "@/lib/usePlan";
import { cn } from "@/lib/utils";
import { Day } from "@/services/usos/types";

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = (async (context) => {
  const { id } = context.query;

  if (typeof id !== "string") {
    throw new Error(`Invalid hash ${id?.toString()}`);
  }

  return { props: { id } };
}) satisfies GetServerSideProps;

const SharePlan = ({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const uuid = React.useMemo(() => crypto.randomUUID(), []);
  const [plans, setPlans] = useAtom(plansIds);
  const plan = usePlan({ planId: id });
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
      void router.push(`/app/createplan/${newPlan.id}`);
    }, 200);
  };
  return (
    <div className="flex max-h-screen flex-col overflow-x-hidden">
      <div className="flex max-h-20 min-h-20 items-center justify-between bg-mainbutton7">
        <div className="ml-4 w-1/4 flex-none">
          <SolvroLogo />
        </div>
        <div className="mr-4 flex items-center justify-end gap-4">
          <Link
            href="/app/plans"
            data-umami-event="Back to plans"
            className={cn(
              buttonVariants({ variant: "link" }),
              "p-0 text-white",
            )}
          >
            <span className="text-nowrap">Moje plany</span>
          </Link>
          <Link
            href="/"
            data-umami-event="Back to homepage"
            className={cn(
              buttonVariants({ variant: "link" }),
              "p-0 text-white",
            )}
          >
            <span className="text-nowrap">Strona główna</span>
          </Link>
        </div>
      </div>
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
      <div className="flex w-full flex-1 items-center justify-center bg-mainbutton7 p-2">
        <p className="text-center text-white">
          Made with ❤️ by{" "}
          <a
            href="https://solvro.pwr.edu.pl/"
            className="font-bold text-mainbutton hover:underline"
          >
            SOLVRO
          </a>
        </p>
      </div>
    </div>
  );
};

export default SharePlan;
