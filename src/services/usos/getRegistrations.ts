export type GetRegistrations = Registration[];
export interface Registration {
  id: string;
  description: Description;
  message: Description;
  type: Type;
  status: RegistrationStatus;
  is_linkage_required: boolean;
  www_instance: WWWInstance;
  related_courses: RelatedCourse[];
}

export interface Description {
  pl: string;
  en: string;
}

export interface RelatedCourse {
  course_id: string;
  term_id: TermID;
  status: RelatedCourseStatus;
  limits: null;
}

export enum RelatedCourseStatus {
  RegisterAndUnregister = "register_and_unregister",
}

export enum TermID {
  The202425Z = "2024/25-Z",
}

export enum RegistrationStatus {
  Active = "active",
  Prepared = "prepared",
}

export enum Type {
  NotToken = "not_token",
}

export enum WWWInstance {
  PwrWWW = "PWR_WWW",
}
