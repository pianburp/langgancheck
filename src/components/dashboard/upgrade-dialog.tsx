import { FREE_ITEM_LIMIT } from "@/lib/constants";

interface UpgradeDialogProps {
  open: boolean;
  itemCount: number;
  onClose: () => void;
  onUpgrade: () => void;
}

export function UpgradeDialog({
  open,
  itemCount,
  onClose,
  onUpgrade,
}: UpgradeDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold">Upgrade to Pro</h2>
        <p className="mt-2 text-sm text-slate-700">
          You already have {itemCount} items. Free plan supports up to {FREE_ITEM_LIMIT} items.
        </p>
        <p className="mt-1 text-sm text-slate-700">Pro removes the limit for RM10/month.</p>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onUpgrade}
            className="flex-1 rounded-xl bg-teal-700 px-4 py-2 font-semibold text-white"
          >
            Upgrade now
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border px-4 py-2 font-semibold"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
