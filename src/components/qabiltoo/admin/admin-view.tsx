"use client";

import { useEffect, useState } from "react";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight, Clock3, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { View } from "@/lib/qabiltoo/types";
import { cn } from "@/lib/utils";
import { ContentTab } from "./content-tab";
import { ModerationTab } from "./moderation-tab";
import { OverviewTab, type AdminTabValue } from "./overview-tab";
import { VerificationsTab } from "./verifications-tab";
import { useAdminStats } from "./kit";

/* ── Qabiltoo Operations — admin panel ─────────────────────────── */

function useLiveClock() {
  const [clock, setClock] = useState<string | null>(null);
  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  return clock;
}

function CountPill({ value }: { value?: number }) {
  if (!value) return null;
  return (
    <span className="ml-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-gold-500/20 px-1.5 py-px text-[10px] font-bold text-gold-700 dark:text-gold-300">
      {value}
    </span>
  );
}

export function AdminView({ navigate }: { navigate: (v: View) => void }) {
  const [tab, setTab] = useState<AdminTabValue>("overview");
  const queryClient = useQueryClient();
  const fetching = useIsFetching({ queryKey: ["admin"] }) > 0;
  const clock = useLiveClock();
  const { data: stats, isLoading, isError, refetch } = useAdminStats();

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin"] });

  return (
    <div className="flex min-h-[80vh] flex-col bg-cream pb-16 dark:bg-emerald-950/30">
      <Tabs value={tab} onValueChange={(v) => setTab(v as AdminTabValue)} className="flex flex-1 flex-col">
        {/* ── Dark operations header ─────────────────────────────── */}
        <header className="relative overflow-hidden border-b border-gold-500/25 bg-emerald-950 text-emerald-50">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(65%_130%_at_85%_-10%,rgba(212,175,55,0.18),transparent_62%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_90%_at_0%_110%,rgba(20,101,79,0.5),transparent_60%)]"
          />
          <div className="relative mx-auto w-full max-w-6xl px-4 pb-4 pt-5 sm:px-6">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              {/* Brand */}
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold-500/40 bg-emerald-900 shadow-[0_0_16px_rgba(212,175,55,0.25)]">
                  <ShieldCheck className="h-5 w-5 text-gold-400" aria-hidden />
                </span>
                <div className="min-w-0">
                  <h1 className="font-display text-lg font-semibold leading-tight sm:text-xl">
                    Qabiltoo{" "}
                    <span className="bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">
                      Operations
                    </span>
                  </h1>
                  <p className="flex items-center gap-1.5 text-[11px] text-emerald-300/80">
                    <span className="font-arabic text-sm leading-none text-gold-400">العمليات</span>
                    · Demo environment — sample data
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="ml-auto flex flex-wrap items-center gap-2">
                <span
                  className="hidden items-center gap-1.5 rounded-full border border-emerald-800 bg-emerald-900/60 px-2.5 py-1 text-xs tabular-nums text-emerald-200 sm:inline-flex"
                  aria-label="Local time"
                >
                  <Clock3 className="h-3.5 w-3.5 text-gold-400" aria-hidden />
                  {clock ?? "--:--:--"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-700/60 bg-emerald-900/60 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-200">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  Live
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refresh}
                  aria-label="Refresh all data"
                  className="gap-1.5 rounded-full border-emerald-700 bg-emerald-900/60 text-emerald-100 hover:bg-emerald-800 hover:text-white"
                >
                  <RefreshCw className={cn("h-4 w-4", fetching && "animate-spin")} aria-hidden />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ name: "landing" })}
                  className="gap-1.5 rounded-full text-emerald-300 hover:bg-emerald-900 hover:text-white"
                >
                  Exit console
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            </div>

            {/* Tabs — horizontally scrollable on mobile */}
            <TabsList className="mt-5 flex h-auto w-full justify-start gap-1 overflow-x-auto rounded-xl border border-emerald-800/70 bg-emerald-900/50 p-1 scrollbar-thin">
              <TabsTrigger
                value="overview"
                className="shrink-0 gap-1.5 rounded-lg px-3.5 py-1.5 text-sm text-emerald-200 data-[state=active]:bg-gold-500 data-[state=active]:text-emerald-950 data-[state=active]:shadow-none"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="verifications"
                className="shrink-0 gap-1.5 rounded-lg px-3.5 py-1.5 text-sm text-emerald-200 data-[state=active]:bg-gold-500 data-[state=active]:text-emerald-950 data-[state=active]:shadow-none"
              >
                Verifications
                <CountPill value={stats?.pendingVerifications} />
              </TabsTrigger>
              <TabsTrigger
                value="moderation"
                className="shrink-0 gap-1.5 rounded-lg px-3.5 py-1.5 text-sm text-emerald-200 data-[state=active]:bg-gold-500 data-[state=active]:text-emerald-950 data-[state=active]:shadow-none"
              >
                Moderation
                <CountPill value={stats?.openReports} />
              </TabsTrigger>
              <TabsTrigger
                value="content"
                className="shrink-0 gap-1.5 rounded-lg px-3.5 py-1.5 text-sm text-emerald-200 data-[state=active]:bg-gold-500 data-[state=active]:text-emerald-950 data-[state=active]:shadow-none"
              >
                Content
              </TabsTrigger>
            </TabsList>
          </div>
        </header>

        {/* ── Content ────────────────────────────────────────────── */}
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
          <TabsContent value="overview" className="mt-0 focus-visible:outline-none">
            <OverviewTab
              stats={stats}
              loading={isLoading}
              error={isError}
              onRetry={() => refetch()}
              onGoTab={setTab}
            />
          </TabsContent>
          <TabsContent value="verifications" className="mt-0 focus-visible:outline-none">
            <VerificationsTab />
          </TabsContent>
          <TabsContent value="moderation" className="mt-0 focus-visible:outline-none">
            <ModerationTab />
          </TabsContent>
          <TabsContent value="content" className="mt-0 focus-visible:outline-none">
            <ContentTab />
          </TabsContent>
        </main>
      </Tabs>
    </div>
  );
}
