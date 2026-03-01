"use server";

import { z } from "zod";
import { requireAuth } from "@/lib/session";
import * as itemService from "@/lib/services/item.service";
import type { Item } from "@/lib/domain/types";

// ── Validation schemas ───────────────────────────────────────────

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
  message: "Expected date in YYYY-MM-DD format",
});

const itemSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(["subscription", "bnpl"]),
  name: z.string().min(1).max(255),
  brandIconUrl: z
    .string()
    .url()
    .refine((u) => u.startsWith("https://"), {
      message: "Only HTTPS URLs are allowed",
    })
    .nullable(),
  amount: z.number().positive().finite(),
  currency: z.literal("MYR"),
  billingCycle: z.enum(["weekly", "biweekly", "monthly", "yearly"]),
  billingDay: z.number().int().min(1).max(31),
  startDate: dateString,
  category: z.enum([
    "entertainment",
    "food",
    "transport",
    "shopping",
    "gadget",
    "insurance",
    "education",
    "health",
    "utilities",
    "other",
  ]),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
    message: "Expected hex colour (#RRGGBB)",
  }),
  notes: z.string().max(1000).default(""),
  isActive: z.boolean(),
  totalInstallments: z.number().int().positive().nullable(),
  installmentsPaid: z.number().int().min(0),
  paidDates: z.array(dateString),
});

const markPaidSchema = z.object({
  itemId: z.string().uuid(),
  date: dateString,
});

// ── Server actions ───────────────────────────────────────────────

export async function getItems(): Promise<Item[]> {
  const user = await requireAuth();
  return itemService.getItemsByUserId(user.id);
}

export async function upsertItem(raw: unknown): Promise<void> {
  const user = await requireAuth();
  const data = itemSchema.parse(raw);
  await itemService.upsertItem(user.id, data);
}

export async function markItemPaid(
  itemId: string,
  date: string,
): Promise<Item | null> {
  const user = await requireAuth();
  const input = markPaidSchema.parse({ itemId, date });
  return itemService.markItemPaid(input.itemId, input.date, user.id);
}
