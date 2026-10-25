"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Heart, Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/qabiltoo/store";
import type { Profile } from "@/lib/qabiltoo/types";

const TEMPLATES = [
  "Assalamu Alaikum! I came across your profile and it resonated with me. I would be honored if our families could connect. JazakAllah khair.",
  "Assalamu Alaikum. Your balance of deen and ambition is admirable. I would be grateful if our families could be introduced.",
  "Assalamu Alaikum. MashaAllah on a thoughtful profile — I would welcome a respectful, family-first conversation.",
];

interface SendInterestDialogProps {
  profile: Profile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function SendInterestDialog({ profile, open, onOpenChange, onSuccess }: SendInterestDialogProps) {
  const [message, setMessage] = useState(TEMPLATES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((s) => s.user);

  async function send() {
    if (!profile) return;
    if (!user) {
      setError("Please sign in first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromId: user.id, toId: profile.id, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to send proposal");
        return;
      }
      onOpenChange(false);
      onSuccess();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500/15">
              <Heart className="h-4.5 w-4.5 fill-gold-500 text-gold-500" />
            </span>
            Send Proposal
          </DialogTitle>
          <DialogDescription>
            {profile
              ? `Express your interest in ${profile.fullName.split(" ")[0]} respectfully — proposals here are family-first and reviewed with dignity. Insha'Allah.`
              : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {TEMPLATES.map((t, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setMessage(t)}
                className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-gold-400 hover:text-gold-700 dark:hover:text-gold-400"
              >
                Template {i + 1}
              </button>
            ))}
          </div>
          <Label htmlFor="interest-message">Your message</Label>
          <Textarea
            id="interest-message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={600}
            className="resize-none"
          />
          <p className="text-right text-xs text-muted-foreground">{message.length}/600</p>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={send} disabled={loading || message.trim().length < 5}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Sending…
              </>
            ) : (
              <>
                <Heart className="h-4 w-4" /> Send with Dua
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
