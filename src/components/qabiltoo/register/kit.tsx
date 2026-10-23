"use client";

import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* Gentle, quiet field error — no aggressive red walls */
export function FieldError({ children }: { children: ReactNode }) {
  return (
    <p className="text-[13px] leading-snug text-rose-600/90 dark:text-rose-400/90">{children}</p>
  );
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? <FieldError>{error}</FieldError> : hint ? (
        <p className="text-xs leading-snug text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

/** Elegant selectable card used for intent choices, photo options, etc. */
export function OptionCard({
  selected,
  onSelect,
  icon,
  title,
  subtitle,
  className,
}: {
  selected: boolean;
  onSelect: () => void;
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group relative flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-200",
        selected
          ? "border-gold-500 bg-gold-500/5 shadow-[0_0_0_3px_rgba(212,175,55,0.14)]"
          : "border-border bg-card hover:border-gold-500/40 hover:bg-gold-500/[0.03]",
        className
      )}
    >
      {icon && (
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
            selected
              ? "bg-gold-500/15 text-gold-600 dark:text-gold-300"
              : "bg-muted text-muted-foreground group-hover:text-gold-600 dark:group-hover:text-gold-300"
          )}
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block font-display text-base font-semibold leading-snug">{title}</span>
        {subtitle && (
          <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
            {subtitle}
          </span>
        )}
      </span>
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          selected ? "border-gold-500 bg-gold-500" : "border-muted-foreground/30"
        )}
      >
        {selected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
      </span>
    </button>
  );
}

export function StepNav({
  onBack,
  onNext,
  nextLabel = "Continue",
  nextDisabled = false,
  busy = false,
  hint,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  busy?: boolean;
  hint?: string;
}) {
  return (
    <div className="mt-8 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
      {onBack ? (
        <Button type="button" variant="ghost" onClick={onBack} className="rounded-full">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back
        </Button>
      ) : (
        <span aria-hidden className="hidden sm:block" />
      )}
      <div className="flex flex-col items-stretch gap-1.5 sm:items-end">
        {hint && <p className="text-xs text-muted-foreground sm:text-right">{hint}</p>}
        <Button
          type="button"
          onClick={onNext}
          disabled={nextDisabled || busy}
          className="btn-gold-shimmer rounded-full px-8"
        >
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Please wait…
            </>
          ) : (
            <>
              {nextLabel}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
