"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Filter, Search, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProfileCard } from "./profile-card";
import { PatternOverlay } from "../pattern";
import { MARITAL_STATUSES, SECTS, type Profile, type ProfilesResponse, type View } from "@/lib/qabiltoo/types";
import { cn } from "@/lib/utils";

interface BrowseViewProps {
  initialGender?: string;
  navigate: (view: View) => void;
  onViewProfile: (profile: Profile) => void;
  onSendInterest: (profile: Profile) => void;
  interestedIds: Set<string>;
}

interface Filters {
  gender: string;
  ageMin: string;
  ageMax: string;
  city: string;
  maritalStatus: string;
  sect: string;
  q: string;
}

const DEFAULT_FILTERS: Filters = {
  gender: "all",
  ageMin: "18",
  ageMax: "60",
  city: "all",
  maritalStatus: "all",
  sect: "all",
  q: "",
};

const AGES = Array.from({ length: 43 }, (_, i) => i + 18);

export function BrowseView({
  initialGender,
  navigate,
  onViewProfile,
  onSendInterest,
  interestedIds,
}: BrowseViewProps) {
  // Note: this view mounts only after client-side navigation, so reading
  // sessionStorage in the lazy initializer is safe and hydration-stable.
  const [heroSearch, setHeroSearch] = useState<{ ageMin: string; ageMax: string; city: string } | null>(
    () => {
      if (typeof window === "undefined") return null;
      try {
        const raw = window.sessionStorage.getItem("qabiltoo-search");
        if (!raw) return null;
        const parsed = JSON.parse(raw) as { ageMin: string; ageMax: string; city: string };
        window.sessionStorage.removeItem("qabiltoo-search");
        return parsed;
      } catch {
        return null;
      }
    }
  );
  const [filters, setFilters] = useState<Filters>(() => ({
    ...DEFAULT_FILTERS,
    gender: initialGender ?? "all",
    ageMin: heroSearch?.ageMin ?? DEFAULT_FILTERS.ageMin,
    ageMax: heroSearch?.ageMax ?? DEFAULT_FILTERS.ageMax,
    city: heroSearch?.city || DEFAULT_FILTERS.city,
  }));
  const [page, setPage] = useState(1);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  function updateFilter(key: keyof Filters, value: string) {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  }

  function resetFilters() {
    setFilters({ ...DEFAULT_FILTERS, gender: filters.gender });
    setHeroSearch(null);
    setPage(1);
  }

  const queryString = useMemo(() => {
    const sp = new URLSearchParams();
    if (filters.gender === "male" || filters.gender === "female") sp.set("gender", filters.gender);
    if (heroSearch || filters.ageMin !== DEFAULT_FILTERS.ageMin) sp.set("minAge", filters.ageMin);
    if (heroSearch || filters.ageMax !== DEFAULT_FILTERS.ageMax) sp.set("maxAge", filters.ageMax);
    if (filters.city && filters.city !== "all") sp.set("city", filters.city);
    if (filters.maritalStatus !== "all") sp.set("maritalStatus", filters.maritalStatus);
    if (filters.sect !== "all") sp.set("sect", filters.sect);
    if (filters.q.trim()) sp.set("q", filters.q.trim());
    sp.set("page", String(page));
    sp.set("limit", "12");
    return sp.toString();
  }, [filters, page, heroSearch]);

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["profiles", queryString],
    queryFn: async (): Promise<ProfilesResponse> => {
      const res = await fetch(`/api/profiles?${queryString}`);
      if (!res.ok) throw new Error("Failed to fetch profiles");
      return res.json();
    },
    placeholderData: (prev) => prev,
  });

  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await fetch("/api/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    staleTime: 60_000,
  });

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.city !== "all" && filters.city) count++;
    if (filters.maritalStatus !== "all") count++;
    if (filters.sect !== "all") count++;
    if (filters.q.trim()) count++;
    if (heroSearch || filters.ageMin !== DEFAULT_FILTERS.ageMin || filters.ageMax !== DEFAULT_FILTERS.ageMax)
      count++;
    return count;
  }, [filters, heroSearch]);

  const genderTabs = [
    { value: "all", label: "Everyone" },
    { value: "female", label: "Brides" },
    { value: "male", label: "Grooms" },
  ];

  const filterControls = (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Age range</Label>
        <div className="flex gap-2">
          <Select value={filters.ageMin} onValueChange={(v) => updateFilter("ageMin", v)}>
            <SelectTrigger aria-label="Minimum age">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {AGES.filter((a) => a <= Number(filters.ageMax)).map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} yrs
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="flex items-center text-muted-foreground">to</span>
          <Select value={filters.ageMax} onValueChange={(v) => updateFilter("ageMax", v)}>
            <SelectTrigger aria-label="Maximum age">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {AGES.filter((a) => a >= Number(filters.ageMin)).map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} yrs
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>City</Label>
        <Select value={filters.city || "all"} onValueChange={(v) => updateFilter("city", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Any city" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectItem value="all">Any city</SelectItem>
            {(stats?.cityNames ?? []).map((city: string) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Marital status</Label>
        <Select value={filters.maritalStatus} onValueChange={(v) => updateFilter("maritalStatus", v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            {MARITAL_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Sect</Label>
        <Select value={filters.sect} onValueChange={(v) => updateFilter("sect", v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            {SECTS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" className="w-full rounded-full" onClick={resetFilters}>
        <RotateCcw className="h-4 w-4" /> Reset filters
      </Button>
    </div>
  );

  return (
    <main className="relative">
      {/* Header band */}
      <div className="relative overflow-hidden border-b bg-primary py-12 text-primary-foreground">
        <PatternOverlay className="text-white/10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate({ name: "landing" })}
            className="mb-3 text-sm text-primary-foreground/70 transition-colors hover:text-gold-300"
          >
            ← Back to home
          </button>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Find Your Qabil Match</h1>
          <p className="mt-2 max-w-xl text-sm text-primary-foreground/80 sm:text-base">
            Browse verified profiles of brides and grooms across India. Filter by what matters —
            deen, city, age and family values.
          </p>

          {/* Search + gender tabs */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, city, profession…"
                value={filters.q}
                onChange={(e) => updateFilter("q", e.target.value)}
                className="rounded-full border-transparent bg-white pl-10 text-foreground shadow-sm"
                aria-label="Search profiles"
              />
            </div>
            <div className="flex gap-1.5 rounded-full bg-white/10 p-1 backdrop-blur">
              {genderTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => updateFilter("gender", tab.value)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-semibold transition-all",
                    filters.gender === tab.value
                      ? "bg-white text-primary shadow"
                      : "text-white/80 hover:text-white"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:flex lg:px-8">
        {/* Sidebar filters (desktop) */}
        <aside className="hidden w-64 shrink-0 lg:block" aria-label="Profile filters">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
              <Filter className="h-4 w-4 text-primary" /> Refine
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-gold-500 px-2 py-0.5 text-[11px] font-bold text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </h2>
            {filterControls}
          </div>
        </aside>

        {/* Results */}
        <div className="min-w-0 flex-1">
          <div className="mb-5 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {isLoading ? (
                "Finding matches…"
              ) : (
                <>
                  <span className="font-bold text-foreground">{data?.total ?? 0}</span> profiles
                  found
                  {isFetching && <span className="ml-2 text-xs">· refreshing…</span>}
                </>
              )}
            </p>
            {/* Mobile filter trigger */}
            <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full lg:hidden">
                  <Filter className="h-4 w-4" /> Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Refine search</SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-6">{filterControls}</div>
              </SheetContent>
            </Sheet>
          </div>

          {isError ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center">
              <p className="font-semibold text-destructive">Something went wrong</p>
              <p className="mt-1 text-sm text-muted-foreground">
                We couldn&apos;t load profiles. Please try again.
              </p>
              <Button variant="outline" className="mt-4 rounded-full" onClick={() => setPage(1)}>
                Retry
              </Button>
            </div>
          ) : !isLoading && data?.profiles.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-12 text-center">
              <p className="font-display text-xl font-bold">No matches found</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Try widening your filters — great matches may be just outside your current
                criteria.
              </p>
              <Button variant="outline" className="mt-5 rounded-full" onClick={resetFilters}>
                <RotateCcw className="h-4 w-4" /> Reset filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="overflow-hidden rounded-2xl border border-border">
                      <Skeleton className="aspect-[4/4.4] rounded-none" />
                      <div className="space-y-2.5 p-4">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-8 w-full rounded-full" />
                      </div>
                    </div>
                  ))
                : data?.profiles.map((profile, i) => (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      index={i}
                      onView={onViewProfile}
                      onSendInterest={onSendInterest}
                      isInterested={interestedIds.has(profile.id)}
                    />
                  ))}
            </div>
          )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  size="icon"
                  className="rounded-full"
                  onClick={() => setPage(p)}
                  aria-label={`Page ${p}`}
                  aria-current={p === page ? "page" : undefined}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                disabled={page >= (data?.totalPages ?? 1)}
                onClick={() => setPage((p) => p + 1)}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </nav>
          )}
        </div>
      </div>
    </main>
  );
}
