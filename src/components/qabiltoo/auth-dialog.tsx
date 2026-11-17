"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogoMark } from "./logo";
import { useAuthStore } from "@/lib/qabiltoo/store";
import type { Profile } from "@/lib/qabiltoo/types";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoRegister: () => void;
  /** Called after a successful sign-in (used to navigate + welcome the user). */
  onLoggedIn?: (profile: Profile) => void;
}

const DEMO_EMAIL = "ayesha@demo.qabiltoo.in";

export function AuthDialog({ open, onOpenChange, onGoRegister, onLoggedIn }: AuthDialogProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setUser = useAuthStore((s) => s.setUser);

  async function login(withEmail: string, isDemo = false) {
    if (isDemo) setLoadingDemo(true);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: withEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }
      setUser(data.profile as Profile);
      onOpenChange(false);
      setEmail("");
      onLoggedIn?.(data.profile as Profile);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setLoadingDemo(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <LogoMark className="h-9 w-9" />
          </div>
          <DialogTitle className="text-center font-display text-2xl">
            Assalamu Alaikum
          </DialogTitle>
          <DialogDescription className="text-center">
            Sign in to send interests, receive proposals and manage your journey to nikah.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            login(email);
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="login-email">Email address</Label>
            <Input
              id="login-email"
              type="text"
              inputMode="email"
              placeholder="you@example.com  —  or just type: ayesha"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Demo login: no password needed — type <span className="font-semibold text-foreground">ayesha</span> and press Sign In.
            </p>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-popover px-3 text-xs uppercase tracking-wider text-muted-foreground">
              or
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            variant="secondary"
            className="w-full"
            disabled={loading}
            onClick={() => login(DEMO_EMAIL, true)}
          >
            {loadingDemo ? "Signing in as Ayesha…" : "Try the demo account (Ayesha)"}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              onOpenChange(false);
              onGoRegister();
            }}
          >
            Create a free profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
