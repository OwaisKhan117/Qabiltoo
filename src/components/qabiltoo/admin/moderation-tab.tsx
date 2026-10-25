"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Ban,
  ChevronDown,
  Flag,
  Gavel,
  Hourglass,
  Loader2,
  ShieldAlert,
  ShieldX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import {
  AdminAvatar,
  EmptyState,
  LiveChip,
  REPORT_ACTION_META,
  isSevereReason,
  timeAgoLong,
  type AdminReport,
} from "./kit";

type ReportAction = "warn" | "suspend" | "ban" | "dismiss";

const ACTION_COPY: Record<ReportAction, (name: string) => { title: string; description: string }> = {
  warn: (name) => ({
    title: `Warning sent — ${name} has been reminded of the community guidelines`,
    description: "A notification was delivered to the member.",
  }),
  suspend: (name) => ({
    title: `Suspended — ${name}'s account is paused`,
    description: "The member can contact support to appeal.",
  }),
  ban: (name) => ({
    title: `Banned — ${name} has been removed from Qabiltoo`,
    description: "The account no longer appears in browse or search.",
  }),
  dismiss: () => ({
    title: "Report dismissed",
    description: "Closed with no action taken against the member.",
  }),
};

async function fetchReports(status?: string): Promise<{ reports: AdminReport[] }> {
  const url = status ? `/api/admin/reports?status=${status}` : "/api/admin/reports";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch reports");
  return res.json();
}

export function ModerationTab() {
  const queryClient = useQueryClient();
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [handled, setHandled] = useState<Set<string>>(() => new Set());
  const [resolvedOpen, setResolvedOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "reports", "open"],
    queryFn: () => fetchReports("open"),
    refetchInterval: 15_000,
  });

  const { data: allData } = useQuery({
    queryKey: ["admin", "reports", "all"],
    queryFn: () => fetchReports(),
    refetchInterval: 30_000,
  });

  const open = (data?.reports ?? []).filter((r) => !handled.has(r.id));
  const resolved = (allData?.reports ?? []).filter((r) => r.status === "resolved").slice(0, 12);

  const act = async (report: AdminReport, action: ReportAction) => {
    setBusyKey(`${report.id}:${action}`);
    setHandled((prev) => new Set(prev).add(report.id));
    try {
      const res = await fetch(`/api/admin/reports/${report.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error("Request failed");
      toast(ACTION_COPY[action](report.profile.fullName));
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    } catch {
      setHandled((prev) => {
        const next = new Set(prev);
        next.delete(report.id);
        return next;
      });
      toast({
        variant: "destructive",
        title: "Action failed",
        description: "The report could not be updated. Please try again.",
      });
    } finally {
      setBusyKey(null);
    }
  };

  const actionButtons: {
    action: ReportAction;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    variant: "outline" | "secondary" | "destructive" | "ghost";
    className?: string;
  }[] = [
    {
      action: "warn",
      label: "Warn",
      icon: ShieldAlert,
      variant: "outline",
      className: "border-gold-500/50 text-gold-700 hover:bg-gold-50 hover:text-gold-800 dark:text-gold-300 dark:hover:bg-gold-900/20",
    },
    { action: "suspend", label: "Suspend", icon: Hourglass, variant: "secondary" },
    { action: "ban", label: "Ban", icon: Ban, variant: "destructive" },
    { action: "dismiss", label: "Dismiss", icon: ShieldX, variant: "ghost" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground">Moderation queue</h2>
          <p className="text-sm text-muted-foreground">
            Community reports awaiting a decision. Serious allegations are flagged for priority.
          </p>
        </div>
        <LiveChip label="Live · 15s" />
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-2xl" />
          ))}
        </div>
      ) : open.length === 0 ? (
        <EmptyState
          icon={ShieldAlert}
          title="No open reports"
          hint="The community is in good standing. New reports will appear here within seconds of being filed."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {open.map((report) => {
            const severe = isSevereReason(report.reason);
            const rowBusy = busyKey?.startsWith(`${report.id}:`) ?? false;
            return (
              <Card
                key={report.id}
                className={cn(
                  "gap-3 py-4 transition-opacity",
                  severe &&
                    "border-rose-300 ring-1 ring-rose-200 dark:border-rose-500/40 dark:ring-rose-500/20",
                  rowBusy && "opacity-60"
                )}
              >
                <CardHeader className="px-5">
                  <div className="flex items-start gap-3">
                    <AdminAvatar
                      src={report.profile.image}
                      name={report.profile.fullName}
                      className="h-11 w-11"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-base">{report.reason}</CardTitle>
                        {severe && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
                            <Flag className="h-3 w-3" aria-hidden />
                            Priority
                          </span>
                        )}
                      </div>
                      <CardDescription className="mt-1">
                        {report.details ?? "No further details were provided."}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between gap-3 px-5">
                  <p className="text-xs text-muted-foreground">
                    Reported profile:{" "}
                    <span className="font-medium text-foreground">
                      {report.profile.fullName}
                    </span>{" "}
                    · {report.profile.city}
                    <br />
                    Filed by {report.reporterName} · {timeAgoLong(report.createdAt)}
                  </p>
                  <div className="flex flex-wrap gap-2 border-t border-border pt-3">
                    {actionButtons.map((b) => {
                      const thisBusy = busyKey === `${report.id}:${b.action}`;
                      return (
                        <Button
                          key={b.action}
                          size="sm"
                          variant={b.variant}
                          disabled={rowBusy}
                          onClick={() => act(report, b.action)}
                          className={cn("rounded-full", b.className)}
                        >
                          {thisBusy ? (
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                          ) : (
                            <b.icon className="h-4 w-4" aria-hidden />
                          )}
                          {b.label}
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Resolved — collapsed by default */}
      <Collapsible open={resolvedOpen} onOpenChange={setResolvedOpen}>
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <CollapsibleTrigger asChild>
            <button className="flex w-full items-center gap-2 rounded-2xl px-5 py-4 text-left transition-colors hover:bg-muted/50">
              <Gavel className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden />
              <span className="flex-1">
                <span className="block font-display text-lg font-semibold text-foreground">
                  Resolved reports
                </span>
                <span className="block text-xs text-muted-foreground">
                  {resolved.length} closed in the recent history
                </span>
              </span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform duration-300",
                  resolvedOpen && "rotate-180"
                )}
                aria-hidden
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="max-h-96 divide-y divide-border overflow-y-auto border-t border-border px-5 scrollbar-thin">
              {resolved.length === 0 ? (
                <p className="py-5 text-center text-sm text-muted-foreground">
                  Nothing resolved yet — closed reports will be archived here.
                </p>
              ) : (
                resolved.map((report) => {
                  const meta = REPORT_ACTION_META[report.action];
                  return (
                    <div key={report.id} className="flex flex-wrap items-center gap-3 py-3">
                      <AdminAvatar
                        src={report.profile.image}
                        name={report.profile.fullName}
                        className="h-9 w-9"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {report.profile.fullName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {report.reason} · reported by {report.reporterName}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                          meta.className
                        )}
                      >
                        {meta.label}
                      </span>
                      <span className="w-16 text-right text-xs tabular-nums text-muted-foreground">
                        {timeAgoLong(report.resolvedAt ?? report.createdAt)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
}
