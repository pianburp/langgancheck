"use server";

import { getSessionUser } from "@/lib/session";
import * as planService from "@/lib/services/plan.service";
import type { PlanTier } from "@/lib/domain/types";

function requireUserId(userId: string | undefined): string {
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

export async function getUserPlan(): Promise<PlanTier> {
  const user = await getSessionUser();
  if (!user) return "free";
  return planService.getUserPlan(user.id);
}

export async function upgradeUserPlan(): Promise<void> {
  const user = await getSessionUser();
  const userId = requireUserId(user?.id);
  await planService.upgradeUserPlan(userId);
}

