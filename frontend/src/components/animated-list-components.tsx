"use client";

import Image from "next/image";

import { AnimatedList } from "@/components/magicui/animated-list";
import { usePlanOrientation } from "@/hooks/use-plan-orientation";
import { cn } from "@/lib/utils";

import { ClassBlock } from "./class-block";
import { Marquee } from "./magicui/marquee";

/* eslint-disable react/no-array-index-key */

interface Item {
  name: string;
  description: string;
  time: string;
}

let notifications = [
  {
    name: "Planer - Zmiana godziny",
    description:
      "W planie 'Fajny planik' zmieniono godzinę zajęć z 12:00 na 12:30",
    time: "15m ago",
  },
  {
    name: "Planer - Nowa grupa",
    description: "W planie 'Fajny planik' dodano nową grupę zajęciową",
    time: "10m ago",
  },
  {
    name: "Planer - Zmiana prowadzącego",
    description: "W planie 'Fajny planik' zmieniono prowadzącego zajęć",
    time: "5m ago",
  },
  {
    name: "Planer - Usunięcie zajęć",
    description: "W planie 'Fajny planik' usunięto zajęcia z 12:30",
    time: "2m ago",
  },
];

notifications = Array.from({ length: 10 }, () => notifications).flat();

const courses = [
  {
    startTime: "15:15",
    endTime: "16:55",
    groupNumber: "1",
    courseName: "Algorytmy i struktury danych",
    lecturer: "Dariusz Konieczny",
    week: "TN",
    courseType: "C",
    spotsOccupied: 25,
    spotsTotal: 25,
    averageRating: 5,
    opinionsCount: 100,
    className: "w-full",
  },
  {
    startTime: "17:00",
    endTime: "18:40",
    groupNumber: "8",
    courseName: "Systemy operacyjne",
    lecturer: "Arkadiusz Warzyński",
    week: "",
    courseType: "L",
    spotsOccupied: 13,
    spotsTotal: 15,
    averageRating: 5,
    opinionsCount: 100,
    className: "w-full",
  },
  {
    startTime: "11:45",
    endTime: "13:25",
    groupNumber: "1",
    courseName: "Architektura komputerów",
    lecturer: "Radosław Michalski",
    week: "",
    courseType: "W",
    spotsOccupied: 115,
    spotsTotal: 125,
    averageRating: 5,
    opinionsCount: 100,
    className: "w-full",
  },
  {
    startTime: "7:30",
    endTime: "9:00",
    groupNumber: "2",
    courseName: "Laboratotium podstaw fizyki",
    lecturer: "Jan Kopaczek",
    week: "",
    courseType: "L",
    spotsOccupied: 15,
    spotsTotal: 15,
    averageRating: 5,
    opinionsCount: 100,
    className: "w-full",
  },
] as const;

function Notification({ name, description, time }: Item) {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-2xl">
          <Image
            src={"/assets/gmail_icon.png"}
            alt={"Ikonka gmaila"}
            width={40}
            height={40}
            className="w-8"
          />
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="line-clamp-2 w-full truncate text-sm font-normal dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
}

export function AnimatedNotificationsDemo({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full flex-col overflow-hidden p-2",
        className,
      )}
    >
      <AnimatedList delay={1600}>
        {notifications.map((item, index) => (
          <Notification {...item} key={index} />
        ))}
      </AnimatedList>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
    </div>
  );
}

export function AnimatedGroupsDemo({ className }: { className?: string }) {
  const { isHorizontal } = usePlanOrientation();
  return (
    <Marquee pauseOnHover className={className}>
      {courses.map((f, index) => (
        <ClassBlock
          key={`${f.courseName}-${index.toString()}`}
          isHorizontal={isHorizontal}
          {...f}
          isChecked
          isDisabled
          disableTooltip
          className={cn(
            f.className,
            "w-[400px] transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none",
          )}
        />
      ))}
    </Marquee>
  );
}
