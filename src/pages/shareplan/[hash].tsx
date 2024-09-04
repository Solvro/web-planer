import { useAtom } from "jotai";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";

import { ReadonlyScheduleTest } from "@/components/ReadonlyScheduleTest";
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
  return { props: { plan } };
}) satisfies GetServerSideProps<{
  plan: { courses: ExtendedCourse[]; groups: ExtendedGroup[] };
}>;

const SharePlan = ({
  plan,
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

    void window.umami.track("Create plan", {
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
    <div className="flex flex-col items-center">
      <button onClick={copyPlan}>Copy plan</button>
      <ReadonlyScheduleTest schedule={mondaySchedule} />
    </div>
  );
};

export default SharePlan;
