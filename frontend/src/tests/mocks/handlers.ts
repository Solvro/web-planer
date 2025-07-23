import { HttpResponse, http } from "msw";

import { newPlan } from "./plans";

const NEXT_PUBLIC_API_URL = "http://localhost:3333";

export const handlers = [
  http.get(`${NEXT_PUBLIC_API_URL}/user/schedules/:id`, () => {
    return Response.json({
      newPlan,
    });
  }),

  http.get(`${NEXT_PUBLIC_API_URL}/departments`, () => {
    return Response.json([
      {
        id: "id1",
        name: "faculty 1",
        departmentId: "dep1",
      },
      {
        id: "id2",
        name: "faculty 2",
        departmentId: "dep2",
      },
      {
        id: "id3",
        name: "faculty 3",
        departmentId: "dep2",
      },
    ]);
  }),

  http.get(
    `${NEXT_PUBLIC_API_URL}/departments/:faculty/registrations`,
    ({ params }) => {
      const { faculty } = params;
      return HttpResponse.json([
        { id: "reg1", name: "Registration 1" },
        { id: "reg2", name: "Registration 2" },
      ]);
    },
  ),
];

export const respond_with_404 = http.get(
  `${NEXT_PUBLIC_API_URL}/user/schedules/:id`,
  () => {
    return new HttpResponse(null, { status: 404 });
  },
);
