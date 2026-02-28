import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { userPlan } from "@/lib/db/schema";

/** Find the plan row for a user. */
export async function findByUserId(userId: string) {
  const rows = await db
    .select()
    .from(userPlan)
    .where(eq(userPlan.userId, userId))
    .limit(1);
  return rows[0] ?? undefined;
}

/** Insert or update a user's plan tier. */
export async function upsert(userId: string, tier: "free" | "pro") {
  const existing = await db
    .select({ id: userPlan.id })
    .from(userPlan)
    .where(eq(userPlan.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(userPlan)
      .set({ tier, updatedAt: new Date() })
      .where(eq(userPlan.userId, userId));
  } else {
    await db.insert(userPlan).values({
      id: crypto.randomUUID(),
      userId,
      tier,
    });
  }
}
