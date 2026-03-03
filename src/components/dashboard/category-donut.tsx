"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { CATEGORY_COLORS, CATEGORY_OPTIONS } from "@/lib/constants";
import { formatRM } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Item, Occurrence, Category } from "@/lib/domain/types";

interface CategoryDonutProps {
  occurrences: Occurrence[];
  itemsById: Record<string, Item>;
  isCompact?: boolean;
}

interface ChartDatum {
  category: Category;
  label: string;
  amount: number;
  color: string;
}

interface DonutLayerProps {
  data: ChartDatum[];
  total: number;
  size: 100 | 160;
  innerRadius: number;
  outerRadius: number;
  isActive: boolean;
}

const categoryLabelMap = Object.fromEntries(
  CATEGORY_OPTIONS.map((o) => [o.value, o.label]),
) as Record<Category, string>;

function DonutLayer({
  data,
  total,
  size,
  innerRadius,
  outerRadius,
  isActive,
}: DonutLayerProps) {
  return (
    <motion.div
      initial={false}
      animate={{
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 0.985,
      }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      className={cn(
        "absolute inset-0 flex items-center justify-center",
        !isActive && "pointer-events-none"
      )}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <PieChart width={size} height={size}>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            strokeWidth={2}
            stroke="var(--background)"
          >
            {data.map((d) => (
              <Cell key={`${size}-${d.category}`} fill={d.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              const d = payload[0].payload as ChartDatum;
              return (
                <div className="rounded-md border bg-popover px-2.5 py-1.5 text-xs shadow-md">
                  <p className="font-medium">{d.label}</p>
                  <p className="text-muted-foreground">
                    {formatRM(d.amount)} ({((d.amount / total) * 100).toFixed(0)}%)
                  </p>
                </div>
              );
            }}
          />
        </PieChart>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span
            className={cn(
              "font-semibold tabular-nums text-muted-foreground transition-[font-size] motion-reduce:transition-none",
              size === 100 ? "text-[10px]" : "text-sm",
            )}
          >
            {formatRM(total)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function CategoryDonut({ occurrences, itemsById, isCompact = false }: CategoryDonutProps) {
  const data = useMemo<ChartDatum[]>(() => {
    const map = new Map<Category, number>();
    for (const occ of occurrences) {
      const item = itemsById[occ.itemId];
      if (!item) continue;
      map.set(item.category, (map.get(item.category) ?? 0) + occ.amount);
    }
    return Array.from(map.entries())
      .map(([category, amount]) => ({
        category,
        label: categoryLabelMap[category] ?? category,
        amount,
        color: CATEGORY_COLORS[category],
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [occurrences, itemsById]);

  if (data.length === 0) return null;

  const total = data.reduce((s, d) => s + d.amount, 0);

  return (
    <motion.div layout>
      <motion.div
        layout
        className={cn(
          isCompact ? "flex items-center gap-3" : "flex flex-col items-center gap-6",
        )}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      >
        <motion.div layout className={cn("relative shrink-0 overflow-hidden", isCompact ? "h-[100px] w-[100px]" : "h-[160px] w-[160px]")}>
          <DonutLayer
            data={data}
            total={total}
            size={160}
            innerRadius={50}
            outerRadius={80}
            isActive={!isCompact}
          />
          <DonutLayer
            data={data}
            total={total}
            size={100}
            innerRadius={28}
            outerRadius={46}
            isActive={isCompact}
          />
        </motion.div>
        <motion.div layout className={`flex min-w-0 flex-col gap-1.5 ${isCompact ? "flex-1" : "w-full"}`}>
          {data.slice(0, 5).map((d) => (
            <motion.div layout="position" key={d.category} className="flex items-center justify-between gap-2 text-xs">
              <span className="flex items-center gap-1.5 truncate">
                <span
                  className="inline-block h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
                <motion.span
                  layout="position"
                  animate={{ color: isCompact ? "inherit" : "var(--foreground)" }}
                  className={cn(
                    "truncate",
                    isCompact ? "" : "text-sm text-foreground",
                  )}
                >
                  {d.label}
                </motion.span>
              </span>
              <motion.span
                layout="position"
                className={cn(
                  "shrink-0 tabular-nums",
                  isCompact ? "text-muted-foreground" : "text-sm text-muted-foreground",
                )}
              >
                {formatRM(d.amount)}
              </motion.span>
            </motion.div>
          ))}
          {data.length > 5 && (
            <p className="mt-1 text-center text-[10px] text-muted-foreground">
              +{data.length - 5} more
            </p>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
