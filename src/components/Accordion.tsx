import { DummyData, Group } from "@/services/usos/getGroups";

type CombinedProps = {
  index: number;
  onClick: (index: number, group: Group) => void;
} & DummyData;

export default function Accordion({ index, onClick, ...props }: CombinedProps) {
  return (
    <div>
      <h2>{index}</h2>
      <h1>{props.registration.name}</h1>
      <h2>
        {props.courses.map((course) => {
          return (
            <div key={course.course.id}>
              <div key={course.course.id}>{course.course.name}</div>
              {course.groups.map((group) => {
                return (
                  <div key={group.name}>
                    <input type="checkbox" onClick={() => onClick(index, group)} />
                    {group.name}
                  </div>
                );
              })}
            </div>
          );
        })}
      </h2>
    </div>
  );
}
