"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Info, Loader2, Plus, ScrollText, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { SuccessStory } from "@/lib/qabiltoo/types";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { EmptyState, StoryThumb } from "./kit";

/* ── Image picker source (existing story photos) ──────────────── */

const STORY_IMAGES = [1, 2, 3, 4, 5].map((n) => ({
  src: `/images/success-couple-${n}.png`,
  label: `Couple ${n}`,
}));

/* ── FAQ questions mirrored read-only from landing/faq.tsx ─────── */

const FAQ_QUESTIONS = [
  "Is Qabiltoo free to use?",
  "How do you protect my privacy?",
  "How are profiles verified?",
  "Can my parents or wali be involved?",
  "Can I filter by sect and religious commitment?",
  "What happens after I send a proposal?",
];

const EMPTY_FORM = {
  coupleNames: "",
  title: "",
  quote: "",
  story: "",
  city: "",
  country: "India",
  marriedAt: "",
  image: STORY_IMAGES[0].src,
  featured: false,
};

type StoryForm = typeof EMPTY_FORM;

export function ContentTab() {
  const queryClient = useQueryClient();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<Record<string, { featured?: boolean; approved?: boolean }>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<StoryForm>(EMPTY_FORM);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "stories"],
    queryFn: async (): Promise<{ stories: SuccessStory[] }> => {
      const res = await fetch("/api/admin/stories");
      if (!res.ok) throw new Error("Failed to fetch stories");
      return res.json();
    },
  });

  const stories = data?.stories ?? [];

  const clearOverride = (id: string) =>
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

  const patchStory = async (story: SuccessStory, changes: { featured?: boolean; approved?: boolean }) => {
    setBusyId(story.id);
    setOverrides((prev) => ({ ...prev, [story.id]: { ...prev[story.id], ...changes } }));
    try {
      const res = await fetch(`/api/admin/stories/${story.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
      if (!res.ok) throw new Error("Request failed");
      toast({
        title: "Story updated",
        description: `${story.coupleNames} — changes are now live on the stories page.`,
      });
      clearOverride(story.id);
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    } catch {
      clearOverride(story.id);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "The story could not be updated. Please try again.",
      });
    } finally {
      setBusyId(null);
    }
  };

  const deleteStory = async (story: SuccessStory) => {
    setBusyId(story.id);
    try {
      const res = await fetch(`/api/admin/stories/${story.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Request failed");
      toast({
        title: "Story removed",
        description: `"${story.coupleNames}" has been deleted permanently.`,
      });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    } catch {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "The story could not be deleted. Please try again.",
      });
    } finally {
      setBusyId(null);
    }
  };

  const formValid =
    form.coupleNames.trim().length >= 2 &&
    form.title.trim().length >= 4 &&
    form.quote.trim().length >= 10 &&
    form.story.trim().length >= 30 &&
    form.city.trim().length >= 2 &&
    form.marriedAt.trim().length >= 2;

  const submitStory = async () => {
    if (!formValid) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coupleNames: form.coupleNames.trim(),
          title: form.title.trim(),
          quote: form.quote.trim(),
          story: form.story.trim(),
          city: form.city.trim(),
          country: form.country.trim() || "India",
          marriedAt: form.marriedAt.trim(),
          image: form.image,
          featured: form.featured,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Request failed");
      }
      toast({
        title: "Story published",
        description: `${form.coupleNames.trim()} is now part of the success stories.`,
      });
      setForm(EMPTY_FORM);
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Could not publish story",
        description: e instanceof Error ? e.message : "Please check the fields and try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const setField = <K extends keyof StoryForm>(key: K, value: StoryForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-foreground">Content desk</h2>
        <p className="text-sm text-muted-foreground">
          Curate the success stories shown on the site and review the published FAQ.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Success stories */}
        <Card className="gap-3 py-5 lg:col-span-3">
          <CardHeader className="px-5">
            <CardTitle className="flex flex-wrap items-center gap-2 font-display text-lg">
              <ScrollText className="h-5 w-5 text-gold-600" aria-hidden />
              Success stories
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                {isLoading ? "…" : stories.length}
              </span>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="btn-gold-shimmer ml-auto rounded-full bg-gold-500 text-emerald-950 hover:bg-gold-400"
                  >
                    <Plus className="h-4 w-4" aria-hidden />
                    Add story
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg scrollbar-thin">
                  <DialogHeader>
                    <DialogTitle className="font-display">Publish a success story</DialogTitle>
                    <DialogDescription>
                      Shared with dignity — a blessed outcome celebrated with the couple&apos;s
                      consent.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-1.5">
                      <Label htmlFor="story-couple">Couple names</Label>
                      <Input
                        id="story-couple"
                        placeholder="e.g. Ayesha & Imran"
                        value={form.coupleNames}
                        onChange={(e) => setField("coupleNames", e.target.value)}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="story-title">Title</Label>
                      <Input
                        id="story-title"
                        placeholder="A nikah written with patience"
                        value={form.title}
                        onChange={(e) => setField("title", e.target.value)}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="story-quote">Quote</Label>
                      <Textarea
                        id="story-quote"
                        rows={2}
                        placeholder="A short line from the couple…"
                        value={form.quote}
                        onChange={(e) => setField("quote", e.target.value)}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="story-body">Story</Label>
                      <Textarea
                        id="story-body"
                        rows={4}
                        placeholder="How the proposal unfolded, family involvement, and the blessing that followed… (min. 30 characters)"
                        value={form.story}
                        onChange={(e) => setField("story", e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-1.5">
                        <Label htmlFor="story-city">City</Label>
                        <Input
                          id="story-city"
                          placeholder="Hyderabad"
                          value={form.city}
                          onChange={(e) => setField("city", e.target.value)}
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="story-country">Country</Label>
                        <Input
                          id="story-country"
                          value={form.country}
                          onChange={(e) => setField("country", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="story-married">Married</Label>
                      <Input
                        id="story-married"
                        placeholder="March 2024"
                        value={form.marriedAt}
                        onChange={(e) => setField("marriedAt", e.target.value)}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label>Photo</Label>
                      <div className="grid grid-cols-5 gap-2">
                        {STORY_IMAGES.map((img) => (
                          <button
                            key={img.src}
                            type="button"
                            aria-label={`Select ${img.label} photo`}
                            aria-pressed={form.image === img.src}
                            onClick={() => setField("image", img.src)}
                            className={cn(
                              "overflow-hidden rounded-lg border-2 transition-all",
                              form.image === img.src
                                ? "border-gold-500 shadow-[0_0_10px_rgba(212,175,55,0.35)]"
                                : "border-transparent opacity-75 hover:opacity-100"
                            )}
                          >
                            <span className="relative block aspect-square">
                              <StoryThumb src={img.src} alt={img.label} className="h-full w-full" />
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={form.featured}
                        onCheckedChange={(v) => setField("featured", v === true)}
                      />
                      Feature on the landing page
                    </label>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={submitStory}
                      disabled={!formValid || saving}
                      className="btn-gold-shimmer rounded-full bg-gold-500 text-emerald-950 hover:bg-gold-400"
                    >
                      {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                      Publish story
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardTitle>
            <CardDescription>
              Toggle Featured to surface a story on the landing page; Approved stories appear in
              the public gallery.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5">
            {isLoading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-xl" />
                ))}
              </div>
            ) : stories.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="No stories yet"
                hint="Publish the first success story with the Add story button."
              />
            ) : (
              <div className="max-h-96 divide-y divide-border overflow-y-auto scrollbar-thin">
                {stories.map((story) => {
                  const featured = overrides[story.id]?.featured ?? story.featured;
                  const approved = overrides[story.id]?.approved ?? story.approved;
                  return (
                    <div
                      key={story.id}
                      className={cn(
                        "flex flex-wrap items-center gap-3 py-3 sm:flex-nowrap",
                        busyId === story.id && "opacity-60"
                      )}
                    >
                      <StoryThumb
                        src={story.image}
                        alt={`${story.coupleNames} photo`}
                        className="h-14 w-14"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-foreground">{story.coupleNames}</p>
                        <p className="truncate text-xs text-muted-foreground">{story.title}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {story.city}, {story.country} · Married {story.marriedAt}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-4">
                        <div className="flex flex-col items-center gap-1">
                          <Switch
                            checked={featured}
                            disabled={busyId === story.id}
                            onCheckedChange={(v) => patchStory(story, { featured: v })}
                            className="data-[state=checked]:bg-gold-500"
                            aria-label={`Toggle featured for ${story.coupleNames}`}
                          />
                          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            Featured
                          </span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <Switch
                            checked={approved}
                            disabled={busyId === story.id}
                            onCheckedChange={(v) => patchStory(story, { approved: v })}
                            aria-label={`Toggle approved for ${story.coupleNames}`}
                          />
                          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            Approved
                          </span>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={busyId === story.id}
                              aria-label={`Delete ${story.coupleNames}`}
                              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" aria-hidden />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove this success story?</AlertDialogTitle>
                              <AlertDialogDescription>
                                &quot;{story.coupleNames}&quot; will be permanently removed from
                                the stories page. This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Keep story</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteStory(story)}
                                className="bg-destructive text-white hover:bg-destructive/90"
                              >
                                Delete permanently
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* FAQ — read-only for the prototype */}
        <Card className="gap-3 py-5 lg:col-span-2">
          <CardHeader className="px-5">
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <Info className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden />
              FAQ entries
            </CardTitle>
            <CardDescription>
              FAQ entries are managed in the codebase for this demo — the list below mirrors the
              published Help Centre.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5">
            <ol className="max-h-96 divide-y divide-border overflow-y-auto scrollbar-thin">
              {FAQ_QUESTIONS.map((q, i) => (
                <li key={q} className="flex items-start gap-3 py-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-100 font-display text-xs font-semibold text-gold-700 dark:bg-gold-900/30 dark:text-gold-300">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{q}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Published · managed in <span className="font-mono">landing/faq.tsx</span>
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
