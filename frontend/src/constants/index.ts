import { LessonType } from "@/services/usos/types";

export const faculties = [
  {
    name: "[PRK24/S1] Studium Języków Obcych",
    value: "PRK24/S1",
  },
  {
    name: "[PRK24/S3] Studium Wychowania Fizycznego i Sportu",
    value: "PRK24/S3",
  },
  {
    name: "[W1] Wydział Architektury",
    value: "W1",
  },
  {
    name: "[W2] Wydział Budownictwa Lądowego i Wodnego",
    value: "W2",
  },
  {
    name: "[W3] Wydział Chemiczny",
    value: "W3",
  },
  {
    name: "[W4N] Wydział Informatyki i Telekomunikacji",
    value: "W4N",
  },
  {
    name: "[W5] Wydział Elektryczny",
    value: "W5",
  },
  {
    name: "[W6] Wydział Geoinżynierii, Górnictwa i Geologii",
    value: "W6",
  },
  {
    name: "[W8N] Wydział Zarządzania",
    value: "W8N",
  },
  {
    name: "[W9] Wydział Mechaniczno-Energetyczny",
    value: "W9",
  },
  {
    name: "[W10] Wydział Mechaniczny",
    value: "W10",
  },
  {
    name: "[W11] Wydział Podstawowych Problemów Techniki",
    value: "W11",
  },
  {
    name: "[W12N] Wydział Elektroniki, Fotoniki i Mikrosystemów",
    value: "W12N",
  },
  {
    name: "[W13] Wydział Matematyki",
    value: "W13",
  },
  {
    name: "[FLG] Filia w Legnicy",
    value: "FLG",
  },
  {
    name: "[PWR] Politechnika Wrocławska",
    value: "PWR",
  },
];

export const lessonTypeToName = (lessonType: LessonType) => {
  switch (lessonType) {
    case LessonType.EXERCISES:
      return "Ć";
    case LessonType.LABORATORY:
      return "L";
    case LessonType.PROJECT:
      return "P";
    case LessonType.SEMINAR:
      return "S";
    case LessonType.LECTURE:
      return "W";
    default:
      return "";
  }
};
