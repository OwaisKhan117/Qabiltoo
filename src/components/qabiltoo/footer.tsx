"use client";

import { useState } from "react";
import { Heart, Instagram, Twitter, Youtube, Mail, MapPin, ShieldCheck, BadgeCheck, Lock, Users, Send, Check } from "lucide-react";
import { Logo } from "./logo";
import { PatternOverlay } from "./pattern";
import type { View } from "@/lib/qabiltoo/types";

interface FooterProps {
  navigate: (view: View) => void;
}

const TRUST_BADGES = [
  { icon: BadgeCheck, label: "Verified Profiles" },
  { icon: Lock, label: "Privacy Protected" },
  { icon: Users, label: "Guardian Approved" },
  { icon: Heart, label: "Halal Matchmaking" },
];

export function Footer({ navigate }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
  }

  return (
    <footer className="relative mt-auto overflow-hidden bg-emerald-900 text-primary-foreground dark:bg-emerald-950">
      <PatternOverlay className="text-white/5" />
      <div className="relative mx-auto max-w-7xl px-4 pb-6 pt-14 sm:px-6 lg:px-8">
        {/* Trust badges strip */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-5">
          {TRUST_BADGES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm font-medium text-white/85">
              <Icon className="h-4.5 w-4.5 text-gold-400" aria-hidden />
              {label}
            </div>
          ))}
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="space-y-4">
            <Logo dark />
            <p className="font-arabic text-lg text-gold-300" dir="rtl" lang="ar">
              السلام عليكم ورحمة الله
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-primary-foreground/80">
              Where faith finds its forever. Qabiltoo helps practicing Muslims find
              their nikah partner — with dignity, privacy and the blessings of family.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, label: "Instagram" },
                { icon: Twitter, label: "Twitter" },
                { icon: Youtube, label: "YouTube" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-gold-500 hover:text-emerald-900"
                  onClick={(e) => e.preventDefault()}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-300">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              {(
                [
                  { label: "Discover Profiles", view: { name: "browse" } as View },
                  { label: "Success Stories", view: { name: "stories" } as View },
                  { label: "Our Islamic Approach", view: { name: "approach" } as View },
                  { label: "Trust & Verification", view: { name: "trust" } as View },
                  { label: "Membership Plans", view: { name: "pricing" } as View },
                ] as const
              ).map((item) => (
                <li key={item.label}>
                  <button
                    className="text-primary-foreground/80 transition-colors hover:text-gold-300"
                    onClick={() => navigate(item.view)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Support links */}
          <nav aria-label="Support navigation">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-300">
              Support
            </h3>
            <ul className="space-y-2.5 text-sm">
              {(
                [
                  { label: "Frequently Asked Questions", view: { name: "info", page: "faq" } as View },
                  { label: "About Qabiltoo", view: { name: "info", page: "about" } as View },
                  { label: "Contact & Help", view: { name: "info", page: "contact" } as View },
                  { label: "Guardian Console", view: { name: "guardian" } as View },
                ] as const
              ).map((item) => (
                <li key={item.label}>
                  <button
                    className="text-primary-foreground/80 transition-colors hover:text-gold-300"
                    onClick={() => navigate(item.view)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Cities */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-300">
              Muslim Matrimony in
            </h3>
            <ul className="space-y-2.5 text-sm text-primary-foreground/80">
              {["Mumbai", "New Delhi", "Hyderabad", "Lucknow", "Bengaluru", "Dubai"].map(
                (city) => (
                  <li key={city}>
                    <button
                      className="transition-colors hover:text-gold-300"
                      onClick={() => navigate({ name: "browse" })}
                    >
                      Nikah Search in {city}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact + newsletter */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-300">
              Stay in Touch
            </h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-gold-300" /> care@qabiltoo.in
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-gold-300" /> Mumbai, India
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                <span>
                  Every profile is manually reviewed. Report concerns anytime — your
                  safety comes first.
                </span>
              </li>
            </ul>

            <form onSubmit={subscribe} className="mt-5" aria-label="Newsletter signup">
              <label htmlFor="footer-newsletter" className="mb-1.5 block text-xs font-medium text-white/70">
                Monthly reminders & nikah wisdom — no spam, ever
              </label>
              {subscribed ? (
                <p className="flex items-center gap-2 rounded-full bg-gold-500/15 px-4 py-2.5 text-sm text-gold-300">
                  <Check className="h-4 w-4" /> Jazak Allah khair — you&apos;re subscribed.
                </p>
              ) : (
                <div className="flex gap-2">
                  <input
                    id="footer-newsletter"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:border-gold-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500 text-emerald-950 transition hover:bg-gold-400"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/15 pt-6 text-xs text-primary-foreground/70 sm:flex-row">
          <p>© {new Date().getFullYear()} Qabiltoo. Sample data shown for demonstration.</p>
          <p className="flex items-center gap-1.5">
            Made with <Heart className="h-3.5 w-3.5 fill-gold-400 text-gold-400" /> for the
            Ummah · Privacy · Terms · Halal by design
          </p>
        </div>
      </div>
    </footer>
  );
}
