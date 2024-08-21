import React from "react";
import { ClassSchedule } from "@/components/ClassSchedule";
import { ClassBlockProps } from "@/lib/types";

const mockL = {
  startTime: "17:05",
  endTime: "19:50",
  group: "1",
  courseName: "Fizyka I",
  lecturer: "Jerzy Świątek",
  week: "TN",
  courseType: "L",
} satisfies ClassBlockProps;

const mockW = {
  startTime: "18:55",
  endTime: "19:50",
  group: "3",
  courseName: "Wykład X",
  lecturer: "Jerzy Świątek",
  week: "",
  courseType: "W",
} satisfies ClassBlockProps;

const mockS = {
  startTime: "13:15",
  endTime: "15:00",
  group: "5",
  courseName: "Seminarium X",
  lecturer: "Jerzy Świątek",
  week: "TP",
  courseType: "S",
} satisfies ClassBlockProps;

const mockC = {
  startTime: "7:30",
  endTime: "9:00",
  group: "11",
  courseName: "Cwiczenia X",
  lecturer: "Jerzy Świątek",
  week: "",
  courseType: "C",
} satisfies ClassBlockProps;

const mockP = {
  startTime: "9:15",
  endTime: "11:00",
  group: "5",
  courseName: "Projekt X",
  lecturer: "Jerzy Świątek",
  week: "",
  courseType: "P",
} satisfies ClassBlockProps;

const mock1115 = {
  startTime: "11:15",
  endTime: "13:00",
  group: "4",
  courseName: "Fizyka II",
  lecturer: "Jerzy Świątek",
  week: "",
  courseType: "L",
} satisfies ClassBlockProps;

const mock1610 = {
  startTime: "16:10",
  endTime: "16:55",
  group: "12",
  courseName: "Logika dla informatyków",
  lecturer: "Ngoc Nquyen",
  week: "TP",
  courseType: "C",
} satisfies ClassBlockProps;

const mockFootball = {
  startTime: "8:00",
  endTime: "9:30",
  group: "1",
  courseName: "Piłka nożna",
  lecturer: "Ziutek Ziutowski",
  week: "",
  courseType: "C",
} satisfies ClassBlockProps;
const mockSpanish = {
  startTime: "21:00",
  endTime: "21:50",
  group: "1",
  courseName: "Język hiszpański",
  lecturer: "Szefuncio",
  week: "",
  courseType: "C",
} satisfies ClassBlockProps;

const mockVoleyball = {
  startTime: "10:00",
  endTime: "11:30",
  group: "3",
  courseName: "Siatkówka",
  lecturer: "Nauczyciel X",
  week: "",
  courseType: "C",
} satisfies ClassBlockProps;
const mondaySchedule = [
  mockL,
  mockW,
  mockS,
  mockC,
  mockP,
  mock1115,
  mock1610,
  mockFootball,
  mockSpanish,
  mockVoleyball,
];

const ScheduleTest = () => {
  return <ClassSchedule schedule={mondaySchedule} day="Poniedziałek" />;
};

export default ScheduleTest;
