import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { getSession } from "@/lib/session";
import { getItems } from "@/actions";

export default async function Home() {
  const session = await getSession();
  const isAuthenticated = Boolean(session);

  const items = isAuthenticated ? await getItems() : [];

  return (
    <DashboardClient
      isAuthenticated={isAuthenticated}
      initialItems={items}
    />
  );
}
