"use client";

import { createContext, useContext, useState } from "react";

interface ShareContextType {
  isDialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  setIsDialogOpen: (value: boolean) => void;
}

const ShareContext = createContext<ShareContextType | undefined>(undefined);

export function ShareProvider({ children }: { children: React.ReactNode }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <ShareContext.Provider
      value={{ isDialogOpen, openDialog, closeDialog, setIsDialogOpen }}
    >
      {children}
    </ShareContext.Provider>
  );
}

export const useShare = () => {
  const context = useContext(ShareContext);
  if (context === undefined) {
    throw new Error("useShare must be used within a ShareProvider");
  }
  return context;
};
