"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { calculateAnnualSavings } from "@/lib/domain/item";
import { formatRM } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Item } from "@/lib/domain/types";
import { ChevronDown, ChevronUp, DollarSign } from "lucide-react";
import { BrandIcon } from "@/components/dashboard/brand-icon";

interface SavingsOverviewProps {
  items: Item[];
  isExpanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}

export function SavingsOverview({ items, isExpanded, onExpandedChange }: SavingsOverviewProps) {

  const rows = useMemo(() => {
    return items
      .filter((item) => item.isActive)
      .map((item) => {
        const { annual } = calculateAnnualSavings(item);
        return { item, annual };
      })
      .filter((r) => r.annual > 0)
      .sort((a, b) => b.annual - a.annual);
  }, [items]);

  const totalAnnual = useMemo(
    () => rows.reduce((s, r) => s + r.annual, 0),
    [rows],
  );

  if (rows.length === 0) return null;

  return (
    <div>
      <button
        type="button"
        onClick={() => onExpandedChange(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="savings-overview-panel"
        className="flex w-full items-center justify-between text-xs"
      >
        <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
          <DollarSign className="h-3.5 w-3.5" />
          Savings Potential
        </span>
        <span className="flex items-center gap-1">
          <span className="font-semibold tabular-nums text-green-600">
            {formatRM(totalAnnual)}/annum
          </span>
          {isExpanded ? (
            <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id="savings-overview-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-1.5 pt-2">
              {rows.map(({ item, annual }) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 rounded-md bg-muted/50 px-2.5 py-1.5 text-xs"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    {item.brandIconUrl ? (
                      <BrandIcon
                        name={item.name}
                        iconUrl={item.brandIconUrl}
                        className="h-3.5 w-3.5 rounded-[3px]"
                      />
                    ) : (
                      <span
                        className="inline-block h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    )}
                    <span className="truncate">{item.name}</span>
                  </span>
                  <span className="shrink-0 tabular-nums text-green-600">
                    {formatRM(annual)}/annum
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
}
