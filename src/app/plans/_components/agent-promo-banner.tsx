"use client";

import { useAtom, useSetAtom } from "jotai";

import {
  agentPromoDismissedAtom,
  settingsDialogAtom,
} from "@/atoms/settings-dialog";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function AgentPromoBanner() {
  const setSettings = useSetAtom(settingsDialogAtom);
  const [dismissed, setDismissed] = useAtom(agentPromoDismissedAtom);

  if (dismissed) {
    return null;
  }

  return (
    <div className="border-primary/20 bg-background fixed right-4 bottom-4 z-40 w-64 rounded-2xl border p-4 shadow-lg">
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-1 right-1 size-6"
        aria-label="Zamknij"
        onClick={() => {
          setDismissed(true);
        }}
      >
        <Icons.X className="size-3.5" />
      </Button>
      <Icons.Sparkles className="text-primary size-5" />
      <p className="mt-2 text-sm font-semibold">Ułóż plan razem z agentem AI</p>
      <p className="text-muted-foreground mt-1 text-xs">
        Połącz Claude lub inne narzędzie AI z Planerem przez MCP.
      </p>
      <Button
        variant="secondary"
        size="sm"
        className="mt-3 w-full"
        onClick={() => {
          setSettings({ open: true, tab: "mcp" });
        }}
      >
        Jak połączyć
      </Button>
    </div>
  );
}
