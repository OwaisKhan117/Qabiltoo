"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Field, StepNav } from "../kit";
import { HEIGHTS, type StepProps } from "../onboarding";
import { MARITAL_STATUSES } from "@/lib/qabiltoo/types";

/** Step 3 — Basic information */
export function StepBasic({ data, update, errors, onNext, onBack }: StepProps) {
  return (
    <section aria-labelledby="step-basic-h">
      <h2 id="step-basic-h" className="font-display text-2xl font-bold sm:text-3xl">
        The Basics
      </h2>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
        Tell families who you are — name, age and where home is. The preview beside you updates
        as you type.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Full name" htmlFor="ob-fullName" error={errors.fullName} className="sm:col-span-2">
          <Input
            id="ob-fullName"
            placeholder="e.g. Ayesha Khan"
            autoComplete="name"
            value={data.fullName}
            onChange={(e) => update({ fullName: e.target.value })}
          />
        </Field>

        <Field label="Age" htmlFor="ob-age" error={errors.age} hint="For adults aged 18 and above">
          <Input
            id="ob-age"
            inputMode="numeric"
            placeholder="24"
            value={data.age}
            onChange={(e) => update({ age: e.target.value.replace(/\D/g, "").slice(0, 2) })}
          />
        </Field>

        <Field label="Height" error={errors.height}>
          <Select value={data.height || ""} onValueChange={(v) => update({ height: v })}>
            <SelectTrigger aria-label="Select height">
              <SelectValue placeholder="Select height" />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              {HEIGHTS.map((h) => (
                <SelectItem key={h} value={h}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="City" htmlFor="ob-city" error={errors.city}>
          <Input
            id="ob-city"
            placeholder="e.g. Mumbai"
            autoComplete="address-level2"
            value={data.city}
            onChange={(e) => update({ city: e.target.value })}
          />
        </Field>

        <Field label="State" htmlFor="ob-state" error={errors.state}>
          <Input
            id="ob-state"
            placeholder="e.g. Maharashtra"
            autoComplete="address-level1"
            value={data.state}
            onChange={(e) => update({ state: e.target.value })}
          />
        </Field>

        <Field label="Marital status">
          <Select
            value={data.maritalStatus}
            onValueChange={(v) => update({ maritalStatus: v })}
          >
            <SelectTrigger aria-label="Select marital status">
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
        </Field>

        <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 p-4 sm:col-span-2">
          <div>
            <p className="text-sm font-medium">Open to relocating</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Willing to move to another city — or abroad — after nikah.
            </p>
          </div>
          <Switch
            checked={data.relocate}
            onCheckedChange={(v) => update({ relocate: v })}
            aria-label="Willing to relocate after nikah"
          />
        </div>
      </div>

      <StepNav onNext={onNext} onBack={onBack} />
    </section>
  );
}
