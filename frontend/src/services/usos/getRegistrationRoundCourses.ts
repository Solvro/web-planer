export type GetRegistrationRoundCourses = TypeholeRootWrapper[];
interface TypeholeRootWrapper {
  course: Course;
  term_id: string;
  status: string;
  limits: null;
  is_linkage_required: boolean;
  registrations_count: number;
}
interface Course {
  id: string;
  name: Name;
}
interface Name {
  pl: string;
  en: string;
}
