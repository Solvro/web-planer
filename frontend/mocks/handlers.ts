import { HttpResponse, http } from "msw";

export const handlers = [
  http.get("http://localhost:3333/api/departments", () => {
    return new HttpResponse(null, { status: 500 });
  }),
  http.get("http://localhost:3333/api/departments/W1/registrations", () => {
    return new HttpResponse(null, { status: 500 });
  }),
  http.get(
    "http://localhost:3333/api/departments/W1/registrations/W04-CBE-SM-1-24L/courses",
    () => {
      return new HttpResponse(null, { status: 500 });
    },
  ),
  http.delete("http://localhost:3333/api/user/schedules/123", () => {
    return new HttpResponse(null, { status: 500 });
  }),
];

export const departmentHandler = http.get(
  "http://localhost:3333/api/departments",
  () => {
    return HttpResponse.json([
      { id: "W1", name: "W1" },
      { id: "W2", name: "Wydział Budownictwa Lądowego i Wodnego" },
      { id: "W3", name: "Wydział Chemiczny" },
      { id: "W4", name: "Wydział Elektroniki" },
      { id: "W5", name: "Wydział Informatyki i Zarządzania" },
      { id: "W6", name: "Wydział Geoinżynierii, Górnictwa i Geologii" },
      { id: "W7", name: "Wydział Inżynierii Środowiska" },
      { id: "W8", name: "Wydział Mechaniczny" },
      { id: "W9", name: "Wydział Mechaniczno-Energetyczny" },
      { id: "W10", name: "Wydział Elektryczny" },
      { id: "W11", name: "Wydział Podstawowych Problemów Techniki" },
      { id: "W12", name: "Wydział Microsystem Electronics and Photonics" },
    ]);
  },
);

export const registrationsHandler = http.get(
  "http://localhost:3333/api/departments/W1/registrations",
  () => {
    return HttpResponse.json([
      {
        id: "W04-CBE-SM-1-24L",
        name: "test rejestracja 1",
        departmentId: "W1",
        round: null,
        createdAt: "2025-07-24T16:18:55.601+00:00",
        updatedAt: "2025-07-24T16:18:55.601+00:00",
        isActive: true,
      },
      {
        id: "W04-CBE-SM-3-24L",
        name: "test rejestracja 2",
        departmentId: "W1",
        round: null,
        createdAt: "2025-07-24T16:18:55.602+00:00",
        updatedAt: "2025-07-24T16:18:55.602+00:00",
        isActive: true,
      },
    ]);
  },
);
