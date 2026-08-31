export type AlertType = "info" | "warning" | "critical";

export interface Alert {
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

const ALERTS_ENDPOINT = "https://alerts.solvro.pl/api/v1/alerts/";

export async function fetchAlerts(appCode: string): Promise<Alert[]> {
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
