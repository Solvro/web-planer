import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { ReadonlyScheduleTest } from "@/components/ReadonlyScheduleTest";
import { decodeFromBase64 } from "@/lib/sharingUtils";

import type { ExtendedCourse, ExtendedGroup } from "../createplan/[id]";

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
  const mondaySchedule = plan.groups.filter((group) => group.isChecked);
  return (
    <div>
      <ReadonlyScheduleTest schedule={mondaySchedule} />
    </div>
  );
};

export default SharePlan;
