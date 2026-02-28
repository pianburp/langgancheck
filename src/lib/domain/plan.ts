import type { PlanTier } from "@/lib/domain/types";

/** Row shape returned by Drizzle for the `user_plan` table. */
export type PlanRow = {
  id: string;
  userId: string;
  tier: string;
};

/** Map a raw DB row (or `undefined`) to a `PlanTier`, defaulting to `"free"`. */
export function toPlanTier(row: PlanRow | undefined): PlanTier {
  return (row?.tier as PlanTier) ?? "free";
}

