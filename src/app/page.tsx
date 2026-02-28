import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { Navbar } from "@/components/layout/navbar";
import { getSession } from "@/lib/session";
import { getItems, getUserPlan } from "@/actions";

export default async function Home() {
  const session = await getSession();
  const isAuthenticated = Boolean(session);

  const [items, plan] = isAuthenticated
    ? await Promise.all([getItems(), getUserPlan()])
    : [[], "free" as const];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar isAuthenticated={isAuthenticated} email={session?.user?.email} />
      <main className="flex-1">
        <DashboardClient
          isAuthenticated={isAuthenticated}
          initialItems={items}
          initialPlan={plan}
        />
      </main>
    </div>
  );
}
