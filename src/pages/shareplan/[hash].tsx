import { useAtom } from "jotai";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { LuDownloadCloud } from "react-icons/lu";

import { ReadonlyScheduleTest } from "@/components/ReadonlyScheduleTest";
import { SharePlanResponsiveDialog } from "@/components/SharePlanResponsiveDialog";
import { SolvroLogo } from "@/components/SolvroLogo";
import { Button, buttonVariants } from "@/components/ui/button";
import { decodeFromBase64 } from "@/lib/sharingUtils";
import { cn } from "@/lib/utils";

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
          <Image
            src="https://github.com/shadcn.png"
            width={40}
            height={40}
            className="rounded-full"
            alt="Picture of the author"
          />
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 p-2">
        <SharePlanResponsiveDialog hash={hash} />
        <Button
          onClick={copyPlan}
          className="text-nowrap rounded-md bg-mainbutton3 text-lg text-black"
        >
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
