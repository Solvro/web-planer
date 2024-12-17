export interface GetProfile {
  id: string;
  last_name: string;
  first_name: string;
  student_status: number;
  staff_status: number;
  homepage_url: null;
  sex: string;
  email: null;
  student_number: string;
  photo_urls: Photourls;
}
interface Photourls {
  "50x50": string;
}
