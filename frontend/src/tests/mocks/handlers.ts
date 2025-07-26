import { HttpResponse, http } from "msw";

import {
  mockCourses,
  mockFaculties,
  mockRegistrations,
  newPlan,
} from "./mock-data";

const NEXT_PUBLIC_API_URL = "http://localhost:3333";

export const handlers = [
  http.get(`${NEXT_PUBLIC_API_URL}/user/schedules/:id`, () => {
    return HttpResponse.json({
      newPlan,
    });
  }),

  http.get(`${NEXT_PUBLIC_API_URL}/departments`, () => {
    return HttpResponse.json(mockFaculties);
  }),

  http.get(`${NEXT_PUBLIC_API_URL}/departments/:faculty/registrations`, () => {
    return HttpResponse.json(mockRegistrations);
  }),
  http.get(
    `${NEXT_PUBLIC_API_URL}/departments/:faculty/registrations/:registration/courses`,
    () => {
      return HttpResponse.json(mockCourses);
    },
  ),
];
