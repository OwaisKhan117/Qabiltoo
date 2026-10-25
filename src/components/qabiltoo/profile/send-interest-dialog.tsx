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

const TEMPLATE = "Assalamu Alaikum! I came across your profile and it resonated with me. I would be honored if our families could connect. JazakAllah khair.";

interface SendInterestDialogProps {
  profile: Profile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function SendInterestDialog({ profile, open, onOpenChange, onSuccess }: SendInterestDialogProps) {
  const [message, setMessage] = useState(TEMPLATE);
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
        setError(data.error ?? "Failed to send interest");
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
            Send Interest
          </DialogTitle>
          <DialogDescription>
            {profile
              ? `Express your interest in ${profile.fullName.split(" ")[0]} respectfully. A kind message goes a long way — insha'Allah.`
              : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
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
