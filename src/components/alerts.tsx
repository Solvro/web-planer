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
  "blockquote",
  "br",
  "code",
  "del",
  "div",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "li",
  "ol",
  "p",
  "pre",
  "s",
  "span",
  "strong",
  "sub",
  "sup",
  "u",
  "ul",
];
const ALLOWED_ATTR = ["href", "title", "target"];

type AlertType = "info" | "warning" | "critical";

interface Alert {
  id: string;
  title: string;
  content: string;
  alert_type: AlertType;
  link: string;
  open_in_new_tab: boolean;
  is_global: boolean;
  is_dismissable: boolean;
  start_at: string | null;
  end_at: string | null;
}

interface AlertsProps {
  className?: string;
  variant?: "banner" | "pill";
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

async function fetchAlerts(appCode: string): Promise<Alert[]> {
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
  const data = (await response.json()) as Alert[];
  return Array.isArray(data) ? data : [];
}

const VARIANT_STYLES: Record<
  AlertType,
  {
    container: string;
    pillContainer: string;
    pillText: string;
    pillSeparator: string;
    icon: typeof Info;
    iconClass: string;
  }
> = {
  info: {
    container:
      "border-blue-300 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-100",
    pillContainer:
      "border-blue-400/60 bg-blue-50/30 dark:border-blue-400/50 dark:bg-blue-950/20 backdrop-blur-md",
    pillText: "text-blue-900 dark:text-blue-100",
    pillSeparator: "bg-blue-400/40",
    icon: Info,
    iconClass: "text-blue-600 dark:text-blue-300",
  },
  warning: {
    container:
      "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-100",
    pillContainer:
      "border-amber-400/60 bg-amber-50/30 dark:border-amber-400/40 dark:bg-amber-950/20 backdrop-blur-md",
    pillText: "text-amber-900 dark:text-amber-100",
    pillSeparator: "bg-amber-400/40",
    icon: AlertTriangle,
    iconClass: "text-amber-600 dark:text-amber-300",
  },
  critical: {
    container:
      "border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/60 dark:text-red-100",
    pillContainer:
      "border-red-400/60 bg-red-50/30 dark:border-red-400/50 dark:bg-red-950/20 backdrop-blur-md",
    pillText: "text-red-900 dark:text-red-100",
    pillSeparator: "bg-red-400/50",
    icon: AlertCircle,
    iconClass: "text-red-600 dark:text-red-300",
  },
};

export function Alerts({ className, variant = "banner" }: AlertsProps = {}) {
  const appCode = env.NEXT_PUBLIC_ALERTS_APP_CODE;
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-you-might-not-need-an-effect/no-initialize-state
    setDismissed(readDismissed());
    // eslint-disable-next-line react-you-might-not-need-an-effect/no-initialize-state
    setHydrated(true);
  }, []);

  const { data } = useQuery({
    queryKey: ["solvro-alerts", appCode],
    queryFn: async () => fetchAlerts(appCode),
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
    <div
      className={cn(
        variant === "pill"
          ? "flex w-full flex-col items-center gap-2"
          : "flex w-full flex-col gap-2 px-3 py-1",
        className,
      )}
    >
      {visible.map((alert) => {
        const styles = VARIANT_STYLES[alert.alert_type];
        const Icon = styles.icon;
        const hasLink = alert.link !== "";

        if (variant === "pill") {
          const sanitizedPill = sanitize(alert.content, {
            ALLOWED_TAGS,
            ALLOWED_ATTR,
          });
          const hasTitle = alert.title.trim() !== "";
          const hasContent = sanitizedPill.trim() !== "";

          const pillInner = (
            <div
              className={cn(
                "group relative mx-auto flex w-fit max-w-[min(40rem,90vw)] flex-row items-start gap-2.5 rounded-lg border px-3 py-2 text-sm shadow-sm backdrop-blur-md transition-shadow duration-500 ease-out",
                styles.pillContainer,
                hasLink && "cursor-pointer",
              )}
            >
              <Icon
                className={cn("mt-0.5 size-4 shrink-0", styles.iconClass)}
                aria-hidden="true"
              />
              <div
                className={cn(
                  "min-w-0 flex-1 text-balance leading-snug",
                  styles.pillText,
                )}
              >
                {hasTitle ? (
                  <p className="font-semibold leading-tight">{alert.title}</p>
                ) : null}
                {hasContent ? (
                  <div
                    className="alert-content prose prose-sm max-w-none dark:prose-invert prose-headings:my-1 prose-headings:text-current prose-p:my-0 prose-p:text-current prose-a:text-current prose-blockquote:text-current prose-strong:text-current prose-em:text-current prose-code:text-current prose-li:text-current"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: sanitizedPill }}
                  />
                ) : null}
              </div>
              {alert.is_dismissable ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    handleDismiss(alert.id);
                  }}
                  className={cn(
                    "-mr-1 ml-1 rounded p-0.5 opacity-70 transition-opacity hover:opacity-100",
                    styles.pillText,
                  )}
                  aria-label="Zamknij powiadomienie"
                >
                  <X className="size-3.5" />
                </button>
              ) : null}
            </div>
          );

          if (hasLink) {
            return (
              <a
                key={alert.id}
                href={alert.link}
                target={alert.open_in_new_tab ? "_blank" : undefined}
                rel={alert.open_in_new_tab ? "noopener noreferrer" : undefined}
                className="block no-underline"
              >
                {pillInner}
              </a>
            );
          }

          return <div key={alert.id}>{pillInner}</div>;
        }

        const sanitized = sanitize(alert.content, {
          ALLOWED_TAGS,
          ALLOWED_ATTR,
        });

        const inner = (
          <div
            className={cn(
              "flex items-start gap-3 rounded-md border px-4 py-3 text-sm shadow-sm",
              styles.container,
              hasLink && "transition-colors",
            )}
          >
            <Icon
              className={cn("mt-0.5 size-5 shrink-0", styles.iconClass)}
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              {alert.title !== "" && (
                <p className="font-semibold leading-tight">{alert.title}</p>
              )}
              <div
                className="alert-content prose prose-sm max-w-none dark:prose-invert prose-headings:text-current prose-p:text-current prose-a:text-current prose-blockquote:text-current prose-strong:text-current prose-em:text-current prose-code:text-current prose-li:text-current"
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
                className="-mr-1 ml-2 rounded p-1 opacity-70 transition-opacity hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10"
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
              target={alert.open_in_new_tab ? "_blank" : undefined}
              rel={alert.open_in_new_tab ? "noopener noreferrer" : undefined}
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
