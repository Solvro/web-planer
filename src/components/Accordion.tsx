import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ExtendedCourse } from "@/pages/createplan/[id]";

export const GroupsAccordion = ({
  registrationName,
  index,
  onClick,
  courses,
}: {
  registrationName: string;
  index: number;
  onClick: (id: string) => void;
  courses: ExtendedCourse[];
}) => {
  return (
    <div className="max-w-96">
      <Accordion type="single" collapsible={true} className="">
        <AccordionItem value="item-1">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-4">
              <div className="flex h-[50px] w-[50px] items-center justify-center rounded-[50px] bg-primary font-bold">
                {index + 1}
              </div>
              {registrationName}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {courses.map(
              (course) =>
                course.registrationName === registrationName && (
                  <div key={course.name}>
                    <div className="grid grid-cols-[1fr_5fr] items-center justify-between break-all p-4 py-2 text-base hover:cursor-pointer hover:bg-stone-300">
                      <div className="flex h-[50px] w-[50px] items-center justify-center rounded-[50px] bg-secondary">
                        {course.name.slice(0, 1).toUpperCase()}
                      </div>
                      <label
                        htmlFor={`${index}-${course.name}`}
                        className="ml-4 flex justify-between hover:cursor-pointer"
                      >
                        {course.name}
                        <input
                          id={`${index}-${course.name}`}
                          type="checkbox"
                          onChange={() => {
                            onClick(course.name);
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
