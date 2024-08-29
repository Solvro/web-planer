import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { ExtendedCourse } from "@/pages/createplan";

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
          <AccordionTrigger className="px-4  hover:no-underline">
            <div className="flex items-center gap-4">
              <div className="w-[50px] h-[50px] rounded-[50px] bg-primary items-center flex justify-center font-bold">
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
                    <div className="grid grid-cols-[1fr_4fr_1fr] gap-4 justify-between break-all items-center py-2 text-base hover:bg-stone-300 hover:cursor-pointer p-4 ">
                      <div className="w-[50px] h-[50px] rounded-[50px] bg-secondary items-center flex justify-center">
                        {course.name.slice(0, 1).toUpperCase()}
                      </div>
                      <label htmlFor={`${index}-${course.name}`} className="hover:cursor-pointer">
                        {course.name}
                      </label>
                      <input
                        id={`${index}-${course.name}`}
                        type="checkbox"
                        onChange={() => { onClick(course.name); }}
                        className="w-6 h-6 justify-self-end cursor-pointer"
                        checked={course.isChecked}
                      />
                    </div>
                  </div>
                )
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
