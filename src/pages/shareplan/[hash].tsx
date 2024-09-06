import { useAtom } from "jotai";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { useRouter } from "next/router";

import { ReadonlyScheduleTest } from "@/components/ReadonlyScheduleTest";
import { SharePlanResponsiveDialog } from "@/components/SharePlanResponsiveDialog";
import { SolvroLogo } from "@/components/SolvroLogo";
import { Button } from "@/components/ui/button";
import { decodeFromBase64 } from "@/lib/sharingUtils";

import type { ExtendedCourse, ExtendedGroup } from "../createplan/[id]";
import { planFamily } from "../createplan/[id]";
import { plansIds } from "../plans";

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = (async (context) => {
  const { hash } = context.query;

  if (typeof hash !== "string") {
    throw new Error(`Invalid hash ${hash?.toString()}`);
  }
  const plan = JSON.parse(decodeFromBase64(hash)) as {
    courses: ExtendedCourse[];
    groups: ExtendedGroup[];
  };
  return { props: { plan, hash } };
}) satisfies GetServerSideProps<{
  plan: { courses: ExtendedCourse[]; groups: ExtendedGroup[] };
}>;

const SharePlan = ({
  plan,
  hash,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [plans, setPlans] = useAtom(plansIds);
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

    void router.push(`/plans`).then(() => {
      setPlans([...plans, newPlan]);
      setPlanToCopy({
        ...planToCopy,
        courses: plan.courses,
        groups: plan.groups,
      });
    });
  };
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <div className="flex max-h-20 min-h-20 items-center justify-between bg-mainbutton5">
        <div className="ml-4 w-1/4 flex-none">
          <SolvroLogo />
        </div>
        <div className="flex items-center gap-2">
          <SharePlanResponsiveDialog hash={hash} />
          <div className="flex items-center justify-center rounded-xl bg-mainbutton2">
            <Button
              onClick={copyPlan}
              className="text-nowrap rounded-md bg-mainbutton2 text-lg text-black md:text-2xl"
            >
              Dodaj do widoku moje plany
            </Button>
          </div>
        </div>

        <div className="mr-4 flex w-1/4 justify-end">
          <Image
            src="https://github.com/shadcn.png"
            width={40}
            height={40}
            className="rounded-full"
            alt="Picture of the author"
          />
        </div>
      </div>
      <ReadonlyScheduleTest schedule={mondaySchedule} />
    </div>
  );
};

export default SharePlan;
