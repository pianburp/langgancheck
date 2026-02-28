import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatRM, formatRelativeDate, formatShortDate } from "@/lib/format";
import type { Item, Occurrence } from "@/lib/domain/types";
import { Wallet, Clock, CreditCard, Package } from "lucide-react";

interface UpcomingSidebarProps {
  monthlyTotal: number;
  occurrences: Occurrence[];
  itemsById: Record<string, Item>;
}

export function UpcomingSidebar({
  monthlyTotal,
  occurrences,
  itemsById,
}: UpcomingSidebarProps) {
  const upcoming = occurrences.filter((o) => o.status !== "paid").slice(0, 10);
  
  const totalPaid = occurrences
    .filter((o) => o.status === "paid")
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-4">
      {/* Monthly Summary Card */}
      <Card className="border-primary/10 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Due This Month
              </p>
              <p className="text-2xl font-bold tabular-nums tracking-tight">
                {formatRM(monthlyTotal)}
              </p>
            </div>
          </div>
          {totalPaid > 0 && (
            <>
              <Separator className="my-3 bg-primary/10" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Already paid</span>
                <span className="font-medium text-green-600">{formatRM(totalPaid)}</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Upcoming List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Upcoming</CardTitle>
          </div>
          <CardDescription>Next 10 payments due</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {upcoming.length === 0 ? (
            <div className="px-6 pb-6 text-sm text-muted-foreground">
              No upcoming payments this period.
            </div>
          ) : (
            <ScrollArea className="h-[400px] px-6">
              <div className="space-y-3 pb-6">
                {upcoming.map((occurrence, idx) => {
                  const item = itemsById[occurrence.itemId];
                  if (!item) return null;
                  
                  const isBnpl = item.type === "bnpl";
                  const progress = isBnpl && item.totalInstallments
                    ? Math.round((item.installmentsPaid / item.totalInstallments) * 100)
                    : null;

                  return (
                    <div
                      key={`${occurrence.itemId}-${idx}`}
                      className="rounded-lg border bg-card p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2 w-2 shrink-0 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <p className="truncate font-medium text-sm">{item.name}</p>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {isBnpl ? (
                              <span className="flex items-center gap-1">
                                <Package className="h-3 w-3" />
                                BNPL
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <CreditCard className="h-3 w-3" />
                                Subscription
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold tabular-nums text-sm">
                            {formatRM(occurrence.amount)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatShortDate(occurrence.date)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <Badge 
                          variant={occurrence.status === "missed" ? "destructive" : "secondary"}
                          className="text-[10px]"
                        >
                          {formatRelativeDate(occurrence.date)}
                        </Badge>
                        
                        {isBnpl && item.totalInstallments && (
                          <span className="text-[10px] font-medium text-muted-foreground">
                            {item.installmentsPaid}/{item.totalInstallments} paid
                          </span>
                        )}
                      </div>
                      
                      {isBnpl && progress !== null && progress < 100 && (
                        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

