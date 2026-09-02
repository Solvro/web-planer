import type {
  ExtendedCourse,
  ExtendedGroup,
  Registration,
  StoredPlan,
} from "@/types";

type PlanUpdate = (plan: StoredPlan) => StoredPlan;

const uniqueById = <T extends { id: string }>(items: T[]): T[] => {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
};

/** Applies a user edit: the plan becomes dirty and its revision advances. */
const edit =
  (patch: (plan: StoredPlan) => Partial<StoredPlan>): PlanUpdate =>
  (plan) => ({
    ...plan,
    ...patch(plan),
    synced: false,
    revision: plan.revision + 1,
  });

export const planUpdates = {
  changeName: (name: string): PlanUpdate => edit(() => ({ name })),

  selectCourse: (courseId: string, isChecked?: boolean): PlanUpdate =>
    edit((plan) => ({
      courses: plan.courses.map((course) =>
        course.id === courseId
          ? { ...course, isChecked: isChecked ?? !course.isChecked }
          : course,
      ),
    })),

  /** Toggles every slot of the group the clicked slot belongs to. */
  selectGroup:
    (groupId: string, isChecked?: boolean): PlanUpdate =>
    (plan) => {
      const clicked = plan.courses
        .flatMap((course) => course.groups)
        .find((group) => group.groupId === groupId);
      if (clicked === undefined) {
        return plan;
      }
      return edit((current) => ({
        courses: current.courses.map((course) => ({
          ...course,
          groups: course.groups.map((group) =>
            group.groupOnlineId === clicked.groupOnlineId
              ? { ...group, isChecked: isChecked ?? !group.isChecked }
              : group,
          ),
        })),
      }))(plan);
    },

  addRegistration: (
    registration: Registration,
    courses: ExtendedCourse[],
  ): PlanUpdate =>
    edit((plan) => ({
      registrations: uniqueById([...plan.registrations, registration]),
      courses: uniqueById([...plan.courses, ...courses]),
      toCreate: false,
    })),

  removeRegistration: (registrationId: string): PlanUpdate =>
    edit((plan) => ({
      registrations: plan.registrations.filter((r) => r.id !== registrationId),
      courses: plan.courses.filter((c) => c.registrationId !== registrationId),
    })),

  /** Replaces the selection with the given groups (used by the automatic planner). */
  replaceSelection: (selectedGroupOnlineIds: Set<string>): PlanUpdate =>
    edit((plan) => ({
      courses: plan.courses.map((course) => ({
        ...course,
        groups: course.groups.map((group) => ({
          ...group,
          isChecked: selectedGroupOnlineIds.has(group.groupOnlineId),
        })),
      })),
    })),

  /** Sharing touches the online timestamp, so record it to avoid a false conflict. */
  setSharedId:
    (sharedId: string | null, updatedAt: string): PlanUpdate =>
    (plan) => ({ ...plan, sharedId, updatedAt }),

  /** Online copy created; the plan is in sync only if nothing changed meanwhile. */
  markCreatedOnline:
    (onlineId: string, updatedAt: string, sentRevision: number): PlanUpdate =>
    (plan) => ({
      ...plan,
      onlineId,
      updatedAt,
      synced: plan.revision === sentRevision,
    }),

  /** Push finished; keep the dirty flag when edits happened during the request. */
  markPushed:
    (updatedAt: string, sentRevision: number): PlanUpdate =>
    (plan) =>
      plan.revision === sentRevision
        ? { ...plan, synced: true, updatedAt }
        : plan,

  /** Replaces local content with the online version. */
  applyOnlinePlan:
    (online: {
      name: string;
      registrations: Registration[];
      courses: ExtendedCourse[];
      updatedAt: string;
    }): PlanUpdate =>
    (plan) => ({
      ...plan,
      name: online.name,
      registrations: online.registrations,
      courses: online.courses,
      updatedAt: online.updatedAt,
      synced: true,
      toCreate: false,
    }),

  /**
   * Refreshes non-user data (spots, ratings, meeting dates) of existing groups
   * without touching the selection. Returns the same object when nothing changed.
   */
  refreshGroups:
    (fresh: Map<string, Partial<ExtendedGroup>>): PlanUpdate =>
    (plan) => {
      const courses = plan.courses.map((course) => {
        const groups = course.groups.map((group) => {
          const patch = fresh.get(group.groupOnlineId);
          return patch === undefined || isSubsetEqual(group, patch)
            ? group
            : { ...group, ...patch };
        });
        return groups.some((group, index) => group !== course.groups[index])
          ? { ...course, groups }
          : course;
      });
      return courses.some((course, index) => course !== plan.courses[index])
        ? { ...plan, courses }
        : plan;
    },
};

function isSubsetEqual(
  group: ExtendedGroup,
  patch: Partial<ExtendedGroup>,
): boolean {
  for (const key of Object.keys(patch) as (keyof ExtendedGroup)[]) {
    const next = patch[key];
    const current = group[key];
    if (Array.isArray(next) && Array.isArray(current)) {
      if (
        next.length !== current.length ||
        next.some((value, index) => value !== current[index])
      ) {
        return false;
      }
      continue;
    }
    if (next !== current) {
      return false;
    }
  }
  return true;
}
