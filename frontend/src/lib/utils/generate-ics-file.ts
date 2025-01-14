import type { ExtendedGroup } from "@/atoms/plan-family";

const polishToEnglishDays: Record<string, string> = {
  poniedziałek: "MO",
  wtorek: "TU",
  środa: "WE",
  czwartek: "TH",
  piątek: "FR",
  sobota: "SA",
  niedziela: "SU",
};

const englishDays = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

const changeDateToUTC = (date: Date) => {
  return date
    .toISOString()
    .replaceAll(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
};

interface Override {
  date: string;
  day: string;
  week: "odd" | "even";
}

const overrides: Override[] = [
  {
    date: "2024-10-07",
    day: "poniedziałek",
    week: "even",
  },
  {
    date: "2024-10-08",
    day: "wtorek",
    week: "even",
  },
  {
    date: "2024-11-08",
    day: "piątek",
    week: "even",
  },
  {
    date: "2024-12-10",
    day: "wtorek",
    week: "odd",
  },
  {
    date: "2024-12-11",
    day: "piątek",
    week: "odd",
  },
  {
    date: "2025-01-28",
    day: "wtorek",
    week: "even",
  },
  {
    date: "2025-01-29",
    day: "środa",
    week: "even",
  },
  {
    date: "2025-01-30",
    day: "czwartek",
    week: "even",
  },
  {
    date: "2025-01-31",
    day: "poniedziałek",
    week: "even",
  },
  {
    date: "2025-02-03",
    day: "piątek",
    week: "even",
  },
  {
    date: "2025-02-04",
    day: "poniedziałek",
    week: "even",
  },
];

const freeDays: { date: string; description: string }[] = [
  {
    date: "2024-10-01",
    description: "Inauguracja Roku Akademickiego - dzień wolny od zajęć",
  },
  { date: "2024-10-31", description: "Dzień wolny od zajęć" },
  { date: "2024-11-01", description: "Święto Wszystkich Świętych" },
  { date: "2024-11-11", description: "Święto Niepodległości" },
  {
    date: "2024-11-15",
    description: "Święto Politechniki Wrocławskiej - dzień wolny od zajęć",
  },
];

const holidayStart = new Date("2024-12-23");
const holidayEnd = new Date("2025-01-06");

for (
  let currentDate = new Date(holidayStart);
  // eslint-disable-next-line no-unmodified-loop-condition
  currentDate <= holidayEnd;
  currentDate.setDate(currentDate.getDate() + 1)
) {
  freeDays.push({
    date: currentDate.toISOString().split("T")[0],
    description: "Ferie świąteczne - dzień wolny od zajęć",
  });
}

const isEvenOrOddWeek = (
  targetDate: Date,
  referenceDate = new Date("2024-09-30"),
  referenceIsEven = true,
): "even" | "odd" => {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;

  const diffInMs = targetDate.getTime() - referenceDate.getTime();
  const diffInWeeks = Math.floor(diffInMs / msPerWeek);

  return (diffInWeeks % 2 === 0) === referenceIsEven ? "even" : "odd";
};

const extractStartTimeUTCEndTimeUTC = (
  currentDate: Date,
  group: ExtendedGroup,
) => {
  const startDateTime = new Date(currentDate);
  const endDateTime = new Date(currentDate);
  const [startHour, startMinute] = group.startTime.split(":").map(Number);
  const [endHour, endMinute] = group.endTime.split(":").map(Number);
  startDateTime.setUTCHours(startHour, startMinute, 0, 0);
  endDateTime.setUTCHours(endHour, endMinute, 0, 0);
  const startTimeUTC = changeDateToUTC(startDateTime);
  const endTimeUTC = changeDateToUTC(endDateTime);
  return { startTimeUTC, endTimeUTC };
};

export const generateICSFile = (
  groups: ExtendedGroup[],
  name: string,
  startDate = new Date("2024-10-01"),
  endDate = new Date("2025-02-05"),
) => {
  const checkedGroups = groups.filter((group) => group.isChecked);
  let icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Planer Solvro//NONSGML v1.0//EN\n`;

  icsContent += `BEGIN:VTIMEZONE\nTZID:Europe/Warsaw\nX-LIC-LOCATION:Europe/Warsaw\nBEGIN:DAYLIGHT\nTZOFFSETFROM:+0100\nTZOFFSETTO:+0200\nTZNAME:CEST\nDTSTART:20240331T020000\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\nEND:DAYLIGHT\nBEGIN:STANDARD\nTZOFFSETFROM:+0200\nTZOFFSETTO:+0100\nTZNAME:CET\nDTSTART:20241027T030000\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\nEND:STANDARD\nEND:VTIMEZONE\n`;

  for (
    let currentDate = new Date(startDate);
    // eslint-disable-next-line no-unmodified-loop-condition
    currentDate <= endDate;
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    const freeDay = freeDays.find(
      (day) => day.date === currentDate.toISOString().split("T")[0],
    );
    if (freeDay != null) {
      continue;
    }
    for (const group of checkedGroups) {
      let currentDay = currentDate.getUTCDay();
      let currentWeek = isEvenOrOddWeek(currentDate);

      const groupDayOfWeek = polishToEnglishDays[group.day.toLowerCase()];
      if (!groupDayOfWeek) {
        continue;
      }
      const indexOfGroupDay = englishDays.indexOf(groupDayOfWeek);

      const override = overrides.find(
        (o) => o.date === currentDate.toISOString().split("T")[0],
      );

      if (override != null) {
        currentWeek = override.week;
        const overrideDayOfWeek =
          polishToEnglishDays[override.day.toLowerCase()];
        const ovverideIndexOfDay = englishDays.indexOf(overrideDayOfWeek);
        currentDay = ovverideIndexOfDay;
      }

      if (indexOfGroupDay !== currentDay) {
        continue;
      }
      if (
        (group.week === "TP" && currentWeek === "odd") ||
        (group.week === "TN" && currentWeek === "even")
      ) {
        continue;
      }

      const { startTimeUTC, endTimeUTC } = extractStartTimeUTCEndTimeUTC(
        currentDate,
        group,
      );
      icsContent += `BEGIN:VEVENT\n`;
      icsContent += `SUMMARY:${group.courseName}\n`;
      icsContent += `DESCRIPTION:${group.lecturer}\n`;
      icsContent += `DTSTART;TZID=Europe/Warsaw:${startTimeUTC}\n`;
      icsContent += `DTEND;TZID=Europe/Warsaw:${endTimeUTC}\n`;
      icsContent += `STATUS:CONFIRMED\n`;
      icsContent += `END:VEVENT\n`;
    }
  }

  icsContent += "END:VCALENDAR\n";
  const blob = new Blob([icsContent], { type: "text/calendar" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${name}.ics`;
  link.click();
};
