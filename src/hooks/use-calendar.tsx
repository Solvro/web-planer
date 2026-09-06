"use client";

import { createContext, useContext, useState } from "react";

interface CalendarContextType {
  isDialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  setIsDialogOpen: (value: boolean) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined,
);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <CalendarContext.Provider
      value={{ isDialogOpen, openDialog, closeDialog, setIsDialogOpen }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export const useCalendarDialog = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
};
