import type { ExtendedCourse } from "@/atoms/planFamily";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const GroupsAccordion = ({
  registrationId,
  registrationName,
  index,
  onClick,
  courses,
}: {
  registrationId: string;
  registrationName: string;
  index: number;
  onClick: (courseId: string) => void;
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
            {courses.map(
              (course) =>
                course.registrationId === registrationId && (
                  <div key={course.name}>
                    <div className="grid grid-cols-[1fr_5fr] items-center justify-between break-all p-4 py-2 text-base hover:cursor-pointer hover:bg-stone-300">
                      <div className="flex h-[50px] w-[50px] items-center justify-center rounded-[50px] bg-secondary">
                        {course.type}
                      </div>
                      <label
                        htmlFor={`course-${course.id}`}
                        className="ml-4 flex justify-between hover:cursor-pointer"
                      >
                        {course.name}
                        <input
                          id={`course-${course.id}`}
                          type="checkbox"
                          onChange={() => {
                            onClick(course.id);
                          }}
                          className="h-6 w-6 cursor-pointer"
                          checked={course.isChecked}
                        />
                      </label>
                    </div>
                  </div>
                ),
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
