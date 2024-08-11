export interface GetCoursesEditions {
	course_id?: string;
	course_name?: Coursename;
	term_id?: string;
	user_groups?: Usergroup[];
	course_units_ids?: string[];
	attributes?: unknown[];
}
interface Usergroup {
	course_unit_id: string;
	group_number: number;
	class_type: Coursename;
	class_type_id: string;
	group_url: null;
	course_id: string;
	course_name: Coursename;
	course_homepage_url: null;
	course_profile_url: string;
	course_is_currently_conducted: number;
	course_fac_id: string;
	course_lang_id: string;
	term_id: string;
	lecturers: Lecturer[];
	participants: Lecturer[];
}
interface Lecturer {
	id: string;
	first_name: string;
	last_name: string;
}
interface Coursename {
	pl: string;
	en: string;
}
