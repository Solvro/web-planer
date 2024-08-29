export type GetUserRegistrations = TypeholeRootWrapper[];
interface TypeholeRootWrapper {
  id: string;
  description: Description;
  message: Description;
  type: string;
  status: string;
  is_linkage_required: boolean;
  www_instance: string;
  faculty: Faculty;
  rounds: Round[];
  related_courses: Relatedcourse[];
}
interface Relatedcourse {
  course_id: string;
  term_id: string;
  status: string;
  limits: null;
}
interface Round {
  id: string;
  name: Description;
  status: string;
  registration_mode: string;
  start_date: string;
  end_date: string;
}
interface Faculty {
  id: string;
  name: Description;
}
interface Description {
  pl: string;
  en: string;
}
