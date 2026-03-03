"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MonthlyReviewPromptProps {
  inactiveCount: number;
}

export function MonthlyReviewPrompt({ inactiveCount }: MonthlyReviewPromptProps) {
  const key = (() => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `langgancheck:audit-prompt-dismissed:${now.getFullYear()}-${month}`;
  })();
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(key) === "1";
  });

  if (dismissed || inactiveCount <= 0) return null;

  return (
    <Card className="border-amber-300/60 bg-amber-50/60 dark:bg-amber-950/20">
      <CardContent className="flex items-start justify-between gap-3 p-4">
        <div>
          <p className="text-sm font-semibold">Time for a review!</p>
          <p className="text-xs text-muted-foreground">
            {inactiveCount} of your subscriptions are inactive. Check keep/review/cancel below.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            window.localStorage.setItem(key, "1");
            setDismissed(true);
          }}
        >
          Dismiss
        </Button>
      </CardContent>
    </Card>
  );
}
