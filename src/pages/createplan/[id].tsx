import html2canvas from "html2canvas";
import { useAtom } from "jotai";
import { atomFamily, atomWithStorage } from "jotai/utils";
import jsPDF from "jspdf";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { as } from "vitest/dist/chunks/reporters.C_zwCd4j.js";

import { PlanDisplayLink } from "@/components/PlanDisplayLink";
import { Seo } from "@/components/SEO";
import { ScheduleTest } from "@/components/Schedule";
import { SelectGroups } from "@/components/SelectGroups";
import { SolvroLogo } from "@/components/SolvroLogo";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { encodeToBase64 } from "@/lib/sharingUtils";
import type { ClassBlockProps, Course, Group, Registration } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface ExtendedCourse extends Course {
  isChecked: boolean;
}

export interface ExtendedGroup extends ClassBlockProps {
  isChecked: boolean;
}

export const planFamily = atomFamily(
  ({ id }: { id: number }) =>
    atomWithStorage(
      `${id}-plan`,
      {
        id,
        name: `Nowy plan - ${id}`,
        courses: [] as ExtendedCourse[],
        groups: [] as ExtendedGroup[],
        departments: [] as string[],
        registrations: [] as Registration[],
      },
      undefined,
      { getOnInit: true },
    ),
  (a, b) => a.id === b.id,
);

export const getServerSideProps = (async (context) => {
  const { id } = context.query;

  if (typeof id !== "string") {
    throw new Error(`Invalid id ${id?.toString()}`);
  }

  const planId = parseInt(id);

  return { props: { planId } };
}) satisfies GetServerSideProps<{ planId: number }>;

const CreatePlan = ({
  planId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [plan, setPlan] = useAtom(planFamily({ id: planId }));
  const inputRef = useRef<HTMLInputElement>(null);
  const [isError, setIsError] = useState(false);
  const scheduleRef = useRef(null);

  const handleSaveAsPDF = () => {
    const input = scheduleRef.current;

    const classBlocks = input.querySelectorAll(".class-block");

    classBlocks.forEach(
      (block: {
        getAttribute: (arg0: string) => string;
        style: { display: string };
      }) => {
        if (block.getAttribute("data-disabled") === "true") {
          block.style.display = "none";
        }
      },
    );

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("plan.pdf");
    });
  };

  const handleDepartmentChange = async (
    facultyName: string,
  ): Promise<Registration[]> => {
    const facultyID = /\[(.*?)\]/.exec(facultyName)?.[1] ?? "";

    setPlan({
      ...plan,
      departments: [facultyID],
    });

    if (!facultyID) {
      throw new Error(`Invalid faculty name: ${facultyName}`);
    }

    const res = await fetch(`/api/data/${facultyID}`);
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = (await res.json()) as { registrations: unknown[] };

    const registrations: Registration[] = data.registrations.map(
      (reg: unknown) => {
        const typedReg = reg as {
          registration: { description: { pl: string }; id: string };
        };
        return {
          name: typedReg.registration.description.pl,
          id: typedReg.registration.id,
        };
      },
    );

    return registrations;
  };

  const handleRegistrationChange = async (registrationId: string) => {
    const facultyID = plan.departments[0];

    if (!facultyID) {
      throw new Error(`Invalid faculty name: ${facultyID}`);
    }

    try {
      const res = await fetch(`/api/data/${facultyID}`);
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = (await res.json()) as { registrations: unknown[] };

      const selectedRegistration = data.registrations.find((reg: unknown) => {
        const typedReg = reg as {
          registration: { id: string };
        };
        return typedReg.registration.id === registrationId;
      }) as
        | {
            registration: { id: string };
            courses: Array<{ course: { name: string; groups: Group[] } }>;
          }
        | undefined;

      if (selectedRegistration === undefined) {
        setIsError(true);
        throw new Error(`Registration with ID ${registrationId} not found`);
      }

      const courses: ExtendedCourse[] = selectedRegistration.courses.map(
        (course) =>
          ({
            name: course.course.name,
            registrationName: selectedRegistration.registration.id,
            isChecked: false,
          }) satisfies ExtendedCourse,
      );

      const groups: ExtendedGroup[] = selectedRegistration.courses.flatMap(
        (course) => course.groups.map((group: Group) => {
          const startTime = `${group.hourStartTime.hours}:${group.hourStartTime.minutes}`;
          const endTime = `${group.hourEndTime.hours}:${group.hourEndTime.minutes}`;
          const day = group.day;
          const courseType = group.type.charAt(0).toUpperCase() as "C" | "L" | "P" | "S" | "W";
          const courseName = course.course.name;
          const courseID = course.course.id;
          const lecturer = group.person;
          const week = group.frequency === "każd" ? "" : group.frequency === "nieparzyst" ? "TN" : "TP";
          const groupNumber = `gr. ${group.groupNumber}`;
          const registrationName = selectedRegistration.registration.id;
          const isChecked = false;
      
          return {
            startTime,
            endTime,
            day,
            courseType,
            courseName,
            courseID,
            lecturer,
            week,
            group: groupNumber,
            registrationName,
            isChecked,
          } as ExtendedGroup;
        })
      );

      setPlan({
        ...plan,
        courses,
        groups,
      });
    } catch (error) {
      throw error;
    }
  };

  const changePlanName = (newName: string) => {
    void window.umami.track("Change plan name");
    setPlan({
      ...plan,
      name: newName,
    });
  };

  const checkCourse = (id: string) => {
    void window.umami.track("Check course");
    setPlan({
      ...plan,
      courses: plan.courses.map((course) =>
        course.name === id
          ? { ...course, isChecked: !course.isChecked }
          : course,
      ),
    });
  };

  const checkGroup = (id: string, courseType: string, groupNumber: string) => {
    void window.umami.track("Change group");
    setPlan({
      ...plan,
      groups: plan.groups.map((group) =>
        group.courseID === id &&
        group.courseType === courseType &&
        group.group === groupNumber
          ? { ...group, isChecked: !group.isChecked }
          : group,
      ),
    });
  };

  return (
    <>
      <Seo
        pageTitle={`${plan.name.length === 0 ? "Plan bez nazwy" : plan.name} | Kreator planu`}
      />
      <div className="flex min-h-screen flex-col items-center gap-3 overflow-x-hidden">
        <div className="flex max-h-20 min-h-20 w-full items-center justify-between bg-mainbutton7">
          <div className="ml-4 flex items-center gap-2 text-2xl font-bold text-white md:w-1/4">
            <SolvroLogo />
            <div className="md:hidden">Kreator</div>
          </div>
          <div className="hidden w-1/2 items-center justify-center font-bold text-white md:flex md:text-4xl">
            Kreator
          </div>
          <div className="mr-4 flex w-1/4 items-center justify-end">
            <Link
              href="/plans"
              data-umami-event="Back to plans"
              className={cn(buttonVariants({ variant: "link" }), "text-white")}
            >
              <span className="text-nowrap">Moje plany</span>
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

        <div className="flex w-full flex-col items-center justify-center gap-2 md:flex-row md:items-start">
          <div className="flex w-9/12 max-w-[400px] flex-col items-center justify-center gap-2 md:ml-4 md:w-4/12 md:flex-col">
            <div className="w-full rounded-xl border-2 p-5">
              <div className="flex flex-col justify-start gap-3 md:w-full">
                <div className="flex w-full">
                  <form
                    className="flex w-full items-center justify-center"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      changePlanName(formData.get("name")?.toString() ?? "");
                      inputRef.current?.blur();
                    }}
                  >
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="name">Nazwa</Label>
                      <Input
                        ref={inputRef}
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Wolne poniedziałki"
                        defaultValue={
                          typeof window === "undefined" ? "" : plan.name
                        }
                        onChange={(e) => {
                          changePlanName(e.currentTarget.value);
                        }}
                      />
                    </div>
                  </form>
                </div>

                <div className="flex w-full items-center justify-between gap-1 md:flex-col lg:flex-row">
                  <button
                    className={cn(buttonVariants({ variant: "primary" }))}
                    onClick={handleSaveAsPDF}
                  >
                    Zapisz jako PDF
                  </button>
                  {/* <PlanDisplayLink
                    hash={encodeToBase64(JSON.stringify(plan))}
                  /> */}
                </div>
              </div>
            </div>
            <div className="w-full items-center justify-center">
              <SelectGroups
                courses={plan.courses}
                checkCourse={checkCourse}
                handleDepartmentChange={handleDepartmentChange}
                handleRegistrationChange={handleRegistrationChange}
              />
              {isError && <div>Wystąpił błąd</div>}
            </div>
          </div>
          <hr />
          <div
            ref={scheduleRef}
            className="flex w-11/12 items-start overflow-x-auto md:ml-0"
          >
            <ScheduleTest
              schedule={plan.groups}
              courses={plan.courses}
              groups={plan.groups}
              onClick={checkGroup}
            />
          </div>
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
    </>
  );
};

export default CreatePlan;
