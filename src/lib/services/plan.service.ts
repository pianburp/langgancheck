import * as planRepo from "@/lib/repositories/plan.repository";
import { toPlanTier } from "@/lib/domain/plan";
import type { PlanTier } from "@/lib/domain/types";

/** Get a user's plan tier, defaulting to "free". */
export async function getUserPlan(userId: string): Promise<PlanTier> {
  const row = await planRepo.findByUserId(userId);
  return toPlanTier(row);
}

/** Upgrade a user's plan to "pro". */
export async function upgradeUserPlan(userId: string): Promise<void> {
  await planRepo.upsert(userId, "pro");
}

