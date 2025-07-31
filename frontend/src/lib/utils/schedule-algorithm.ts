interface TimeSlot {
  start: string;
  end: string;
}

interface WeekPreferences {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday?: TimeSlot[];
  sunday?: TimeSlot[];
}

interface CourseGroup {
  groupId: string;
  day: keyof WeekPreferences;
  hours: TimeSlot;
  lecturer?: string;
  room?: string;
}

interface Course {
  courseId: string;
  courseName: string;
  groups: CourseGroup[];
}

const dummyUserPreferences: WeekPreferences = {
  monday: [
    { start: "9:00", end: "11:00" },
    { start: "14:00", end: "19:00" },
  ],
  tuesday: [{ start: "11:00", end: "20:00" }],
  wednesday: [
    { start: "8:00", end: "12:00" },
    { start: "15:00", end: "18:00" },
  ],
  thursday: [{ start: "10:00", end: "16:00" }],
  friday: [{ start: "9:00", end: "13:00" }],
};

const dummyCourses: Course[] = [
  {
    courseId: "MATH101",
    courseName: "Advanced Mathematics",
    groups: [
      {
        groupId: "MATH101_G1",
        day: "monday",
        hours: { start: "9:00", end: "11:00" },
        lecturer: "Dr. Smith",
        room: "A101",
      },
      {
        groupId: "MATH101_G2",
        day: "tuesday",
        hours: { start: "14:00", end: "16:00" },
        lecturer: "Dr. Smith",
        room: "A102",
      },
      {
        groupId: "MATH101_G3",
        day: "wednesday",
        hours: { start: "16:00", end: "18:00" },
        lecturer: "Prof. Johnson",
        room: "B201",
      },
    ],
  },
  {
    courseId: "CS202",
    courseName: "Data Structures",
    groups: [
      {
        groupId: "CS202_G1",
        day: "monday",
        hours: { start: "15:00", end: "17:00" },
        lecturer: "Dr. Brown",
        room: "C301",
      },
      {
        groupId: "CS202_G2",
        day: "wednesday",
        hours: { start: "9:00", end: "11:00" },
        lecturer: "Dr. Brown",
        room: "C302",
      },
      {
        groupId: "CS202_G3",
        day: "friday",
        hours: { start: "10:00", end: "12:00" },
        lecturer: "Prof. Davis",
        room: "C303",
      },
    ],
  },
  {
    courseId: "PHYS303",
    courseName: "Quantum Physics",
    groups: [
      {
        groupId: "PHYS303_G1",
        day: "tuesday",
        hours: { start: "12:00", end: "14:00" },
        lecturer: "Prof. Wilson",
        room: "D401",
      },
      {
        groupId: "PHYS303_G2",
        day: "thursday",
        hours: { start: "11:00", end: "13:00" },
        lecturer: "Prof. Wilson",
        room: "D402",
      },
      {
        groupId: "PHYS303_G3",
        day: "friday",
        hours: { start: "14:00", end: "16:00" },
        lecturer: "Dr. Taylor",
        room: "D403",
      },
    ],
  },
];

// Second dummy dataset - courses that DON'T fit user preferences well
const dummyCoursesWithPoorFit: Course[] = [
  {
    courseId: "CHEM101",
    courseName: "Organic Chemistry",
    groups: [
      {
        groupId: "CHEM101_G1",
        day: "monday",
        hours: { start: "7:00", end: "9:00" }, // Before user preference (9:00-11:00)
        lecturer: "Dr. Adams",
        room: "E101",
      },
      {
        groupId: "CHEM101_G2",
        day: "tuesday",
        hours: { start: "8:00", end: "10:00" }, // Before user preference (11:00-20:00)
        lecturer: "Dr. Adams",
        room: "E102",
      },
      {
        groupId: "CHEM101_G3",
        day: "saturday",
        hours: { start: "10:00", end: "12:00" }, // User has no Saturday preferences
        lecturer: "Prof. White",
        room: "E103",
      },
    ],
  },
  {
    courseId: "HIST202",
    courseName: "World History",
    groups: [
      {
        groupId: "HIST202_G1",
        day: "wednesday",
        hours: { start: "12:00", end: "14:00" }, // Gap between user preferences (8:00-12:00, 15:00-18:00)
        lecturer: "Prof. Green",
        room: "F201",
      },
      {
        groupId: "HIST202_G2",
        day: "thursday",
        hours: { start: "17:00", end: "19:00" }, // Partially outside user preference (10:00-16:00)
        lecturer: "Prof. Green",
        room: "F202",
      },
      {
        groupId: "HIST202_G3",
        day: "friday",
        hours: { start: "15:00", end: "17:00" }, // Outside user preference (9:00-13:00)
        lecturer: "Dr. Black",
        room: "F203",
      },
    ],
  },
  {
    courseId: "ART303",
    courseName: "Digital Art",
    groups: [
      {
        groupId: "ART303_G1",
        day: "monday",
        hours: { start: "12:00", end: "14:00" }, // Between user preferences (9:00-11:00, 14:00-19:00) - fits!
        lecturer: "Prof. Blue",
        room: "G301",
      },
      {
        groupId: "ART303_G2",
        day: "tuesday",
        hours: { start: "21:00", end: "23:00" }, // Way outside user preference (11:00-20:00)
        lecturer: "Prof. Blue",
        room: "G302",
      },
      {
        groupId: "ART303_G3",
        day: "sunday",
        hours: { start: "14:00", end: "16:00" }, // User has no Sunday preferences
        lecturer: "Dr. Purple",
        room: "G303",
      },
    ],
  },
];

interface ScheduleResult {
  groups: CourseGroup[];
  score: number;
}

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const fitsUserPreferences = (
  group: CourseGroup,
  preferences: WeekPreferences,
): boolean => {
  const dayPrefs = preferences[group.day];
  if (dayPrefs === undefined) {
    return false;
  }

  const groupStart = timeToMinutes(group.hours.start);
  const groupEnd = timeToMinutes(group.hours.end);

  return dayPrefs.some((pref) => {
    const prefStart = timeToMinutes(pref.start);
    const prefEnd = timeToMinutes(pref.end);
    return groupStart >= prefStart && groupEnd <= prefEnd;
  });
};

const hasTimeConflict = (group1: CourseGroup, group2: CourseGroup): boolean => {
  if (group1.day !== group2.day) {
    return false;
  }

  const start1 = timeToMinutes(group1.hours.start);
  const end1 = timeToMinutes(group1.hours.end);
  const start2 = timeToMinutes(group2.hours.start);
  const end2 = timeToMinutes(group2.hours.end);

  return !(end1 <= start2 || end2 <= start1);
};

const conflictsWithSelected = (
  newGroup: CourseGroup,
  selectedGroups: CourseGroup[],
): boolean => {
  return selectedGroups.some((group) => hasTimeConflict(newGroup, group));
};

const calculateScore = (
  groups: CourseGroup[],
  preferences: WeekPreferences,
): number => {
  let score = 0;

  for (const group of groups) {
    if (fitsUserPreferences(group, preferences)) {
      score += 10;
    } else {
      score -= 5;
    }
  }

  return score;
};

const findBestSchedule = (
  courses: Course[],
  preferences: WeekPreferences,
  currentSchedule: CourseGroup[] = [],
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

  for (const group of currentCourse.groups) {
    if (!conflictsWithSelected(group, currentSchedule)) {
      currentSchedule.push(group);

      const result = findBestSchedule(
        courses,
        preferences,
        currentSchedule,
        courseIndex + 1,
      );

      if (
        result !== null &&
        (bestSchedule === null || result.score > bestSchedule.score)
      ) {
        bestSchedule = result;
      }

      currentSchedule.pop();
    }
  }

  return bestSchedule;
};

export const createScheduleBasedOnCoursesAndPreferences = (
  userPreferences: WeekPreferences = dummyUserPreferences,
  availableCourses: Course[] = dummyCourses,
) => {
  const bestSchedule = findBestSchedule(availableCourses, userPreferences);

  if (bestSchedule === null) {
    return {
      success: false,
      message: "No valid schedule found",
      userPreferences,
      availableCourses,
    };
  }

  return {
    success: true,
    schedule: bestSchedule.groups,
    score: bestSchedule.score,
    userPreferences,
    availableCourses,
  };
};
