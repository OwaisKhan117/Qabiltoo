"use client";

import { useEffect, useState } from "react";
import { Loader2, Phone, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/qabiltoo/store";
import {
  displayName,
  type OtpSendResponse,
  type OtpVerifyResponse,
  type View,
} from "@/lib/qabiltoo/types";
import { cn } from "@/lib/utils";
import { FieldError, StepNav } from "../kit";
import type { StepProps } from "../onboarding";

type VerifyData = OtpVerifyResponse & { isNew?: boolean };

/** Step 2 — Phone verification (demo OTP) */
export function StepPhone({
  data,
  update,
  onNext,
  onBack,
  navigate,
}: StepProps & { navigate: (v: View) => void }) {
  const setUser = useAuthStore((s) => s.setUser);

  const [national, setNational] = useState(
    data.phone.startsWith("+91") ? data.phone.slice(3) : ""
  );
  const [phase, setPhase] = useState<"input" | "code">("input");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [isNewAccount, setIsNewAccount] = useState<boolean | null>(null);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);

  /* 60s resend countdown (self-chaining timeout) */
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const phone = `+91${national}`;
  const phoneValid = /^[6-9]\d{9}$/.test(national);

  async function sendCode(resend = false) {
    if (!phoneValid || sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const json = (await res.json()) as OtpSendResponse & { error?: string };
      if (!res.ok || !json.sent) {
        setError(json.error ?? "We could not send the code. Please try again.");
        return;
      }
      update({ phone });
      setDevCode(json.devCode);
      setIsNewAccount(json.isNew);
      setPhase("code");
      setOtp("");
      setResendIn(60);
      if (resend) {
        toast({
          title: "A new code has been sent",
          description: "Demo mode — your code is 1234.",
        });
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  async function verify(code: string) {
    if (code.length !== 4 || verifying) return;
    setVerifying(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const json = (await res.json()) as VerifyData;
      if (!res.ok || !json.ok) {
        setError(json.error ?? "That code did not match. Please try again.");
        setOtp("");
        return;
      }
      if (json.profile) {
        /* Existing account — sign them straight in */
        setUser(json.profile);
        toast({
          title: "Welcome back",
          description: `Assalamu Alaikum, ${displayName(json.profile.fullName)} — continuing your journey.`,
        });
        navigate({ name: "browse" });
        return;
      }
      /* New member — onboarding continues */
      onNext();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setVerifying(false);
    }
  }

  return (
    <section aria-labelledby="step-phone-h">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-500/12 text-gold-600 dark:text-gold-300">
        <ShieldCheck className="h-5 w-5" aria-hidden />
      </span>
      <h2 id="step-phone-h" className="mt-3 font-display text-2xl font-bold sm:text-3xl">
        Verify your phone
      </h2>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
        Every member is verified by phone so Qabiltoo stays sincere and safe. If you already have
        an account, this signs you back in.
      </p>

      {phase === "input" ? (
        <div className="mt-6 max-w-md space-y-4">
          <div className="space-y-2">
            <label htmlFor="ob-phone" className="text-sm font-medium leading-none">
              Mobile number
            </label>
            <div className="flex">
              <span
                aria-hidden
                className="flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground"
              >
                +91
              </span>
              <Input
                id="ob-phone"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="98765 43210"
                className="rounded-l-none"
                value={national}
                onChange={(e) => setNational(e.target.value.replace(/\D/g, "").slice(0, 10))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && phoneValid) void sendCode();
                }}
              />
            </div>
            {error && <FieldError>{error}</FieldError>}
          </div>

          <StepNav
            onBack={onBack}
            onNext={() => void sendCode()}
            nextLabel="Send Code"
            busy={sending}
            nextDisabled={!phoneValid}
            hint={phoneValid ? undefined : "Enter a valid 10-digit mobile number"}
          />
        </div>
      ) : (
        <div className="mt-6 max-w-md space-y-5">
          <p className="text-sm text-muted-foreground">
            Code sent to{" "}
            <span className="font-medium text-foreground">
              +91 {national.slice(0, 5)} {national.slice(5)}
            </span>
            . {isNewAccount === false
              ? "Welcome back — enter it to sign in."
              : "Great — enter it to begin your profile."}
          </p>

          {devCode && (
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1.5 text-xs text-gold-700 dark:text-gold-300">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              <span>
                Demo mode — your code is{" "}
                <strong className="font-semibold tracking-[0.25em]">{devCode}</strong>
              </span>
            </p>
          )}

          <div aria-live="polite" className="space-y-2">
            <InputOTP
              maxLength={4}
              value={otp}
              onChange={setOtp}
              onComplete={(v) => void verify(v)}
              disabled={verifying}
              aria-label="Enter the 4-digit verification code"
            >
              <InputOTPGroup>
                {[0, 1, 2, 3].map((i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="h-12 w-11 border-gold-500/30 text-lg font-semibold first:rounded-l-xl last:rounded-r-xl"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
            {error && <FieldError>{error}</FieldError>}
          </div>

          <div className="flex items-center gap-3">
            {resendIn > 0 ? (
              <p className="text-sm text-muted-foreground">
                Resend code in{" "}
                <span className="font-medium tabular-nums text-foreground">{resendIn}s</span>
              </p>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => void sendCode(true)}
                disabled={sending}
                className="rounded-full px-3"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", sending && "animate-spin")} aria-hidden />
                Resend code
              </Button>
            )}
          </div>

          <StepNav
            onBack={() => {
              setPhase("input");
              setOtp("");
              setError(null);
            }}
            onNext={() => void verify(otp)}
            nextLabel="Verify"
            busy={verifying}
            nextDisabled={otp.length !== 4}
          />
        </div>
      )}

      <p className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Phone className="h-3 w-3" aria-hidden />
        This demo does not send real SMS — the code appears on screen.
      </p>
    </section>
  );
}
