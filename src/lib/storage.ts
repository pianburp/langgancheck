"use client";

import type { Item, PlanTier } from "@/types";

const ITEMS_KEY = "gajiguard-items";
const PLAN_KEY = "gajiguard-plan";

export function loadItems(): Item[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(ITEMS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Item[];
  } catch {
    return [];
  }
}

export function saveItems(items: Item[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
}

export function loadPlan(): PlanTier {
  if (typeof window === "undefined") return "free";
  return (window.localStorage.getItem(PLAN_KEY) as PlanTier) || "free";
}

export function savePlan(plan: PlanTier): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PLAN_KEY, plan);
}
