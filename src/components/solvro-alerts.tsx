"use client";

import { useQuery } from "@tanstack/react-query";
import { sanitize } from "isomorphic-dompurify";
import { AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { useEffect, useState } from "react";

import { env } from "@/env.mjs";
import { cn } from "@/lib/utils";

const ALERTS_ENDPOINT = "https://alerts.solvro.pl/api/v1/alerts/";
const STORAGE_KEY = "solvro-alerts-dismissed";
const STALE_TIME_MS = 60 * 1000;

const ALLOWED_TAGS = [
  "a",
  "b",
  "em",
  "i",
  "strong",
  "u",
  "p",
  "br",
  "ul",
  "ol",
  "li",
  "h2",
  "h3",
  "h4",
];
const ALLOWED_ATTR = ["href", "title", "target", "rel"];

type AlertType = "info" | "warning" | "critical";

interface SolvroAlert {
  id: string;
  title: string;
  content: string;
  alert_type: AlertType;
  link: string;
  is_global: boolean;
  is_dismissable: boolean;
  start_at: string | null;
  end_at: string | null;
}

interface SolvroAlertsProps {
  appCode?: string;
}

function readDismissed(): string[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((value): value is string => typeof value === "string");
  } catch {
    return [];
  }
}

function writeDismissed(ids: string[]) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore storage errors (private mode, quota, etc.)
  }
}

async function fetchAlerts(appCode: string): Promise<SolvroAlert[]> {
  const url = new URL(ALERTS_ENDPOINT);
  url.searchParams.set("app", appCode);
  const response = await fetch(url.toString());
  if (response.status === 400) {
    throw new Error(
      `Solvro Alerts: unknown app code "${appCode}". Check NEXT_PUBLIC_ALERTS_APP_CODE.`,
    );
  }
  if (!response.ok) {
    throw new Error(
      `Solvro Alerts: request failed with ${String(response.status)}`,
    );
  }
  const data = (await response.json()) as SolvroAlert[];
  return Array.isArray(data) ? data : [];
}

const VARIANT_STYLES: Record<
  AlertType,
  { container: string; icon: typeof Info; iconClass: string }
> = {
  info: {
    container:
      "border-blue-300 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-100",
    icon: Info,
    iconClass: "text-blue-600 dark:text-blue-300",
  },
  warning: {
    container:
      "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-100",
    icon: AlertTriangle,
    iconClass: "text-amber-600 dark:text-amber-300",
  },
  critical: {
    container:
      "border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/60 dark:text-red-100",
    icon: AlertCircle,
    iconClass: "text-red-600 dark:text-red-300",
  },
};

function isExternalLink(link: string): boolean {
  try {
    const url = new URL(link, window.location.origin);
    return url.origin !== window.location.origin;
  } catch {
    return false;
  }
}

export function Alerts({ appCode }: SolvroAlertsProps = {}) {
  const code = appCode ?? env.NEXT_PUBLIC_ALERTS_APP_CODE;
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-you-might-not-need-an-effect/no-initialize-state
    setDismissed(readDismissed());
    // eslint-disable-next-line react-you-might-not-need-an-effect/no-initialize-state
    setHydrated(true);
  }, []);

  const { data } = useQuery({
    queryKey: ["solvro-alerts", code],
    queryFn: async () => fetchAlerts(code),
    staleTime: STALE_TIME_MS,
    gcTime: STALE_TIME_MS,
    refetchOnWindowFocus: false,
  });

  if (!hydrated || data === undefined) {
    return null;
  }

  const dismissedSet = new Set(dismissed);
  const visible = data.filter((alert) => !dismissedSet.has(alert.id));

  if (visible.length === 0) {
    return null;
  }

  const handleDismiss = (id: string) => {
    setDismissed((previous) => {
      if (previous.includes(id)) {
        return previous;
      }
      const next = [...previous, id];
      writeDismissed(next);
      return next;
    });
  };

  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex w-full flex-col gap-2 px-3 py-2">
      {visible.map((alert) => {
        const variant = VARIANT_STYLES[alert.alert_type];
        const Icon = variant.icon;
        const hasLink = alert.link !== "";
        const external = hasLink && isExternalLink(alert.link);
        const sanitized = sanitize(alert.content, {
          ALLOWED_TAGS,
          ALLOWED_ATTR,
        });

        const inner = (
          <div
            className={cn(
              "flex items-start gap-3 rounded-md border px-4 py-3 text-sm shadow-sm",
              variant.container,
              hasLink && "transition-colors hover:brightness-105",
            )}
          >
            <Icon
              className={cn("mt-0.5 size-5 shrink-0", variant.iconClass)}
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              {alert.title !== "" && (
                <p className="font-semibold leading-tight">{alert.title}</p>
              )}
              <div
                className="solvro-alert-content text-sm leading-snug [&_a]:underline [&_a]:underline-offset-2"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: sanitized }}
              />
            </div>
            {alert.is_dismissable ? (
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleDismiss(alert.id);
                }}
                className="ml-2 rounded p-1 opacity-70 transition-opacity hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10"
                aria-label="Zamknij powiadomienie"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>
        );

        if (hasLink) {
          return (
            <a
              key={alert.id}
              href={alert.link}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="block no-underline"
            >
              {inner}
            </a>
          );
        }

        return <div key={alert.id}>{inner}</div>;
      })}
    </div>
  );
}
