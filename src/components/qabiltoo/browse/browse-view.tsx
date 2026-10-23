"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  LayoutGrid,
  List,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { CuratedProfileCard, ProfileCard, ProfileCardRow } from "./profile-card";
import { PatternOverlay } from "../pattern";
import { SectionHeading } from "../shared/section-heading";
import { VERIFICATION_TIER_META } from "@/lib/qabiltoo/types";
import {
  INCOME_BRACKETS,
  MARITAL_STATUSES,
  SECTS,
  type Profile,
  type ProfilesResponse,
  type VerificationTier,
  type View,
} from "@/lib/qabiltoo/types";
import { cn } from "@/lib/utils";

/* ── Props ──────────────────────────────────────────────────────────── */

interface BrowseViewProps {
  initialGender?: string;
  navigate: (view: View) => void;
  onViewProfile: (profile: Profile) => void;
  onSendInterest: (profile: Profile) => void;
  interestedIds: Set<string>;
}

/* ── Filter state ───────────────────────────────────────────────────── */

interface Filters {
  q: string;
  gender: string;
  ageMin: string;
  ageMax: string;
  city: string;
  country: string;
  maritalStatus: string;
  sect: string;
  education: string;
  profession: string;
  income: string;
  relocate: boolean;
  verificationTier: string;
  sort: "recent" | "trust" | "active";
}

const DEFAULT_FILTERS: Filters = {
  q: "",
  gender: "all",
  ageMin: "18",
  ageMax: "75",
  city: "all",
  country: "all",
  maritalStatus: "all",
  sect: "all",
  education: "",
  profession: "",
  income: "all",
  relocate: false,
  verificationTier: "all",
  sort: "recent",
};

const AGES = Array.from({ length: 58 }, (_, i) => i + 18);
const PAGE_SIZE = 12;

const TIER_CHIPS: VerificationTier[] = ["blue", "green", "gold"];

const SORT_OPTIONS: { value: Filters["sort"]; label: string }[] = [
  { value: "recent", label: "Recently joined" },
  { value: "trust", label: "Highest trust" },
  { value: "active", label: "Recently active" },
];

/** Debounce any fast-changing value (search text) before it hits the API. */
function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/** Compact page list with ellipsis: [1, "...", 4, 5, 6, "...", 12] */
function pageList(total: number, current: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  const lo = Math.max(2, current - 1);
  const hi = Math.min(total - 1, current + 1);
  if (lo > 2) pages.push("…");
  for (let p = lo; p <= hi; p++) pages.push(p);
  if (hi < total - 1) pages.push("…");
  pages.push(total);
  return pages;
}

/* ── Component ──────────────────────────────────────────────────────── */

export function BrowseView({
  initialGender,
  navigate,
  onViewProfile,
  onSendInterest,
  interestedIds,
}: BrowseViewProps) {
  const [filters, setFilters] = useState<Filters>(() => ({
    ...DEFAULT_FILTERS,
    gender: initialGender ?? DEFAULT_FILTERS.gender,
  }));
  const [page, setPage] = useState(1);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const debouncedQ = useDebouncedValue(filters.q, 300);
  const debouncedEducation = useDebouncedValue(filters.education, 300);
  const debouncedProfession = useDebouncedValue(filters.profession, 300);
  const carouselRef = useRef<HTMLDivElement>(null);

  function updateFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  }

  function resetFilters() {
    setFilters({ ...DEFAULT_FILTERS });
    setPage(1);
  }

  /* ── Queries ─────────────────────────────────────────────────────── */

  const queryString = useMemo(() => {
    const sp = new URLSearchParams();
    if (filters.gender === "male" || filters.gender === "female") sp.set("gender", filters.gender);
    if (Number(filters.ageMin) > 18) sp.set("minAge", filters.ageMin);
    if (Number(filters.ageMax) < 75) sp.set("maxAge", filters.ageMax);
    if (filters.city !== "all") sp.set("city", filters.city);
    if (filters.country !== "all") sp.set("country", filters.country);
    if (filters.maritalStatus !== "all") sp.set("maritalStatus", filters.maritalStatus);
    if (filters.sect !== "all") sp.set("sect", filters.sect);
    if (filters.income !== "all") sp.set("income", filters.income);
    if (filters.relocate) sp.set("relocate", "true");
    if (filters.verificationTier !== "all") sp.set("verificationTier", filters.verificationTier);
    if (debouncedQ.trim()) sp.set("q", debouncedQ.trim());
    if (debouncedEducation.trim()) sp.set("education", debouncedEducation.trim());
    if (debouncedProfession.trim()) sp.set("profession", debouncedProfession.trim());
    sp.set("sort", filters.sort);
    sp.set("page", String(page));
    sp.set("limit", String(PAGE_SIZE));
    return sp.toString();
  }, [filters, page, debouncedQ, debouncedEducation, debouncedProfession]);

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ["profiles", queryString],
    queryFn: async (): Promise<ProfilesResponse> => {
      const res = await fetch(`/api/profiles?${queryString}`);
      if (!res.ok) throw new Error("Failed to fetch profiles");
      return res.json();
    },
    placeholderData: (prev) => prev,
  });

  // Curated "Today's Matches" — highest trust scores
  const { data: curated } = useQuery({
    queryKey: ["profiles", "curated-trust"],
    queryFn: async (): Promise<ProfilesResponse> => {
      const res = await fetch("/api/profiles?sort=trust&limit=8");
      if (!res.ok) throw new Error("Failed to fetch curated profiles");
      return res.json();
    },
    staleTime: 60_000,
  });

  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await fetch("/api/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json() as Promise<{ cityNames: string[]; totalProfiles: number }>;
    },
    staleTime: 60_000,
  });

  // Country options — one light lookup over the full roster
  const { data: countries } = useQuery({
    queryKey: ["countries-lookup"],
    queryFn: async (): Promise<string[]> => {
      const res = await fetch("/api/profiles?limit=48");
      if (!res.ok) throw new Error("Failed to fetch countries");
      const json = (await res.json()) as ProfilesResponse;
      return Array.from(new Set(json.profiles.map((p) => p.country).filter(Boolean))).sort();
    },
    staleTime: 5 * 60_000,
  });

  /* ── Derived ─────────────────────────────────────────────────────── */

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.gender !== "all") count++;
    if (Number(filters.ageMin) > 18 || Number(filters.ageMax) < 75) count++;
    if (filters.city !== "all") count++;
    if (filters.country !== "all") count++;
    if (filters.maritalStatus !== "all") count++;
    if (filters.sect !== "all") count++;
    if (filters.education.trim()) count++;
    if (filters.profession.trim()) count++;
    if (filters.income !== "all") count++;
    if (filters.relocate) count++;
    if (filters.verificationTier !== "all") count++;
    if (filters.q.trim()) count++;
    return count;
  }, [filters]);

  const genderTabs = [
    { value: "all", label: "Everyone" },
    { value: "female", label: "Brides" },
    { value: "male", label: "Grooms" },
  ];

  const scrollCarousel = (dir: 1 | -1) => {
    carouselRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  /* ── Filter controls (shared between sidebar and mobile sheet) ───── */

  const filterControls = (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="filter-q">Quick search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            id="filter-q"
            value={filters.q}
            onChange={(e) => updateFilter("q", e.target.value)}
            placeholder="Name, city, profession…"
            className="rounded-full pl-9"
          />
        </div>
      </div>

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
          <span className="flex items-center text-xs text-muted-foreground">to</span>
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
        <Select value={filters.city} onValueChange={(v) => updateFilter("city", v)}>
          <SelectTrigger aria-label="City">
            <SelectValue placeholder="Any city" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectItem value="all">Any city</SelectItem>
            {(stats?.cityNames ?? []).map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Country</Label>
        <Select value={filters.country} onValueChange={(v) => updateFilter("country", v)}>
          <SelectTrigger aria-label="Country">
            <SelectValue placeholder="Any country" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectItem value="all">Any country</SelectItem>
            {(countries ?? []).map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Marital status</Label>
        <Select value={filters.maritalStatus} onValueChange={(v) => updateFilter("maritalStatus", v)}>
          <SelectTrigger aria-label="Marital status">
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
          <SelectTrigger aria-label="Sect">
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

      <div className="space-y-2">
        <Label htmlFor="filter-education">Education</Label>
        <Input
          id="filter-education"
          value={filters.education}
          onChange={(e) => updateFilter("education", e.target.value)}
          placeholder="e.g. MBA, Alimah, Engineering"
          className="rounded-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="filter-profession">Profession</Label>
        <Input
          id="filter-profession"
          value={filters.profession}
          onChange={(e) => updateFilter("profession", e.target.value)}
          placeholder="e.g. Doctor, Teacher"
          className="rounded-full"
        />
      </div>

      <div className="space-y-2">
        <Label>Annual income</Label>
        <Select value={filters.income} onValueChange={(v) => updateFilter("income", v)}>
          <SelectTrigger aria-label="Annual income">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any income</SelectItem>
            {INCOME_BRACKETS.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/50 px-3 py-2.5">
        <Label htmlFor="filter-relocate" className="text-sm font-normal">
          Open to relocation
        </Label>
        <Switch
          id="filter-relocate"
          checked={filters.relocate}
          onCheckedChange={(v) => updateFilter("relocate", v)}
        />
      </div>

      <div className="space-y-2">
        <Label>Verification</Label>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Verification tier filter">
          {TIER_CHIPS.map((tier) => {
            const meta = VERIFICATION_TIER_META[tier];
            const active = filters.verificationTier === tier;
            return (
              <button
                key={tier}
                type="button"
                onClick={() => updateFilter("verificationTier", active ? "all" : tier)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                  active
                    ? "border-transparent text-white shadow-sm"
                    : "border-border text-muted-foreground hover:border-gold-400"
                )}
                style={active ? { background: meta.color, boxShadow: meta.glow } : undefined}
              >
                {tier === "blue" ? "ID Verified" : tier === "green" ? "Verified & Active" : "Premium Verified"}
              </button>
            );
          })}
        </div>
      </div>

      <Button variant="outline" className="w-full rounded-full" onClick={resetFilters}>
        <RotateCcw className="h-4 w-4" aria-hidden /> Reset filters
      </Button>
    </div>
  );

  /* ── Render ──────────────────────────────────────────────────────── */

  return (
    <main className="relative">
      {/* ── Header band ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-primary pb-10 pt-8 text-primary-foreground sm:pb-12">
        <PatternOverlay className="text-white/10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate({ name: "landing" })}
            className="mb-4 flex items-center gap-1.5 text-sm text-primary-foreground/70 transition-colors hover:text-gold-300"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden /> Back to home
          </button>

          <SectionHeading
            arabic="اكتشف"
            eyebrow="Discover"
            title="Profiles prepared with sincerity"
            description="Every profile is reviewed with dignity. Browse brides and grooms whose families are ready for a respectful, halal introduction."
            align="left"
            dark
            className="mb-6 md:mb-8"
          />

          {/* Search + gender tabs + view toggle */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1 lg:max-w-md">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                placeholder="Search by name, city, profession…"
                value={filters.q}
                onChange={(e) => updateFilter("q", e.target.value)}
                className="rounded-full border-transparent bg-white pl-10 text-foreground shadow-sm"
                aria-label="Search profiles"
              />
            </div>
            <div className="flex gap-1.5 rounded-full bg-white/10 p-1 backdrop-blur" role="tablist" aria-label="Gender filter">
              {genderTabs.map((tab) => (
                <button
                  key={tab.value}
                  role="tab"
                  aria-selected={filters.gender === tab.value}
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
            <div className="lg:ml-auto">
              <div
                className="inline-flex rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur"
                role="group"
                aria-label="Layout"
              >
                <button
                  onClick={() => setLayout("grid")}
                  aria-pressed={layout === "grid"}
                  aria-label="Grid view"
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full transition-all",
                    layout === "grid" ? "bg-white text-primary shadow" : "text-white/75 hover:text-white"
                  )}
                >
                  <LayoutGrid className="h-4 w-4" aria-hidden />
                </button>
                <button
                  onClick={() => setLayout("list")}
                  aria-pressed={layout === "list"}
                  aria-label="List view"
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full transition-all",
                    layout === "list" ? "bg-white text-primary shadow" : "text-white/75 hover:text-white"
                  )}
                >
                  <List className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Curated carousel ────────────────────────────────────────── */}
      <section aria-label="Today's matches" className="relative overflow-hidden border-b bg-gradient-to-b from-gold-50/70 to-transparent dark:from-gold-500/5">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="flex items-center gap-2 font-display text-xl font-bold sm:text-2xl">
                <Sparkles className="h-5 w-5 text-gold-500" aria-hidden />
                Today&rsquo;s Matches for You
              </h2>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold-500" aria-hidden />
                Curated daily by our moderation team
              </p>
            </div>
            <div className="hidden gap-1.5 sm:flex">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => scrollCarousel(-1)}
                aria-label="Scroll curated profiles left"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => scrollCarousel(1)}
                aria-label="Scroll curated profiles right"
              >
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="scrollbar-thin -mx-1 flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-5 pt-2"
          >
            {curated?.profiles.map((profile, i) => (
              <CuratedProfileCard
                key={profile.id}
                profile={profile}
                index={i}
                onView={onViewProfile}
                onSendInterest={onSendInterest}
                isInterested={interestedIds.has(profile.id)}
              />
            ))}
            {!curated &&
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-[248px] shrink-0 snap-start sm:w-[264px]">
                  <Skeleton className="aspect-[4/3.4] w-full rounded-3xl" />
                  <div className="mt-3 space-y-2 px-1">
                    <Skeleton className="h-3.5 w-2/3" />
                    <Skeleton className="h-8 w-full rounded-full" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ── Body: filters + results ─────────────────────────────────── */}
      <div className="mx-auto max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:flex lg:px-8">
        {/* Sidebar filters (desktop) */}
        <aside className="hidden w-72 shrink-0 lg:block" aria-label="Profile filters">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-border bg-card p-5 scrollbar-thin">
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
              <Filter className="h-4 w-4 text-gold-600" aria-hidden /> Refine
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-gold-500 px-2 py-0.5 text-[11px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </h2>
            {filterControls}
          </div>
        </aside>

        {/* Results */}
        <div className="min-w-0 flex-1">
          {/* Toolbar */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {isLoading ? (
                "Preparing profiles…"
              ) : (
                <>
                  <span className="font-bold text-foreground">{data?.total ?? 0}</span>{" "}
                  {data?.total === 1 ? "profile" : "profiles"}
                  {isFetching && <span className="ml-2 text-xs">· refreshing…</span>}
                </>
              )}
            </p>
            <div className="flex items-center gap-2">
              {/* Mobile filter trigger */}
              <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-full lg:hidden">
                    <SlidersHorizontal className="h-4 w-4" aria-hidden /> Filters
                    {activeFilterCount > 0 && (
                      <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-white">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="inset-y-0 flex h-full w-84 max-w-[92vw] flex-col overflow-y-auto sm:w-96">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 font-display">
                      <Filter className="h-4 w-4 text-gold-600" aria-hidden /> Refine
                      {activeFilterCount > 0 && (
                        <span className="rounded-full bg-gold-500 px-2 py-0.5 text-[11px] font-bold text-white">
                          {activeFilterCount}
                        </span>
                      )}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 px-4 pb-8">{filterControls}</div>
                </SheetContent>
              </Sheet>

              {/* Sort */}
              <Select
                value={filters.sort}
                onValueChange={(v) => updateFilter("sort", v as Filters["sort"])}
              >
                <SelectTrigger
                  className="w-[10.5rem] rounded-full bg-card text-xs sm:text-sm"
                  aria-label="Sort profiles"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isError ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center">
              <p className="font-semibold text-destructive">Something went wrong</p>
              <p className="mt-1 text-sm text-muted-foreground">
                We couldn&rsquo;t load profiles right now. Please try again.
              </p>
              <Button variant="outline" className="mt-4 rounded-full" onClick={() => refetch()}>
                <RotateCcw className="h-4 w-4" aria-hidden /> Retry
              </Button>
            </div>
          ) : !isLoading && data?.profiles.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gold-400/40 bg-gold-50/40 p-12 text-center dark:bg-gold-500/5">
              <p className="font-display text-xl font-bold">No profiles match yet</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Try widening your filters — a sincere match may be just outside your current
                criteria. New members join every week, Alhamdulillah.
              </p>
              <Button variant="outline" className="mt-5 rounded-full" onClick={resetFilters}>
                <RotateCcw className="h-4 w-4" aria-hidden /> Reset filters
              </Button>
            </div>
          ) : layout === "grid" ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="overflow-hidden rounded-3xl border border-border">
                      <Skeleton className="aspect-[4/4.2] rounded-none" />
                      <div className="space-y-2.5 p-4">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-3.5 w-full" />
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
          ) : (
            <div className="flex flex-col gap-4">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 rounded-2xl border border-border p-4">
                      <Skeleton className="h-24 w-24 shrink-0 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3.5 w-1/2" />
                        <Skeleton className="h-3.5 w-2/3" />
                      </div>
                      <Skeleton className="h-9 w-28 rounded-full" />
                    </div>
                  ))
                : data?.profiles.map((profile, i) => (
                    <ProfileCardRow
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
            <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Pagination">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </Button>
              {pageList(data.totalPages, page).map((p, i) =>
                p === "…" ? (
                  <span key={`ellipsis-${i}`} className="px-1 text-sm text-muted-foreground" aria-hidden>
                    …
                  </span>
                ) : (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="icon"
                    className={cn("rounded-full text-sm", p === page && "btn-gold-shimmer border-gold-500 bg-gold-500 text-white hover:bg-gold-600")}
                    onClick={() => setPage(p)}
                    aria-label={`Page ${p}`}
                    aria-current={p === page ? "page" : undefined}
                  >
                    {p}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Button>
              <span className="ml-2 hidden text-xs text-muted-foreground sm:inline">
                Page {page} of {data.totalPages}
              </span>
            </nav>
          )}
        </div>
      </div>
    </main>
  );
}
