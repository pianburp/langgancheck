import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { getSession } from "@/lib/auth/session";
import { getItems, getBudget } from "@/app/actions";

export default async function Home() {
  const session = await getSession();
  const isAuthenticated = Boolean(session);

  const [items, budget] = isAuthenticated
    ? await Promise.all([getItems(), getBudget()])
    : [[], null];

  return (
    <DashboardClient
      isAuthenticated={isAuthenticated}
      initialItems={items}
      initialBudget={budget}
    />
  );
}
