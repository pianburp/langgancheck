import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import { FREE_ITEM_LIMIT } from "@/lib/constants";
import { Sparkles, Check, Zap } from "lucide-react";

interface UpgradeDialogProps {
  open: boolean;
  itemCount: number;
  onClose: () => void;
  onUpgrade: () => void;
}

const proFeatures = [
  "Unlimited subscriptions & BNPL items",
  "Advanced payment analytics",
  "Export to CSV/PDF",
  "Priority support",
  "Early access to new features",
];

export function UpgradeDialog({
  open,
  itemCount,
  onClose,
  onUpgrade,
}: UpgradeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-xl">Upgrade to Pro</DialogTitle>
          <DialogDescription className="text-center">
            You&apos;ve reached the limit of {FREE_ITEM_LIMIT} items on the free plan.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 rounded-lg bg-muted p-4 text-center">
          <p className="text-sm text-muted-foreground">Your current usage</p>
          <p className="mt-1 text-2xl font-bold">
            {itemCount} <span className="text-muted-foreground">/ {FREE_ITEM_LIMIT}</span>
            <span className="ml-2 text-sm font-normal text-muted-foreground">items</span>
          </p>
        </div>

        <Separator />

        <div className="py-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-medium">Pro Plan</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">RM10</span>
              <span className="text-sm text-muted-foreground">/month</span>
            </div>
          </div>

          <ul className="space-y-2">
            {proFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Maybe Later
          </Button>
          <Button onClick={onUpgrade} className="flex-1 gap-2">
            <Zap className="h-4 w-4" />
            Upgrade Now
          </Button>
        </div>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          This is a demo. Clicking upgrade will activate Pro for testing.
        </p>
      </DialogContent>
    </Dialog>
  );
}
