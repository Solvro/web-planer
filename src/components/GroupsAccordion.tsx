import type { ExtendedCourse } from "@/atoms/planFamily";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Checkbox } from "./ui/checkbox";

export const GroupsAccordion = ({
  registrationName,
  index,
  onCourseCheck,
  onCheckAll,
  courses,
}: {
  registrationName: string;
  index: number;
  onCourseCheck: (courseId: string) => void;
  onCheckAll: (isChecked: boolean) => void;
  courses: ExtendedCourse[];
}) => {
  return (
    <div>
      <Accordion type="single" collapsible={true} className="">
        <AccordionItem value="item-1">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-4">
              <div className="flex h-[50px] w-[50px] min-w-[50px] items-center justify-center rounded-[50px] bg-primary font-bold text-white">
                {index + 1}
              </div>
              <span className="text-left text-sm">{registrationName}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="mr-4 flex h-full items-center justify-end gap-2">
              <label className="flex h-full items-center justify-between gap-2">
                Zaznacz wszystko
                <Checkbox
                  className="h-5 w-5"
                  onCheckedChange={(c) => {
                    onCheckAll(c.valueOf() === true);
                  }}
                  checked={courses.every((c) => c.isChecked)}
                />
              </label>
            </div>
            {courses.map((course) => (
              <div key={course.name}>
                <div className="grid grid-cols-[1fr_5fr] items-center justify-between p-4 py-2 text-base transition-colors hover:cursor-pointer hover:bg-blue-100">
                  <div className="flex h-[50px] w-[50px] items-center justify-center rounded-[50px] bg-secondary">
                    {course.type}
                  </div>
                  <label className="ml-4 flex h-full items-center justify-between text-wrap hover:cursor-pointer">
                    {course.name}

                    <Checkbox
                      className="h-5 w-5"
                      onCheckedChange={() => {
                        onCourseCheck(course.id);
                      }}
                      checked={course.isChecked}
                    />
                  </label>
                </div>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
