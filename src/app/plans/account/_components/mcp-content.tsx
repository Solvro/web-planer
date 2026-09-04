"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";

const mcpUrl = "https://planer.solvro.pl/api/mcp";

interface OAuthConsent {
  id: string;
  clientId: string;
  scopes: string[];
  createdAt: string;
}

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

function ConnectedApps() {
  const [consents, setConsents] = useState<OAuthConsent[] | null>(null);
  const [names, setNames] = useState<Record<string, string>>({});
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const loadNames = (items: OAuthConsent[]) => {
    for (const consent of items) {
      void authClient.oauth2
        .getClient({ query: { client_id: consent.clientId } })
        .then((result: { data: unknown }) => {
          const client = result.data as { client_name?: string } | null;
          setNames((previous) => ({
            ...previous,
            [consent.clientId]: client?.client_name ?? consent.clientId,
          }));
        })
        .catch(() => {
          setNames((previous) => ({
            ...previous,
            [consent.clientId]: consent.clientId,
          }));
        });
    }
  };

  const load = () => {
    void authClient.oauth2
      .getConsents()
      .then((result: { data: unknown }) => {
        const items = (result.data as OAuthConsent[] | null) ?? [];
        setConsents(items);
        loadNames(items);
      })
      .catch(() => {
        setConsents([]);
      });
  };

  useEffect(load, []);

  const revoke = async (consent: OAuthConsent) => {
    setRevokingId(consent.id);
    const { error } = await authClient.oauth2.deleteConsent({
      id: consent.id,
    });
    setRevokingId(null);
    if (error == null) {
      toast.success("Rozłączono aplikację");
      setConsents(
        (previous) => previous?.filter((c) => c.id !== consent.id) ?? null,
      );
    } else {
      toast.error("Nie udało się rozłączyć aplikacji");
    }
  };

  if (consents == null) {
    return (
      <p className="text-muted-foreground flex items-center gap-2 text-sm">
        <Icons.Loader className="size-4 animate-spin" />
        Sprawdzanie połączonych aplikacji…
      </p>
    );
  }

  if (consents.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Żadna aplikacja nie ma jeszcze dostępu do Twojego konta przez MCP.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {consents.map((consent) => (
        <li
          key={consent.id}
          className="flex items-center justify-between gap-3 rounded-md border p-3"
        >
          <div className="flex items-center gap-2 text-sm">
            <Icons.Check className="size-4 shrink-0 text-green-600" />
            <span className="font-medium">
              {names[consent.clientId] ?? consent.clientId}
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            disabled={revokingId === consent.id}
            onClick={() => {
              void revoke(consent);
            }}
          >
            {revokingId === consent.id ? (
              <Icons.Loader className="size-3.5 animate-spin" />
            ) : (
              <Icons.Trash className="size-3.5" />
            )}
            Rozłącz
          </Button>
        </li>
      ))}
    </ul>
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
        <h4 className="text-sm font-semibold">Połączone aplikacje</h4>
        <ConnectedApps />
      </div>

      <Separator />

      <div className="space-y-3">
        <h4 className="text-sm font-semibold">Jak połączyć</h4>
        <Tabs defaultValue="claude">
          <TabsList>
            <TabsTrigger value="claude">Claude</TabsTrigger>
            <TabsTrigger value="claude-code">Claude Code</TabsTrigger>
            <TabsTrigger value="opencode">opencode</TabsTrigger>
            <TabsTrigger value="codex">Codex</TabsTrigger>
          </TabsList>

          <TabsContent value="claude" className="space-y-3">
            <p className="text-muted-foreground text-sm">
              Dotyczy aplikacji Claude na wersji webowej, desktopowej i
              mobilnej.
            </p>
            <p className="text-sm">
              Ustawienia → Konektory → Dodaj niestandardowy konektor i wklej
              poniższy adres. Claude poprosi o zalogowanie się do Planera i
              potwierdzenie dostępu.
            </p>
            <CodeSnippet snippet={mcpUrl} />
          </TabsContent>

          <TabsContent value="claude-code" className="space-y-3">
            <p className="text-sm">Dodaj serwer poleceniem w terminalu:</p>
            <CodeSnippet
              snippet={`claude mcp add --transport http planer ${mcpUrl}`}
            />
            <p className="text-muted-foreground text-sm">
              Przy pierwszym użyciu narzędzia Claude Code poprosi o zalogowanie
              się i potwierdzenie dostępu w przeglądarce.
            </p>
          </TabsContent>

          <TabsContent value="opencode" className="space-y-3">
            <p className="text-sm">
              Najprościej przez kreator w terminalu — odpowiedz na pytania
              (nazwa serwera, typ <code>remote</code>, adres URL):
            </p>
            <CodeSnippet snippet="opencode mcp add" />
            <p className="text-muted-foreground text-sm">
              Podaj powyższy adres jako URL serwera:
            </p>
            <CodeSnippet snippet={mcpUrl} />
            <p className="text-sm">Następnie autoryzuj połączenie:</p>
            <CodeSnippet snippet="opencode mcp auth planer" />
            <p className="text-muted-foreground text-sm">
              Możesz też dodać wpis ręcznie do <code>opencode.json</code>:
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
          </TabsContent>

          <TabsContent value="codex" className="space-y-3">
            <p className="text-sm">
              Dodaj wpis do <code>~/.codex/config.toml</code>:
            </p>
            <CodeSnippet snippet={`[mcp_servers.planer]\nurl = "${mcpUrl}"`} />
            <p className="text-muted-foreground text-sm">
              Przy pierwszym użyciu Codex CLI otworzy przeglądarkę, w której
              zalogujesz się do Planera i potwierdzisz dostęp.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
