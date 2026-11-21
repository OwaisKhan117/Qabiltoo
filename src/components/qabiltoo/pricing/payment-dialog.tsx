"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Loader2, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/qabiltoo/store";
import type { Profile } from "@/lib/qabiltoo/types";
import { formatINR, perMonth, type Plan } from "./plans";

interface PaymentDialogProps {
  plan: Plan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Elegant "secure payment gateway" placeholder — the real gateway
 * (Razorpay / Stripe) will be connected here in a later phase.
 * In demo mode, paying activates the chosen membership instantly.
 */
export function PaymentDialog({ plan, open, onOpenChange }: PaymentDialogProps) {
  const [paying, setPaying] = useState(false);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  if (!plan) return null;

  const monthly = perMonth(plan);

  async function handleDemoPay() {
    if (!user) {
      toast({
        title: "Please sign in first",
        description: "Create your free account or sign in to activate a membership.",
      });
      onOpenChange(false);
      return;
    }
    setPaying(true);
    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: user.id, planId: plan!.id }),
      });
      const json = (await res.json()) as { profile?: Profile; error?: string };
      if (!res.ok || !json.profile) {
        throw new Error(json.error ?? "Payment could not be processed");
      }
      setUser(json.profile);
      toast({
        title: `${plan!.shortName} plan activated`,
        description: "Chat is now unlocked — barakallahu feek, may your search be blessed.",
      });
      onOpenChange(false);
    } catch (err) {
      toast({
        title: "We could not activate your plan",
        description: err instanceof Error ? err.message : "Please try again in a moment.",
      });
    } finally {
      setPaying(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden rounded-2xl p-0 sm:max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header band */}
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 px-6 py-6">
            <div
              className="pointer-events-none absolute inset-0 opacity-10"
              aria-hidden
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, #d4af37 1px, transparent 0)",
                backgroundSize: "18px 18px",
              }}
            />
            <DialogHeader className="relative text-left">
              <DialogTitle className="flex items-center gap-2.5 font-display text-xl text-white">
                <CreditCard className="h-5 w-5 text-gold-300" aria-hidden />
                Secure payment gateway
              </DialogTitle>
              <DialogDescription className="text-white/70">
                Integration placeholder — {plan.name}
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            {/* Gateway chips */}
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Pay with:</span>
              {["Razorpay", "Stripe", "UPI", "Cards"].map((g) => (
                <span
                  key={g}
                  className="inline-flex items-center rounded-md border border-gold-500/30 bg-gold-500/10 px-2.5 py-1 text-xs font-semibold text-gold-700 dark:text-gold-300"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Order summary */}
            <dl className="rounded-xl border border-gold-500/20 bg-cream/60 p-4 text-sm dark:bg-emerald-950/40">
              <div className="flex items-center justify-between py-1">
                <dt className="text-muted-foreground">Plan</dt>
                <dd className="font-semibold text-foreground">{plan.name}</dd>
              </div>
              <div className="flex items-center justify-between py-1">
                <dt className="text-muted-foreground">Duration</dt>
                <dd className="font-semibold text-foreground">{plan.duration}</dd>
              </div>
              {monthly !== null && (
                <div className="flex items-center justify-between py-1">
                  <dt className="text-muted-foreground">Per month equivalent</dt>
                  <dd className="text-foreground">₹{formatINR(monthly)}</dd>
                </div>
              )}
              <div className="mt-2 flex items-center justify-between border-t border-gold-500/20 pt-3">
                <dt className="font-semibold text-foreground">
                  {plan.durationMonths === null ? "One-time payment" : "Total due today"}
                </dt>
                <dd className="font-display text-xl font-bold text-gold-600 dark:text-gold-400">
                  ₹{formatINR(plan.price)}
                </dd>
              </div>
            </dl>

            {/* Demo pay button */}
            <Button
              size="lg"
              onClick={handleDemoPay}
              disabled={paying}
              className="btn-gold-shimmer mt-5 w-full font-semibold opacity-90 transition-opacity hover:opacity-100"
            >
              {paying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Activating…
                </>
              ) : (
                `Pay ₹${formatINR(plan.price)} (Demo)`
              )}
            </Button>

            {/* Trust microcopy */}
            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5 text-gold-600 dark:text-gold-400" aria-hidden />
              Cancel anytime · No hidden charges · Secure payments
            </p>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground/80">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              Your card details never touch our servers — processed by the gateway directly.
            </p>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
