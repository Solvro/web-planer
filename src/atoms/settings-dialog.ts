import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import type { SettingsTab } from "@/components/settings-dialog";

export const settingsDialogAtom = atom<{
  open: boolean;
  tab: SettingsTab;
}>({ open: false, tab: "profile" });

export const agentPromoDismissedAtom = atomWithStorage(
  "agentPromoDismissed",
  false,
);
