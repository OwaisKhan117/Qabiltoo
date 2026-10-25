"use client";

import { Heart, Instagram, Twitter, Youtube, Mail, MapPin, ShieldCheck } from "lucide-react";
import { Logo } from "./logo";
import { PatternOverlay } from "./pattern";
import type { View } from "@/lib/qabiltoo/types";

interface FooterProps {
  navigate: (view: View) => void;
}

export function Footer({ navigate }: FooterProps) {
  return (
    <footer className="relative mt-auto overflow-hidden bg-primary text-primary-foreground">
      <PatternOverlay className="text-white/5" />
      <div className="relative mx-auto max-w-7xl px-4 pb-6 pt-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Logo dark />
            <p className="max-w-xs text-sm leading-relaxed text-primary-foreground/80">
              Where faith finds its forever. Qabiltoo helps practicing Muslims in India find
              their qabil match — with dignity, privacy and the blessings of family.
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
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-gold-500 hover:text-primary"
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
              {[
                { label: "Browse Profiles", view: { name: "browse" } as View },
                { label: "Success Stories", action: "stories" },
                { label: "Why Qabiltoo", action: "features" },
                { label: "Create Profile", view: { name: "register" } as View },
                { label: "My Interests", view: { name: "interests" } as View },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    className="text-primary-foreground/80 transition-colors hover:text-gold-300"
                    onClick={() => {
                      if (item.view) navigate(item.view);
                      else if (view.name !== "landing") navigate({ name: "landing" });
                      else {
                        document.getElementById(item.action ?? "")?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Communities */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-300">
              Popular Cities
            </h3>
            <ul className="space-y-2.5 text-sm text-primary-foreground/80">
              {["Mumbai", "New Delhi", "Hyderabad", "Lucknow", "Bengaluru", "Chennai"].map(
                (city) => (
                  <li key={city}>
                    <button
                      className="transition-colors hover:text-gold-300"
                      onClick={() => navigate({ name: "browse" })}
                    >
                      Muslim Matrimony in {city}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-300">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold-300" /> care@qabiltoo.in
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold-300" /> Mumbai, India
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                <span>
                  Every profile is manually reviewed. Report concerns anytime — your safety
                  comes first.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/15 pt-6 text-xs text-primary-foreground/70 sm:flex-row">
          <p>© {new Date().getFullYear()} Qabiltoo. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with <Heart className="h-3.5 w-3.5 fill-gold-400 text-gold-400" /> for the
            Ummah · Privacy · Terms · Halal by design
          </p>
        </div>
      </div>
    </footer>
  );
}
