"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/qabiltoo/store";
import type { Profile, View } from "@/lib/qabiltoo/types";
import { cn } from "@/lib/utils";
import { PatternOverlay } from "../pattern";
import { PreviewCard } from "./preview-card";
import { StarProgress } from "./progress";
import { DEFAULT_DATA, buildPayload, validateStep, type OnboardingData } from "./onboarding";
import { StepIntent } from "./steps/step-intent";
import { StepPhone } from "./steps/step-phone";
import { StepBasic } from "./steps/step-basic";
import { StepFaith } from "./steps/step-faith";
import { StepCareer } from "./steps/step-career";
import { StepPhoto } from "./steps/step-photo";
import { StepId } from "./steps/step-id";
import { StepComplete } from "./steps/step-complete";

const TOTAL_STEPS = 8;

const stepVariants: Variants = {
  enter: (dir: number) => ({ x: dir >= 0 ? 56 : -56, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir >= 0 ? -56 : 56, opacity: 0 }),
};

interface RegisterViewProps {
  navigate: (view: View) => void;
}

export function RegisterView({ navigate }: RegisterViewProps) {
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState<OnboardingData>(DEFAULT_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);

  const update = useCallback((patch: Partial<OnboardingData>) => {
    setData((d) => ({ ...d, ...patch }));
    setErrors({});
  }, []);

  const advance = useCallback(() => {
    setErrors({});
    setDir(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }, []);

  const goBack = useCallback(() => {
    setErrors({});
    setDir(-1);
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  /** Gated advance — validates the current step before moving on */
  const goNext = useCallback(() => {
    const errs = validateStep(step, data);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    advance();
  }, [step, data, advance]);

  /** Final submission → POST /api/profiles → completion screen */
  async function finish() {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(data)),
      });
      const json = (await res.json()) as { profile?: Profile; error?: string };

      if (res.status === 409) {
        toast({
          title: "Account exists — please sign in",
          description:
            "A profile with this phone number is already registered. Sign in to continue your journey.",
        });
        navigate({ name: "landing" });
        return;
      }
      if (!res.ok || !json.profile) {
        toast({
          title: "We could not complete your registration",
          description: json.error ?? "Please review your details and try again.",
        });
        return;
      }

      setUser(json.profile);
      toast({
        title: "Profile created — Barakallahu feek",
        description: "Welcome to Qabiltoo. May your journey be blessed.",
      });
      advance();
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please check your connection and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const showPreview = step >= 3 && step <= 6;

  function renderStep() {
    const base = { data, update, errors, onNext: goNext, onBack: goBack };
    switch (step) {
      case 1:
        return <StepIntent {...base} />;
      case 2:
        return <StepPhone {...base} navigate={navigate} />;
      case 3:
        return <StepBasic {...base} />;
      case 4:
        return <StepFaith {...base} />;
      case 5:
        return <StepCareer {...base} />;
      case 6:
        return <StepPhoto {...base} />;
      case 7:
        return <StepId {...base} onNext={finish} submitting={submitting} />;
      case 8:
        return <StepComplete data={data} navigate={navigate} />;
      default:
        return null;
    }
  }

  return (
    <main className="relative">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-gold-500/15 bg-gradient-to-b from-gold-500/10 via-background to-background">
        <PatternOverlay className="text-gold-600/10" />
        <div className="relative mx-auto max-w-3xl px-4 pb-8 pt-10 text-center sm:px-6">
          <p className="font-arabic text-xl leading-relaxed text-gold-600 dark:text-gold-300" aria-hidden>
            بسم الله
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
            Begin Your Journey to Nikah
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            A serious, halal path — verified members, guardian-friendly, free to begin.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6">
        <StarProgress step={step} complete={step === TOTAL_STEPS} />

        <div
          className={cn(
            "mt-8",
            showPreview && "lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-10"
          )}
        >
          <div className="min-w-0">
            {/* Mobile live-preview toggle (top) */}
            {showPreview && (
              <div className="mb-5 lg:hidden">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setMobilePreview((v) => !v)}
                  aria-expanded={mobilePreview}
                  className="rounded-full border-gold-500/40"
                >
                  {mobilePreview ? (
                    <EyeOff className="h-4 w-4" aria-hidden />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden />
                  )}
                  {mobilePreview ? "Hide live preview" : "See live preview"}
                </Button>
                <AnimatePresence initial={false}>
                  {mobilePreview && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4">
                        <PreviewCard data={data} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.div
                key={step}
                custom={dir}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sticky live preview — desktop */}
          {showPreview && (
            <aside className="hidden lg:block" aria-label="Live profile preview">
              <div className="sticky top-24">
                <PreviewCard data={data} />
                <p className="mt-3 px-1 text-xs leading-relaxed text-muted-foreground">
                  This is how sincere families will first meet you. Fill it with honesty and
                  modesty — there is no need to impress, only to be truthful.
                </p>
              </div>
            </aside>
          )}
        </div>
      </div>
    </main>
  );
}
