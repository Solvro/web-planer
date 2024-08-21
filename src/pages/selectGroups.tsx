import React from "react";

import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

import { DummyData } from "@/services/usos/getGroups";
import { GroupsAccordion } from "@/components/Accordion";
import { getGroups } from "@/services/usos/getGroups";
import { Group } from "@/services/usos/getGroups";

export const getServerSideProps = (async () => {
  //get data from api
  const groups = await getGroups();
  // Pass data to the page via props
  return { props: { groups } };
}) satisfies GetServerSideProps<{ groups: DummyData[] }>;

export default function Home({ groups }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [allGroups, setAllGroups] = React.useState<Array<DummyData>>(
    groups.map((registration) => ({
      ...registration,
      courses: registration.courses.map((course) => ({
        ...course,
        groups: course.groups.map((group) => ({
          ...group,
          isChecked: false,
        })),
      })),
    }))
  );
  function checkGroup(index: number, group: Group) {
    setAllGroups((prevRegistrations) =>
      prevRegistrations.map((registration, ri) =>
        ri === index
          ? {
              ...registration,
              courses: registration.courses.map((course) =>
                course.course.id === group.courseId
                  ? {
                      ...course,
                      groups: course.groups.map((gr) =>
                        group.name === gr.name ? { ...gr, isChecked: !gr.isChecked } : gr
                      ),
                    }
                  : course
              ),
            }
          : registration
      )
    );
  }

  return (
    <div>
      <h1>Home</h1>
      <h1 className="text-2xl font-semibold p-4 ">Wybierz odpowiednią turę:</h1>
      {allGroups.map((data, index) => (
        <GroupsAccordion key={data.registration.id} index={index} onClick={checkGroup} {...data} />
      ))}
    </div>
  );
}
