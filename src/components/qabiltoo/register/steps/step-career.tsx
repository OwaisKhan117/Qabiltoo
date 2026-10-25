"use client";

import { GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Field, StepNav } from "../kit";
import type { StepProps } from "../onboarding";
import { EDUCATION_LEVELS, INCOME_BRACKETS } from "@/lib/qabiltoo/types";

/** Step 5 — Career & family */
export function StepCareer({ data, update, errors, onNext, onBack }: StepProps) {
  const aboutLen = data.about.trim().length;

  return (
    <section aria-labelledby="step-career-h">
      <h2 id="step-career-h" className="font-display text-2xl font-bold sm:text-3xl">
        Career &amp; Family
      </h2>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
        Work, education and family give context to your profile. Write as you would speak to a
        respected elder.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Highest education" error={errors.education}>
          <Select
            value={data.education || ""}
            onValueChange={(v) => update({ education: v })}
          >
            <SelectTrigger aria-label="Select highest education">
              <SelectValue placeholder="Select education" />
            </SelectTrigger>
            <SelectContent>
              {EDUCATION_LEVELS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Profession / occupation" htmlFor="ob-profession" error={errors.profession}>
          <Input
            id="ob-profession"
            placeholder="e.g. Software Engineer, Teacher…"
            value={data.profession}
            onChange={(e) => update({ profession: e.target.value })}
          />
        </Field>

        <Field
          label="Annual income"
          hint="Shared only with members you accept. Optional."
          className="sm:col-span-2"
        >
          <Select
            value={data.income || ""}
            onValueChange={(v) => update({ income: v === "prefer-not" ? "" : v })}
          >
            <SelectTrigger aria-label="Select annual income bracket">
              <SelectValue placeholder="Prefer not to say" />
            </SelectTrigger>
            <SelectContent>
              {INCOME_BRACKETS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
              <SelectItem value="prefer-not">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field
          label="About your family"
          htmlFor="ob-family"
          className="sm:col-span-2"
          hint="A warm line or two — values, city, and who is at home."
        >
          <Textarea
            id="ob-family"
            rows={3}
            placeholder="e.g. We are a close-knit family from Hyderabad. My father runs a business, my mother teaches Qur'an at home, and I have one younger brother studying engineering."
            value={data.familyInfo}
            onChange={(e) => update({ familyInfo: e.target.value.slice(0, 2000) })}
          />
        </Field>

        <Field
          label="About you"
          htmlFor="ob-about"
          error={errors.about}
          className="sm:col-span-2"
          hint={
            aboutLen < 30
              ? `${30 - aboutLen} more characters — help families know the real you`
              : "This appears beside you in the live preview."
          }
        >
          <Textarea
            id="ob-about"
            rows={5}
            placeholder="Speak from the heart — your deen, your work, your temperament, and the home you hope to build. For example: I try to keep my five salawat on time, enjoy long evening walks, and hope for a home filled with quiet contentment, good food and laughter."
            value={data.about}
            onChange={(e) => update({ about: e.target.value.slice(0, 2000) })}
          />
        </Field>

        <Field
          label="What you seek in a spouse"
          htmlFor="ob-partner"
          className="sm:col-span-2"
          hint="Optional, but families often read this first."
        >
          <Textarea
            id="ob-partner"
            rows={3}
            placeholder="What matters most to you — deen, character, ambitions, family closeness? Describe the qualities you hope for in a spouse."
            value={data.partnerPreference}
            onChange={(e) => update({ partnerPreference: e.target.value.slice(0, 2000) })}
          />
        </Field>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-gold-500/20 bg-gold-500/5 px-4 py-3 text-xs text-muted-foreground">
        <GraduationCap className="h-4 w-4 shrink-0 text-gold-600 dark:text-gold-300" aria-hidden />
        Honest, modest details receive the most serious responses. There is no need to impress —
        only to be truthful.
      </div>

      <StepNav onNext={onNext} onBack={onBack} />
    </section>
  );
}
