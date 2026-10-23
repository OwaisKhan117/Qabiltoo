"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { Loader2, UserRoundPlus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PatternOverlay } from "../pattern";
import { useAuthStore } from "@/lib/qabiltoo/store";
import {
  MARITAL_STATUSES,
  NAMAZ_OPTIONS,
  RELIGIOUS_LEVELS,
  SECTS,
  type Profile,
  type View,
} from "@/lib/qabiltoo/types";
import { cn } from "@/lib/utils";

const schema = z.object({
  fullName: z.string().min(2, "Please enter your full name").max(80),
  gender: z.enum(["male", "female"]),
  age: z.coerce.number().int().min(18, "Minimum age is 18").max(80),
  height: z.string().min(3, "Please select height"),
  city: z.string().min(2, "City is required").max(60),
  state: z.string().min(2, "State is required").max(60),
  email: z.string().email("Enter a valid email"),
  maritalStatus: z.string().min(2),
  sect: z.string().min(1, "Select your sect"),
  religiousLevel: z.string().min(1),
  namaz: z.string().min(1),
  education: z.string().min(2, "Education is required").max(120),
  profession: z.string().min(2, "Profession is required").max(120),
  income: z.string().max(60).optional(),
  about: z.string().min(30, "Tell us a bit more (at least 30 characters)").max(2000),
  partnerPreference: z.string().max(2000).optional(),
  image: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

const HEIGHTS = [
  "4 ft 8 in", "4 ft 10 in", "5 ft 0 in", "5 ft 1 in", "5 ft 2 in", "5 ft 3 in",
  "5 ft 4 in", "5 ft 5 in", "5 ft 6 in", "5 ft 7 in", "5 ft 8 in", "5 ft 9 in",
  "5 ft 10 in", "5 ft 11 in", "6 ft 0 in", "6 ft 1 in", "6 ft 2 in", "6 ft 3 in",
];

const FEMALE_IMAGES = ["/images/profile-f1.png", "/images/profile-f2.png", "/images/profile-f3.png", "/images/profile-f4.png"];
const MALE_IMAGES = ["/images/profile-m1.png", "/images/profile-m2.png", "/images/profile-m3.png", "/images/profile-m4.png"];

interface RegisterViewProps {
  navigate: (view: View) => void;
}

export function RegisterView({ navigate }: RegisterViewProps) {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const setUser = useAuthStore((s) => s.setUser);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      gender: "female",
      height: "5 ft 4 in",
      maritalStatus: "Never Married",
      sect: "Sunni",
      religiousLevel: "Moderate",
      namaz: "Regularly",
      image: FEMALE_IMAGES[0],
    },
  });

  const gender = watch("gender");
  const image = watch("image");
  const avatarOptions = gender === "female" ? FEMALE_IMAGES : MALE_IMAGES;

  // switch avatar if gender changes
  function handleGenderChange(g: "male" | "female") {
    setValue("gender", g);
    const options = g === "female" ? FEMALE_IMAGES : MALE_IMAGES;
    if (!options.includes(watch("image"))) setValue("image", options[0]);
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, income: values.income || null }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error ?? "Failed to create profile");
        return;
      }
      setUser(data.profile as Profile);
      toast({
        title: "Profile created — Barakallahu feek! 🌙",
        description: "You're all set. Start exploring your qabil matches now.",
      });
      navigate({ name: "browse", gender: values.gender === "female" ? "male" : "female" });
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative">
      <div className="relative overflow-hidden bg-primary pb-28 pt-10 text-primary-foreground">
        <PatternOverlay className="text-white/10" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <UserRoundPlus className="mx-auto mb-3 h-8 w-8 text-gold-300" />
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Create Your Profile</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-primary-foreground/85 sm:text-base">
            Free forever. Takes 3 minutes. Your journey to a blessed nikah starts here.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto -mt-16 max-w-3xl space-y-6 px-4 pb-16 sm:px-6"
      >
        {/* Personal */}
        <fieldset className="rounded-3xl border border-border bg-card p-6 shadow-lg shadow-primary/5 sm:p-8">
          <legend className="sr-only">Personal details</legend>
          <h2 className="mb-5 font-display text-xl font-bold">1 · Personal Details</h2>

          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" placeholder="e.g. Ayesha Khan" {...register("fullName")} />
                {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (used to sign in)</Label>
                <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>I am a</Label>
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    { value: "female", label: "Bride", desc: "Looking for a groom" },
                    { value: "male", label: "Groom", desc: "Looking for a bride" },
                  ] as const
                ).map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => handleGenderChange(opt.value)}
                    aria-pressed={gender === opt.value}
                    className={cn(
                      "rounded-2xl border-2 p-4 text-left transition-all",
                      gender === opt.value
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <p className="font-display text-lg font-bold">{opt.label}</p>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Avatar picker */}
            <div className="space-y-2">
              <Label>Choose a profile photo</Label>
              <div className="grid grid-cols-4 gap-3">
                {avatarOptions.map((src) => (
                  <button
                    type="button"
                    key={src}
                    onClick={() => setValue("image", src)}
                    aria-pressed={image === src}
                    aria-label={`Select profile photo option ${src}`}
                    className={cn(
                      "relative aspect-[4/5] overflow-hidden rounded-2xl border-2 transition-all",
                      image === src
                        ? "border-gold-500 ring-2 ring-gold-500/40"
                        : "border-transparent opacity-70 hover:opacity-100"
                    )}
                  >
                    <Image src={src} alt="" fill sizes="120px" className="object-cover" />
                    {image === src && (
                      <span className="absolute bottom-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-gold-500">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Demo photos — you can update yours after sign-up.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" min={18} max={80} placeholder="24" {...register("age")} />
                {errors.age && <p className="text-xs text-destructive">{errors.age.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Height</Label>
                <Select defaultValue="5 ft 4 in" onValueChange={(v) => setValue("height", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {HEIGHTS.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.height && <p className="text-xs text-destructive">{errors.height.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Marital status</Label>
                <Select defaultValue="Never Married" onValueChange={(v) => setValue("maritalStatus", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MARITAL_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="e.g. Mumbai" {...register("city")} />
                {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" placeholder="e.g. Maharashtra" {...register("state")} />
                {errors.state && <p className="text-xs text-destructive">{errors.state.message}</p>}
              </div>
            </div>
          </div>
        </fieldset>

        {/* Faith */}
        <fieldset className="rounded-3xl border border-border bg-card p-6 shadow-lg shadow-primary/5 sm:p-8">
          <legend className="sr-only">Faith and lifestyle</legend>
          <h2 className="mb-5 font-display text-xl font-bold">2 · Faith &amp; Lifestyle</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Sect</Label>
              <Select defaultValue="Sunni" onValueChange={(v) => setValue("sect", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SECTS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Religious level</Label>
              <Select defaultValue="Moderate" onValueChange={(v) => setValue("religiousLevel", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RELIGIOUS_LEVELS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Namaz</Label>
              <Select defaultValue="Regularly" onValueChange={(v) => setValue("namaz", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NAMAZ_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </fieldset>

        {/* Career */}
        <fieldset className="rounded-3xl border border-border bg-card p-6 shadow-lg shadow-primary/5 sm:p-8">
          <legend className="sr-only">Education and career</legend>
          <h2 className="mb-5 font-display text-xl font-bold">3 · Education &amp; Career</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="education">Highest education</Label>
              <Input id="education" placeholder="e.g. B.Tech Computer Science" {...register("education")} />
              {errors.education && <p className="text-xs text-destructive">{errors.education.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="profession">Profession</Label>
              <Input id="profession" placeholder="e.g. Software Engineer" {...register("profession")} />
              {errors.profession && <p className="text-xs text-destructive">{errors.profession.message}</p>}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="income">Annual income (optional)</Label>
              <Input id="income" placeholder="e.g. ₹12–15 LPA" {...register("income")} />
            </div>
          </div>
        </fieldset>

        {/* About */}
        <fieldset className="rounded-3xl border border-border bg-card p-6 shadow-lg shadow-primary/5 sm:p-8">
          <legend className="sr-only">About you</legend>
          <h2 className="mb-5 font-display text-xl font-bold">4 · About You</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="about">About yourself</Label>
              <Textarea
                id="about"
                rows={5}
                placeholder="Share your values, interests, family background and what matters most to you in life…"
                {...register("about")}
              />
              {errors.about && <p className="text-xs text-destructive">{errors.about.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="partnerPreference">What are you looking for? (optional)</Label>
              <Textarea
                id="partnerPreference"
                rows={4}
                placeholder="Describe your ideal partner and what you value in a marriage…"
                {...register("partnerPreference")}
              />
            </div>
          </div>
        </fieldset>

        {serverError && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <div className="flex flex-col items-center gap-3 pb-4">
          <Button type="submit" size="lg" className="w-full max-w-md rounded-full text-base" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Creating your profile…
              </>
            ) : (
              "Create My Profile — Free"
            )}
          </Button>
          <p className="text-xs text-muted-foreground">
            By joining you agree to our values: respectful conduct, honest profiles and
            guardian-first interactions.
          </p>
        </div>
      </form>
    </main>
  );
}
