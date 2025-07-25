import { HttpResponse, http } from "msw";

import { mockFaculties, mockRegistrations, newPlan } from "./mock-data";

const NEXT_PUBLIC_API_URL = "http://localhost:3333";

export const handlers = [
  http.get(`${NEXT_PUBLIC_API_URL}/user/schedules/:id`, () => {
    return Response.json({
      newPlan,
    });
  }),

  http.get(`${NEXT_PUBLIC_API_URL}/departments`, () => {
    return Response.json(mockFaculties);
  }),

  http.get(`${NEXT_PUBLIC_API_URL}/departments/:faculty/registrations`, () => {
    return HttpResponse.json(mockRegistrations);
  }),
];

export const respond_with_404 = http.get(
  `${NEXT_PUBLIC_API_URL}/user/schedules/:id`,
  () => {
    return new HttpResponse(null, { status: 404 });
  },
);
