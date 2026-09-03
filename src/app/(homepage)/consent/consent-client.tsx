"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import SolvroLogoColor from "@/../public/assets/logo/logo_solvro_color.png";
import BgImage from "@/../public/assets/planer-bg.png";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

interface OAuthClientPublic {
  client_name?: string;
}

export function ConsentClient() {
  const searchParameters = useSearchParams();
  const clientId = searchParameters.get("client_id") ?? "";
  const scope = searchParameters.get("scope") ?? "";
  const requestedScopes = scope.length > 0 ? scope.split(" ") : [];

  const [client, setClient] = useState<OAuthClientPublic | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  useEffect(() => {
    if (clientId === "") {
      return;
    }
    void authClient.oauth2
      .getClient({ query: { client_id: clientId } })
      .then((result: { data: unknown }) => {
        setClient(result.data as OAuthClientPublic | null);
      });
  }, [clientId]);

  const respond = async (accept: boolean) => {
    setStatus("loading");
    const { error } = await authClient.oauth2.consent({
      accept,
      scope: accept ? scope : undefined,
    });
    setStatus(error == null ? "done" : "error");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 pt-20 pb-20 sm:items-center sm:px-6 sm:pt-0 sm:pb-0">
      <Image
        src={BgImage}
        alt="bg img"
        unoptimized
        className="absolute inset-0 top-0 left-0 -z-10 h-full w-full opacity-30"
      />
      <div className="flex w-full max-w-md flex-col">
        <Link
          href="/"
          className="flex items-center gap-2 py-3 text-xs hover:underline"
        >
          <Icons.ArrowBack className="size-4" /> Powrót do strony głównej
        </Link>
        <div className="bg-background flex w-full flex-col items-center gap-4 rounded-lg p-5 py-9 text-center">
          <Image
            src={SolvroLogoColor}
            alt="Planer Solvro"
            className="h-10 w-auto"
          />

          {status === "done" ? (
            <p className="text-sm">
              Możesz teraz wrócić do swojego agenta — dostęp został przyznany.
            </p>
          ) : (
            <>
              <h1 className="text-lg font-semibold text-balance">
                {client?.client_name ?? "Aplikacja"} prosi o dostęp do Twojego
                konta Planer
              </h1>
              {requestedScopes.length > 0 && (
                <ul className="text-muted-foreground w-full list-outside list-disc pl-5 text-left text-sm">
                  {requestedScopes.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              )}
              <div className="flex w-full gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  disabled={status === "loading"}
                  onClick={() => {
                    void respond(false);
                  }}
                >
                  Odmów
                </Button>
                <Button
                  className="flex-1"
                  disabled={status === "loading"}
                  onClick={() => {
                    void respond(true);
                  }}
                >
                  Zezwól
                </Button>
              </div>
              {status === "error" && (
                <p className="text-destructive text-sm">
                  Nie udało się zapisać decyzji. Spróbuj ponownie.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
