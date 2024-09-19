export type GetRegistrations = Registration[];
interface Registration {
  id: string;
  description: Description;
  message: Description;
  type: Type;
  status: RegistrationStatus;
  is_linkage_required: boolean;
  www_instance: WWWInstance;
  related_courses: RelatedCourse[];
}

interface Description {
  pl: string;
  en: string;
}

interface RelatedCourse {
  course_id: string;
  term_id: TermID;
  status: RelatedCourseStatus;
  limits: null;
}

enum RelatedCourseStatus {
  RegisterAndUnregister = "register_and_unregister",
}

enum TermID {
  The202425Z = "2024/25-Z",
}

enum RegistrationStatus {
  Active = "active",
  Prepared = "prepared",
}

enum Type {
  NotToken = "not_token",
}

enum WWWInstance {
  PwrWWW = "PWR_WWW",
}
