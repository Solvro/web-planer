import { useAtom, useAtomValue } from "jotai";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { LuDownloadCloud } from "react-icons/lu";

import { planFamily } from "@/atoms/planFamily";
import { ReadonlyScheduleTest } from "@/components/ReadonlyScheduleTest";
import { SolvroLogo } from "@/components/SolvroLogo";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { plansIds } from "../plans";

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = (async (context) => {
  const { id } = context.query;

  if (typeof id !== "string") {
    throw new Error(`Invalid hash ${id?.toString()}`);
  }

  return { props: { id: parseInt(id) } };
}) satisfies GetServerSideProps;

const SharePlan = ({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [plans, setPlans] = useAtom(plansIds);
  const plan = useAtomValue(planFamily({ id }));
  const [planToCopy, setPlanToCopy] = useAtom(
    planFamily({ id: plans.length + 1 }),
  );

  const router = useRouter();

  const mondaySchedule = plan.groups.filter((group) => group.isChecked);

  const copyPlan = () => {
    const newPlan = {
      id: plans.length + 1,
      groups: plan.groups,
      courses: plan.courses,
    };

    void window.umami?.track("Create plan", {
      numberOfPlans: plans.length,
    });

    setPlans([...plans, newPlan]);
    setPlanToCopy({
      ...planToCopy,
      courses: plan.courses,
      groups: plan.groups,
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
            href="/plans"
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
      <ReadonlyScheduleTest schedule={mondaySchedule} />
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
