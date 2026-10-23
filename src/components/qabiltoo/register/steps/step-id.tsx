"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FileText, ShieldCheck, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarLoader } from "../../shared/star-loader";
import { cn } from "@/lib/utils";
import { StepNav } from "../kit";
import type { StepProps } from "../onboarding";

const DOC_TYPES = ["Aadhaar", "Passport", "Driving Licence"] as const;

function GoldCheck() {
  return (
    <motion.svg
      viewBox="0 0 52 52"
      className="h-20 w-20"
      role="img"
      aria-label="Document received"
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      <motion.circle
        cx="26"
        cy="26"
        r="23"
        fill="none"
        stroke="#d4af37"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      <motion.path
        d="M15.5 27 L23 34.5 L37 19"
        fill="none"
        stroke="#d4af37"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.45, duration: 0.45, ease: "easeOut" }}
      />
    </motion.svg>
  );
}

/** Step 7 — ID verification (mandatory-feeling, simulated in demo) */
export function StepId({
  data,
  update,
  onNext,
  onBack,
  submitting,
}: StepProps & { submitting: boolean }) {
  const [phase, setPhase] = useState<"idle" | "verifying" | "done">(
    data.idVerified ? "done" : "idle"
  );
  const fileRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  function pick(file: File | undefined) {
    if (!file) return;
    update({ idFileName: file.name });
    setPhase("idle");
  }

  function runVerify() {
    if (!data.idFileName || phase === "verifying") return;
    setPhase("verifying");
    timerRef.current = window.setTimeout(() => {
      setPhase("done");
      update({ idVerified: true });
    }, 2500);
  }

  return (
    <section aria-labelledby="step-id-h">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-500/12 text-gold-600 dark:text-gold-300">
        <ShieldCheck className="h-5 w-5" aria-hidden />
      </span>
      <h2 id="step-id-h" className="mt-3 font-display text-2xl font-bold sm:text-3xl">
        Identity verification
      </h2>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
        Every profile on Qabiltoo is identity-checked. Upload any one government ID — it is
        reviewed privately by our team and never shown to members.
      </p>

      <div className="mt-6 max-w-xl rounded-3xl border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {DOC_TYPES.map((t) => (
            <span
              key={t}
              className="rounded-full border border-gold-500/25 bg-gold-500/5 px-3 py-1 text-xs text-gold-700 dark:text-gold-300"
            >
              {t}
            </span>
          ))}
          <span className="ml-auto rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
            Required
          </span>
        </div>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          aria-label="Attach a government ID document"
          className={cn(
            "mt-4 flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 transition-colors",
            data.idFileName
              ? "border-gold-500/60 bg-gold-500/5"
              : "border-border hover:border-gold-500/50 hover:bg-gold-500/5"
          )}
        >
          {data.idFileName ? (
            <>
              <FileText className="h-6 w-6 text-gold-600 dark:text-gold-300" aria-hidden />
              <span className="max-w-full truncate text-sm font-medium">{data.idFileName}</span>
              <span className="text-xs text-muted-foreground">Tap to choose a different file</span>
            </>
          ) : (
            <>
              <Upload className="h-6 w-6 text-muted-foreground" aria-hidden />
              <span className="text-sm">
                <span className="font-medium">Attach your ID</span>
                <span className="text-muted-foreground"> — image or PDF</span>
              </span>
            </>
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => pick(e.target.files?.[0])}
        />

        {phase === "idle" && (
          <Button
            type="button"
            onClick={runVerify}
            disabled={!data.idFileName}
            className="btn-gold-shimmer mt-4 w-full rounded-full"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden /> Verify my ID
          </Button>
        )}

        {phase === "verifying" && (
          <div role="status" aria-live="polite" className="mt-6 flex flex-col items-center gap-3">
            <StarLoader size={56} />
            <p className="text-sm font-medium">Verifying your document…</p>
            <p className="text-xs text-muted-foreground">This takes only a moment.</p>
          </div>
        )}

        {phase === "done" && (
          <div className="mt-6 flex flex-col items-center gap-2 text-center">
            <GoldCheck />
            <p className="mt-1 font-display text-lg font-semibold">Document received</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Our team reviews it within 24 hours. Your profile shows a blue &ldquo;ID
              Verified&rdquo; badge once approved.
            </p>
            <p className="mt-1 rounded-full bg-muted px-3 py-1 text-[11px] text-muted-foreground">
              Demo: verification is simulated — nothing is uploaded or stored.
            </p>
          </div>
        )}
      </div>

      <StepNav
        onNext={onNext}
        onBack={onBack}
        nextLabel="Complete Registration"
        nextDisabled={phase !== "done"}
        busy={submitting}
        hint={phase !== "done" ? "Verification is required before finishing" : undefined}
      />
    </section>
  );
}
