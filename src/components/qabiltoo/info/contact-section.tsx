"use client";

import { useState } from "react";
import type { View } from "@/lib/qabiltoo/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { SectionHeading } from "../shared/section-heading";
import { Reveal } from "../shared/reveal";
import { PatternOverlay } from "../pattern";
import { InfoPageNav } from "./info-page-nav";
import {
  Clock,
  HelpCircle,
  Mail,
  MapPin,
  Send,
  ShieldCheck,
} from "lucide-react";

const TOPICS = [
  "General question",
  "Verification",
  "Billing & membership",
  "Safety concern",
  "Success story",
] as const;

const CONTACT_CARDS = [
  {
    icon: Mail,
    title: "Email us",
    lines: ["care@qabiltoo.in", "For families & members alike"],
  },
  {
    icon: MapPin,
    title: "Mumbai office",
    lines: ["Bandra West, Mumbai 400050", "Visits by appointment"],
  },
  {
    icon: Clock,
    title: "Response time",
    lines: ["Within 24 hours, insha'Allah", "Safety matters: within hours"],
  },
];

/** Contact & support — form (demo), contact cards, safety callout. */
export function ContactSection({ navigate }: { navigate: (v: View) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<string>("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({
        title: "A few fields are missing",
        description: "Please share your name, email and message so we can help.",
        variant: "destructive",
      });
      return;
    }
    setSending(true);
    // No backend by design — graceful demo submission.
    window.setTimeout(() => {
      setSending(false);
      toast({
        title: "Jazak Allah khair",
        description: "Our team responds within 24 hours — safety concerns even sooner.",
      });
      setName("");
      setEmail("");
      setTopic("");
      setMessage("");
    }, 900);
  };

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden">
        <PatternOverlay className="text-gold-600/5 dark:text-gold-400/5" />
        <div className="relative mx-auto max-w-4xl px-4 pt-14 text-center sm:pt-20">
          <SectionHeading
            arabic="تواصل"
            eyebrow="We're here to help"
            title="Contact & support"
            description="Questions about verification, billing, a safety concern, or a success story to share — write to us and a real person will read it."
          />
          <InfoPageNav page="contact" navigate={navigate} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:pb-24">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* ── Support form ─────────────────────────────── */}
          <Reveal>
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-gold-500/20 bg-card p-6 sm:p-8"
              aria-label="Support form"
            >
              <h2 className="font-display text-xl font-semibold text-foreground">Send us a message</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                All fields are read by our Mumbai team — nothing is automated.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="contact-name">Your name</Label>
                  <Input
                    id="contact-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Fatima Khan"
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                <Label htmlFor="contact-topic">Topic</Label>
                <Select value={topic} onValueChange={setTopic}>
                  <SelectTrigger id="contact-topic" className="w-full">
                    <SelectValue placeholder="Choose a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {TOPICS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-4 space-y-1.5">
                <Label htmlFor="contact-message">Message</Label>
                <Textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us how we can help — the more detail, the faster we can assist."
                  rows={6}
                  className="resize-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={sending}
                className="btn-gold-shimmer mt-6 w-full font-semibold sm:w-auto sm:px-10"
              >
                {sending ? (
                  "Sending…"
                ) : (
                  <>
                    <Send className="h-4 w-4" aria-hidden />
                    Send message
                  </>
                )}
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">
                Please never share financial details in messages — our team will never ask for them.
              </p>
            </form>
          </Reveal>

          {/* ── Contact cards + safety callout ───────────── */}
          <div className="space-y-5">
            {CONTACT_CARDS.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08}>
                <article className="flex items-start gap-4 rounded-2xl border border-gold-500/15 bg-card p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-800/10 text-emerald-800 dark:bg-emerald-100/10 dark:text-emerald-300" aria-hidden>
                    <c.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-semibold text-foreground">{c.title}</h3>
                    <p className="mt-1 text-sm text-foreground/85">{c.lines[0]}</p>
                    <p className="text-xs text-muted-foreground">{c.lines[1]}</p>
                  </div>
                </article>
              </Reveal>
            ))}

            <Reveal delay={0.24}>
              <aside className="rounded-2xl border border-gold-500/30 bg-gradient-to-br from-gold-50 to-card p-5 dark:from-gold-900/15">
                <h3 className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
                  <ShieldCheck className="h-5 w-5 text-gold-600 dark:text-gold-400" aria-hidden />
                  Safety concerns are prioritised
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Reports involving safety, fraud or harassment jump to the top of our queue and are
                  reviewed by a senior moderator within hours — day or night. Choose{" "}
                  <span className="font-semibold text-foreground">&ldquo;Safety concern&rdquo;</span> above so it
                  reaches them instantly.
                </p>
              </aside>
            </Reveal>

            <Reveal delay={0.3}>
              <button
                type="button"
                onClick={() => navigate({ name: "info", page: "faq" })}
                className="group flex w-full items-center justify-between rounded-2xl border border-gold-500/15 bg-card p-5 text-left transition-colors hover:border-gold-500/40 focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:outline-none"
              >
                <span className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-gold-600 dark:text-gold-400" aria-hidden />
                  <span>
                    <span className="block font-display text-base font-semibold text-foreground">Browse the FAQ first</span>
                    <span className="block text-xs text-muted-foreground">Most answers live there — verified, free to read</span>
                  </span>
                </span>
                <span className="text-gold-600 transition-transform group-hover:translate-x-1 dark:text-gold-400" aria-hidden>
                  →
                </span>
              </button>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
