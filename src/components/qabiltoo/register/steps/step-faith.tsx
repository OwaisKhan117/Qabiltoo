"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, StepNav } from "../kit";
import type { StepProps } from "../onboarding";
import {
  HIJAB_BEARD_OPTIONS,
  NAMAZ_OPTIONS,
  QURAN_LEVELS,
  RELIGIOUS_LEVELS,
  SECTS,
} from "@/lib/qabiltoo/types";

/** Step 4 — Faith & practice */
export function StepFaith({ data, update, errors, onNext, onBack }: StepProps) {
  const isFemale = data.gender === "female";
  const hbLabel = isFemale ? "Hijab" : "Beard";
  const hbQuestion = isFemale
    ? "Do you observe hijab?"
    : "Do you keep a beard?";

  return (
    <section aria-labelledby="step-faith-h">
      <h2 id="step-faith-h" className="font-display text-2xl font-bold sm:text-3xl">
        Faith &amp; Practice
      </h2>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
        Deen is the foundation of a blessed home. Share your practice honestly — sincerity here
        matters far more than appearance.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Sect" error={errors.sect}>
          <Select value={data.sect || ""} onValueChange={(v) => update({ sect: v })}>
            <SelectTrigger aria-label="Select sect">
              <SelectValue placeholder="Select sect" />
            </SelectTrigger>
            <SelectContent>
              {SECTS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Religious level" error={errors.religiousLevel}>
          <Select
            value={data.religiousLevel || ""}
            onValueChange={(v) => update({ religiousLevel: v })}
          >
            <SelectTrigger aria-label="Select religious level">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {RELIGIOUS_LEVELS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Namaz" error={errors.namaz}>
          <Select value={data.namaz || ""} onValueChange={(v) => update({ namaz: v })}>
            <SelectTrigger aria-label="Select namaz habit">
              <SelectValue placeholder="Select habit" />
            </SelectTrigger>
            <SelectContent>
              {NAMAZ_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Qur'an" error={errors.quranLevel}>
          <Select
            value={data.quranLevel || ""}
            onValueChange={(v) => update({ quranLevel: v })}
          >
            <SelectTrigger aria-label="Select Quran level">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {QURAN_LEVELS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label={hbLabel} error={errors.hijabBeard} hint={hbQuestion} className="sm:col-span-2">
          <Select
            value={data.hijabBeard || ""}
            onValueChange={(v) => update({ hijabBeard: v })}
          >
            <SelectTrigger aria-label={`Select ${hbLabel.toLowerCase()} practice`}>
              <SelectValue placeholder="Select one" />
            </SelectTrigger>
            <SelectContent>
              {HIJAB_BEARD_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <StepNav onNext={onNext} onBack={onBack} />
    </section>
  );
}
