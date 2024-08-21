import { DummyData, Group } from "@/services/usos/getGroups";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const GroupsAccordion = ({
  index,
  onClick,
  ...props
}: {
  index: number;
  onClick: (index: number, group: Group) => void;
} & DummyData) => {
  return (
    <div className="max-w-96">
      <Accordion type="single" collapsible className="">
        <AccordionItem value="item-1">
          <AccordionTrigger className="px-4  hover:no-underline">
            <div className="flex items-center gap-4">
              <div className="w-[50px] h-[50px] rounded-[50px] bg-primary items-center flex justify-center font-bold">
                {index + 1}
              </div>
              {props.registration.name}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {props.courses.map((course) => (
              <div key={course.course.id}>
                {course.groups.map((group) => (
                  <div
                    key={group.name}
                    className="grid grid-cols-[1fr_4fr_1fr] gap-4 justify-between break-all items-center py-2 text-base hover:bg-stone-300 hover:cursor-pointer p-4 "
                  >
                    <div className="w-[50px] h-[50px] rounded-[50px] bg-secondary items-center flex justify-center">
                      {group.type.slice(0, 1).toUpperCase()}
                    </div>
                    <div>{group.name}</div>
                    <input
                      id={`${index}-${group.name}`}
                      type="checkbox"
                      onChange={() => onClick(index, group)}
                      className="w-6 h-6 justify-self-end cursor-pointer"
                      checked={group.isChecked}
                    />
                  </div>
                ))}
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
