"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";
import { useState } from "react";
import { toast } from "sonner";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { parseUserAgent } from "@/lib/utils/parse-user-agent";

const SESSIONS_QUERY_KEY = ["auth-sessions"];

interface SessionRow {
  id: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  userId: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

async function fetchSessions(): Promise<SessionRow[]> {
  const { data, error } = await authClient.listSessions();
  if (error != null) {
    throw new Error(error.message ?? "Nie udało się pobrać sesji");
  }
  return data;
}

function SessionRowItem({
  session,
  isCurrent,
  onRevoke,
  isRevoking,
}: {
  session: SessionRow;
  isCurrent: boolean;
  onRevoke: () => void;
  isRevoking: boolean;
}) {
  const { browser, os, isMobile } = parseUserAgent(session.userAgent);
  const DeviceIcon = isMobile ? Icons.Smartphone : Icons.Monitor;

  return (
    <div className="flex items-center gap-3 rounded-md border p-3">
      <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-full">
        <DeviceIcon className="text-muted-foreground size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {browser} · {os}
        </p>
        <p className="text-muted-foreground truncate text-xs">
          {session.ipAddress ?? "Nieznany adres IP"} · aktywna{" "}
          {formatDistanceToNow(new Date(session.updatedAt), {
            addSuffix: true,
            locale: pl,
          })}
        </p>
      </div>
      {isCurrent ? (
        <span className="bg-status-ready/15 text-status-ready shrink-0 rounded-full px-2 py-0.5 text-xs font-medium">
          To urządzenie
        </span>
      ) : (
        <Button
          size="sm"
          variant="outline"
          className="shrink-0"
          disabled={isRevoking}
          onClick={onRevoke}
        >
          {isRevoking ? <Icons.Loader className="size-4 animate-spin" /> : null}
          Wyloguj
        </Button>
      )}
    </div>
  );
}

function SessionsSection() {
  const session = useSession();
  const queryClient = useQueryClient();
  const currentToken = session.data?.session.token;

  const sessionsQuery = useQuery({
    queryKey: SESSIONS_QUERY_KEY,
    queryFn: fetchSessions,
  });

  const revokeMutation = useMutation({
    mutationFn: async (token: string) => {
      const { error } = await authClient.revokeSession({ token });
      if (error != null) {
        throw new Error(error.message ?? "Nie udało się wylogować urządzenia");
      }
    },
    onSuccess: async () => {
      toast.success("Wylogowano urządzenie");
      await queryClient.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const revokeOthersMutation = useMutation({
    mutationFn: async () => {
      const { error } = await authClient.revokeOtherSessions();
      if (error != null) {
        throw new Error(
          error.message ?? "Nie udało się wylogować pozostałych urządzeń",
        );
      }
    },
    onSuccess: async () => {
      toast.success("Wylogowano wszystkie pozostałe urządzenia");
      await queryClient.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const otherSessionsCount =
    sessionsQuery.data?.filter((item) => item.token !== currentToken).length ??
    0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-medium">Aktywne sesje</h3>
          <p className="text-muted-foreground text-sm">
            Urządzenia, na których jesteś obecnie zalogowany.
          </p>
        </div>
        {otherSessionsCount > 0 ? (
          <Button
            size="sm"
            variant="outline"
            disabled={revokeOthersMutation.isPending}
            onClick={() => {
              revokeOthersMutation.mutate();
            }}
          >
            {revokeOthersMutation.isPending ? (
              <Icons.Loader className="size-4 animate-spin" />
            ) : null}
            Wyloguj pozostałe
          </Button>
        ) : null}
      </div>
      <div className="space-y-2">
        {sessionsQuery.isPending ? (
          <>
            <Skeleton className="h-16 w-full rounded-md" />
            <Skeleton className="h-16 w-full rounded-md" />
          </>
        ) : sessionsQuery.isError ? (
          <p className="text-status-collision text-sm">
            {sessionsQuery.error.message}
          </p>
        ) : (
          sessionsQuery.data
            .toSorted((a, b) =>
              a.token === currentToken ? -1 : b.token === currentToken ? 1 : 0,
            )
            .map((item) => (
              <SessionRowItem
                key={item.token}
                session={item}
                isCurrent={item.token === currentToken}
                isRevoking={
                  revokeMutation.isPending
                    ? revokeMutation.variables === item.token
                    : false
                }
                onRevoke={() => {
                  revokeMutation.mutate(item.token);
                }}
              />
            ))
        )}
      </div>
    </div>
  );
}

function PasskeysSection() {
  const passkeys = authClient.useListPasskeys();
  const [isAddingName, setIsAddingName] = useState(false);
  const [name, setName] = useState("");

  const addMutation = useMutation({
    mutationFn: async (passkeyName: string) => {
      const { error } = await authClient.passkey.addPasskey({
        name: passkeyName.trim() === "" ? undefined : passkeyName.trim(),
      });
      if (error != null) {
        throw new Error(error.message ?? "Nie udało się dodać klucza dostępu");
      }
    },
    onSuccess: () => {
      toast.success("Dodano klucz dostępu");
      setIsAddingName(false);
      setName("");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await authClient.passkey.deletePasskey({ id });
      if (error != null) {
        throw new Error(error.message ?? "Nie udało się usunąć klucza dostępu");
      }
    },
    onSuccess: () => {
      toast.success("Usunięto klucz dostępu");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Klucze dostępu</h3>
        <p className="text-muted-foreground text-sm">
          Loguj się odciskiem palca, Face ID albo kluczem sprzętowym, bez hasła.
        </p>
      </div>
      <div className="space-y-2">
        {passkeys.isPending ? (
          <Skeleton className="h-14 w-full rounded-md" />
        ) : passkeys.error == null ? (
          passkeys.data == null || passkeys.data.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Nie masz jeszcze żadnego klucza dostępu.
            </p>
          ) : (
            passkeys.data.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-md border p-3"
              >
                <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-full">
                  <Icons.KeyRound className="text-muted-foreground size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {item.name == null || item.name === ""
                      ? "Klucz dostępu"
                      : item.name}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    Dodano{" "}
                    {formatDistanceToNow(new Date(item.createdAt), {
                      addSuffix: true,
                      locale: pl,
                    })}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0"
                  disabled={
                    deleteMutation.isPending
                      ? deleteMutation.variables === item.id
                      : false
                  }
                  onClick={() => {
                    deleteMutation.mutate(item.id);
                  }}
                >
                  {deleteMutation.isPending &&
                  deleteMutation.variables === item.id ? (
                    <Icons.Loader className="size-4 animate-spin" />
                  ) : (
                    <Icons.Trash className="size-4" />
                  )}
                </Button>
              </div>
            ))
          )
        ) : (
          <p className="text-status-collision text-sm">
            Nie udało się pobrać kluczy dostępu.
          </p>
        )}
      </div>
      {isAddingName ? (
        <form
          className="flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            addMutation.mutate(name);
          }}
        >
          <Input
            placeholder="np. MacBook Kamila"
            value={name}
            onChange={(event) => {
              setName(event.currentTarget.value);
            }}
            disabled={addMutation.isPending}
          />
          <Button
            type="submit"
            size="sm"
            className="shrink-0"
            disabled={addMutation.isPending}
          >
            {addMutation.isPending ? (
              <Icons.Loader className="size-4 animate-spin" />
            ) : null}
            Zapisz
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="shrink-0"
            disabled={addMutation.isPending}
            onClick={() => {
              setIsAddingName(false);
              setName("");
            }}
          >
            Anuluj
          </Button>
        </form>
      ) : (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setIsAddingName(true);
          }}
        >
          <Icons.Plus className="size-4" />
          Dodaj klucz dostępu
        </Button>
      )}
    </div>
  );
}

export function SecurityContent({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-8", className)}>
      <SessionsSection />
      <Separator />
      <PasskeysSection />
    </div>
  );
}
