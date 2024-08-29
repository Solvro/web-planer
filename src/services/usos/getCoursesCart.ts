export type GetCoursesCart = TypeholeRootWrapper[];
interface TypeholeRootWrapper {
  course: Course;
  term: Term;
  user_registration_status: string;
  is_registration_valid: boolean;
  limits: null;
  is_linkage_required: boolean | null;
  registrations_count: number | null;
}
interface Term {
  id: string;
  name: Name;
  date_from: string;
  date_to: string;
  order_key: number;
  is_active: boolean;
}
interface Course {
  id: string;
  name: Name;
}
interface Name {
  pl: string;
  en: string;
}
