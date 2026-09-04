"use client";

import { toast } from "sonner";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const mcpUrl = "https://planer.solvro.pl/api/mcp";

async function copySnippet(snippet: string) {
  await navigator.clipboard.writeText(snippet);
  toast.success("Skopiowano do schowka");
}

function CodeSnippet({ snippet }: { snippet: string }) {
  return (
    <div className="bg-muted relative rounded-md">
      <pre className="overflow-x-auto p-3 pr-10 text-xs">
        <code>{snippet}</code>
      </pre>
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-1 right-1 size-7"
        aria-label="Kopiuj"
        onClick={() => {
          void copySnippet(snippet);
        }}
      >
        <Icons.Copy className="size-3.5" />
      </Button>
    </div>
  );
}

export function McpContent() {
  return (
    <div className="mb-8 w-full space-y-6">
      <div>
        <h3 className="text-lg font-medium">Ułóż plan razem z agentem AI</h3>
        <p className="text-muted-foreground text-sm">
          Planer udostępnia serwer MCP, dzięki któremu agent może przeglądać
          rejestracje i grupy oraz dodawać je do Twojego planu poleceniami w
          naturalnym języku.
        </p>
      </div>
      <Separator />
      <div className="space-y-3">
        <Title title="Aplikacja Claude (web, desktop, mobile)" step={1} />
        <p>
          Ustawienia → Konektory → Dodaj niestandardowy konektor i wklej
          poniższy adres. Claude poprosi o zalogowanie się do Planera i
          potwierdzenie dostępu.
        </p>
        <CodeSnippet snippet={mcpUrl} />
      </div>
      <div className="space-y-3">
        <Title title="Claude Code" step={2} />
        <p>Dodaj serwer poleceniem w terminalu:</p>
        <CodeSnippet
          snippet={`claude mcp add --transport http planer ${mcpUrl}`}
        />
      </div>
      <div className="space-y-3">
        <Title title="opencode" step={3} />
        <p>
          Dodaj wpis do <code>opencode.json</code>:
        </p>
        <CodeSnippet
          snippet={JSON.stringify(
            {
              mcp: {
                planer: {
                  type: "remote",
                  url: mcpUrl,
                  enabled: true,
                },
              },
            },
            null,
            2,
          )}
        />
        <p>
          Następnie autoryzuj połączenie: <code>opencode mcp auth planer</code>
        </p>
      </div>
    </div>
  );
}

function Title({ title, step }: { title: string; step: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-primary flex size-10 items-center justify-center rounded-md text-lg font-semibold text-white">
        {step}.
      </div>
      <h1 className="text-lg font-semibold">{title}</h1>
    </div>
  );
}
