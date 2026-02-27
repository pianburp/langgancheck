import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { requireSession } from "@/lib/session";

export default async function DashboardPage() {
  await requireSession();
  return <DashboardClient />;
}
