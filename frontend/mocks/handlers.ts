import { HttpResponse, http } from "msw";

export const handlers = [
  http.get("http://localhost:3333/api/departments", () => {
    return new HttpResponse(null, { status: 500 });
  }),
  http.get("http://localhost:3333/api/departments/W1/registrations", () => {
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
