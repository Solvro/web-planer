import type { ExtendedCourse, ExtendedGroup } from "@/atoms/plan-family";
import { Day } from "@/types";

export interface TimeSlot {
  start: string;
  end: string;
}

export interface WeekPreferences {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday?: TimeSlot[];
  sunday?: TimeSlot[];
}

const dayToWeekKey: Record<Day, keyof WeekPreferences> = {
  [Day.MONDAY]: "monday",
  [Day.TUESDAY]: "tuesday",
  [Day.WEDNESDAY]: "wednesday",
  [Day.THURSDAY]: "thursday",
  [Day.FRIDAY]: "friday",
  [Day.SATURDAY]: "saturday",
  [Day.SUNDAY]: "sunday",
};

interface ScheduleResult {
  groups: ExtendedGroup[];
  score: number;
}

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const fitsUserPreferences = (
  group: ExtendedGroup,
  preferences: WeekPreferences,
): boolean => {
  const dayKey = dayToWeekKey[group.day];
  const dayPrefs = preferences[dayKey];
  if (dayPrefs === undefined) {
    return false;
  }

  const groupStart = timeToMinutes(group.startTime);
  const groupEnd = timeToMinutes(group.endTime);

  return dayPrefs.some((pref) => {
    const prefStart = timeToMinutes(pref.start);
    const prefEnd = timeToMinutes(pref.end);
    return groupStart >= prefStart && groupEnd <= prefEnd;
  });
};

const hasTimeConflict = (
  group1: ExtendedGroup,
  group2: ExtendedGroup,
): boolean => {
  if (group1.day !== group2.day) {
    return false;
  }

  const start1 = timeToMinutes(group1.startTime);
  const end1 = timeToMinutes(group1.endTime);
  const start2 = timeToMinutes(group2.startTime);
  const end2 = timeToMinutes(group2.endTime);

  return !(end1 <= start2 || end2 <= start1);
};

const calculateScore = (
  groups: ExtendedGroup[],
  preferences: WeekPreferences,
): number => {
  if (groups.length === 0) {
    return 0;
  }

  let matchingGroups = 0;

  for (const group of groups) {
    if (fitsUserPreferences(group, preferences)) {
      matchingGroups++;
    }
  }

  return Math.round((matchingGroups / groups.length) * 100);
};

const findBestSchedule = (
  courses: ExtendedCourse[],
  preferences: WeekPreferences,
  currentSchedule: ExtendedGroup[] = [],
  courseIndex = 0,
): ScheduleResult | null => {
  if (courseIndex >= courses.length) {
    return {
      groups: [...currentSchedule],
      score: calculateScore(currentSchedule, preferences),
    };
  }

  let bestSchedule: ScheduleResult | null = null;
  const currentCourse = courses[courseIndex];

  const availableGroups = currentCourse.groups.filter(
    (group) => group.spotsTotal === 0 || group.spotsOccupied < group.spotsTotal,
  );

  if (availableGroups.length === 0) {
    return findBestSchedule(
      courses,
      preferences,
      currentSchedule,
      courseIndex + 1,
    );
  }

  for (const group of availableGroups) {
    const conflictingGroupIndex = currentSchedule.findIndex((existingGroup) =>
      hasTimeConflict(group, existingGroup),
    );

    const newSchedule = [...currentSchedule];

    if (conflictingGroupIndex === -1) {
      newSchedule.push(group);
    } else {
      const existingGroup = currentSchedule[conflictingGroupIndex];

      const newGroupFitsPrefs = fitsUserPreferences(group, preferences);
      const existingGroupFitsPrefs = fitsUserPreferences(
        existingGroup,
        preferences,
      );

      let shouldReplace = false;

      if (newGroupFitsPrefs && !existingGroupFitsPrefs) {
        shouldReplace = true;
      } else if (newGroupFitsPrefs === existingGroupFitsPrefs) {
        const newRating =
          typeof group.averageRating === "string"
            ? Number.parseFloat(group.averageRating)
            : group.averageRating;
        const existingRating =
          typeof existingGroup.averageRating === "string"
            ? Number.parseFloat(existingGroup.averageRating)
            : existingGroup.averageRating;
        shouldReplace = newRating > existingRating;
      }

      if (shouldReplace) {
        newSchedule[conflictingGroupIndex] = group;
      } else {
        continue;
      }
    }

    const result = findBestSchedule(
      courses,
      preferences,
      newSchedule,
      courseIndex + 1,
    );

    if (
      result !== null &&
      (bestSchedule === null || result.score > bestSchedule.score)
    ) {
      bestSchedule = result;
    }
  }

  const resultWithoutCourse = findBestSchedule(
    courses,
    preferences,
    currentSchedule,
    courseIndex + 1,
  );

  if (
    resultWithoutCourse !== null &&
    (bestSchedule === null || resultWithoutCourse.score > bestSchedule.score)
  ) {
    bestSchedule = resultWithoutCourse;
  }

  return bestSchedule;
};

export const createScheduleBasedOnCoursesAndPreferences = (
  userPreferences: WeekPreferences,
  availableCourses: ExtendedCourse[],
) => {
  const coursesWithGroups = availableCourses.filter(
    (course) => course.groups.length > 0,
  );

  if (coursesWithGroups.length === 0) {
    return {
      success: false,
      message: "Brak dostępnych kursów z grupami",
      userPreferences,
      availableCourses,
    };
  }

  const bestSchedule = findBestSchedule(coursesWithGroups, userPreferences);

  if (bestSchedule === null || bestSchedule.groups.length === 0) {
    return {
      success: false,
      message: "Nie udało się wygenerować planu - sprawdź dostępność grup",
      userPreferences,
      availableCourses,
    };
  }

  const score = Math.round(
    (bestSchedule.groups.length / availableCourses.length) * 100,
  );
  bestSchedule.score = score;

  const isSuccess = bestSchedule.score > 0;
  const message = isSuccess
    ? `Plan wygenerowany z ${String(bestSchedule.score)}% dopasowaniem do preferencji`
    : "Plan wygenerowany, ale żadna grupa nie pasuje do Twoich preferencji czasowych";

  return {
    success: isSuccess,
    schedule: bestSchedule.groups,
    score: bestSchedule.score,
    message,
    userPreferences,
    availableCourses,
  };
};
