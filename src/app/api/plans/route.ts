import { getSession } from "@/lib/get-session";
import * as planStore from "@/lib/plan/store";

export async function GET() {
  const session = await getSession();
  if (session == null) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const plans = await planStore.listPlans(session.user.id);
  return Response.json(
    plans.toSorted((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
  );
}
