import type { Category } from "@/types";

export const FREE_ITEM_LIMIT = 3;

export const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: "entertainment", label: "Entertainment" },
  { value: "food", label: "Food" },
  { value: "transport", label: "Transport" },
  { value: "shopping", label: "Shopping" },
  { value: "gadget", label: "Gadget" },
  { value: "insurance", label: "Insurance" },
  { value: "education", label: "Education" },
  { value: "health", label: "Health" },
  { value: "utilities", label: "Utilities" },
  { value: "other", label: "Other" },
];

export const ITEM_COLORS = [
  "#0F766E",
  "#0369A1",
  "#B45309",
  "#BE123C",
  "#4C1D95",
  "#15803D",
];
