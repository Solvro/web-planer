import { XIcon } from "lucide-react";

import type { ExtendedCourse } from "@/atoms/planFamily";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { buttonVariants } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { cn } from "@/lib/utils";

export const GroupsAccordionItem = ({
  registrationName,
  onCourseCheck,
  onCheckAll,
  onDelete,
  courses,
}: {
  registrationName: string;
  onCourseCheck: (courseId: string) => void;
  onCheckAll: (isChecked: boolean) => void;
  onDelete?: () => void;
  courses: ExtendedCourse[];
}) => {
  return (
    <AccordionItem value={registrationName}>
      <AccordionTrigger className="px-4 hover:no-underline">
        <div className="flex items-center gap-4">
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
                onDelete?.();
              }
            }}
            className={cn(buttonVariants({
              size: "icon",
              variant: "outline",
            }), "min-h-10 min-w-10")}
          >
            <XIcon className="min-h-4 min-w-6" />
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
          <div key={crypto.randomUUID()}>
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
  );
};
