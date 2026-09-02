import type { Metadata } from "next";

import { CalendarContent } from "../_components/calendar-content";

export const metadata: Metadata = {
  title: "Dodawanie do kalendarza",
};

export default function CalendarPage() {
  return <CalendarContent />;
}
