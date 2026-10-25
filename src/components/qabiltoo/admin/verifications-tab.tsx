"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, Check, CheckCircle2, History, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import {
  AdminAvatar,
  EmptyState,
  LiveChip,
  TierBadge,
  timeAgoLong,
  type AdminVerification,
} from "./kit";

type VerifyAction = "approve" | "reject";

async function fetchVerifications(status?: string): Promise<{ requests: AdminVerification[] }> {
  const url = status ? `/api/admin/verifications?status=${status}` : "/api/admin/verifications";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch verifications");
  return res.json();
}

export function VerificationsTab() {
  const queryClient = useQueryClient();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [handled, setHandled] = useState<Set<string>>(() => new Set());

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "verifications", "pending"],
    queryFn: () => fetchVerifications("pending"),
    refetchInterval: 15_000,
  });

  const { data: allData } = useQuery({
    queryKey: ["admin", "verifications", "all"],
    queryFn: () => fetchVerifications(),
    refetchInterval: 30_000,
  });

  const pending = (data?.requests ?? []).filter((r) => !handled.has(r.id));
  const reviewed = (allData?.requests ?? [])
    .filter((r) => r.status !== "pending")
    .slice(0, 6);

  const act = async (req: AdminVerification, action: VerifyAction) => {
    setBusyId(req.id);
    // Optimistic: drop the row immediately while the PATCH settles
    setHandled((prev) => new Set(prev).add(req.id));
    try {
      const res = await fetch(`/api/admin/verifications/${req.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error("Request failed");
      toast({
        title:
          action === "approve"
            ? `Approved — ${req.profile.fullName} is now verified`
            : `Rejected — ${req.profile.fullName} will be asked to re-upload`,
        description:
          action === "approve"
            ? "Trust score raised by 20 and a verified badge issued."
            : "A re-upload notification has been sent to the member.",
      });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    } catch {
      setHandled((prev) => {
        const next = new Set(prev);
        next.delete(req.id);
        return next;
      });
      toast({
        variant: "destructive",
        title: "Action failed",
        description: "The request could not be updated. Please try again.",
      });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Verification queue
          </h2>
          <p className="text-sm text-muted-foreground">
            Review identity documents. Approval raises the member&apos;s trust score by 20.
          </p>
        </div>
        <LiveChip label="Live · 15s" />
      </div>

      <Card className="py-5">
        <CardHeader className="px-5">
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <BadgeCheck className="h-5 w-5 text-gold-600" aria-hidden />
            Awaiting review
            <span className="rounded-full bg-gold-100 px-2 py-0.5 text-xs font-semibold text-gold-700 dark:bg-gold-900/30 dark:text-gold-300">
              {isLoading ? "…" : pending.length}
            </span>
          </CardTitle>
          <CardDescription>
            Documents are already masked — verify the reference against the uploaded copy.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5">
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : pending.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="Queue clear"
              hint="No verification requests awaiting review. New submissions appear here automatically."
            />
          ) : (
            <div className="max-h-96 divide-y divide-border overflow-y-auto scrollbar-thin">
              {pending.map((req) => (
                <div
                  key={req.id}
                  className={cn(
                    "flex flex-wrap items-center gap-3 py-3 sm:flex-nowrap",
                    busyId === req.id && "opacity-60"
                  )}
                >
                  <AdminAvatar
                    src={req.profile.image}
                    name={req.profile.fullName}
                    className="h-12 w-12"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-semibold text-foreground">
                        {req.profile.fullName}
                      </p>
                      <TierBadge tier={req.profile.verificationTier} />
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {req.profile.city} · submitted {timeAgoLong(req.createdAt)}
                    </p>
                  </div>
                  <div className="mr-1 shrink-0 text-right">
                    <p className="text-xs font-medium text-foreground">{req.docType}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{req.docRef}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      size="sm"
                      disabled={busyId === req.id}
                      onClick={() => act(req, "approve")}
                      className="btn-gold-shimmer rounded-full bg-gold-500 text-emerald-950 hover:bg-gold-400"
                    >
                      {busyId === req.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      ) : (
                        <Check className="h-4 w-4" aria-hidden />
                      )}
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busyId === req.id}
                      onClick={() => act(req, "reject")}
                      className="rounded-full border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-4 w-4" aria-hidden />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recently reviewed */}
      <Card className="py-5">
        <CardHeader className="px-5">
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <History className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden />
            Recently reviewed
          </CardTitle>
          <CardDescription>The latest six decisions, for the audit trail.</CardDescription>
        </CardHeader>
        <CardContent className="px-5">
          {reviewed.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No reviewed requests yet — decisions will be listed here.
            </p>
          ) : (
            <div className="max-h-72 divide-y divide-border overflow-y-auto scrollbar-thin">
              {reviewed.map((req) => {
                const approved = req.status === "approved";
                return (
                  <div key={req.id} className="flex flex-wrap items-center gap-3 py-3">
                    <AdminAvatar
                      src={req.profile.image}
                      name={req.profile.fullName}
                      className="h-9 w-9"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {req.profile.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {req.docType} · {req.docRef}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                        approved
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                      )}
                    >
                      {approved ? <Check className="h-3 w-3" aria-hidden /> : <X className="h-3 w-3" aria-hidden />}
                      {approved ? "Approved" : "Rejected"}
                    </span>
                    <span className="w-16 text-right text-xs tabular-nums text-muted-foreground">
                      {timeAgoLong(req.reviewedAt ?? req.createdAt)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
