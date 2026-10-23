"use client";

import type { View } from "@/lib/qabiltoo/types";
import { Reveal } from "../shared/reveal";
import { cn } from "@/lib/utils";

const PAGES = [
  { key: "faq", label: "FAQ", arabic: "أسئلة" },
  { key: "about", label: "About Us", arabic: "عنّا" },
  { key: "contact", label: "Contact", arabic: "تواصل" },
] as const;

/**
 * Elegant in-page switcher shared by the FAQ / About / Contact pages,
 * so families can move between support pages without hunting the menu.
 */
export function InfoPageNav({
  page,
  navigate,
}: {
  page: "faq" | "about" | "contact";
  navigate: (v: View) => void;
}) {
  return (
    <Reveal className="flex justify-center">
      <nav
        aria-label="Support pages"
        className="inline-flex items-center gap-1 rounded-full border border-gold-500/25 bg-card p-1 shadow-sm"
      >
        {PAGES.map((p) => {
          const active = page === p.key;
          return (
            <button
              key={p.key}
              type="button"
              aria-current={active ? "page" : undefined}
              onClick={() => navigate({ name: "info", page: p.key })}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 sm:px-6",
                active
                  ? "bg-gradient-to-r from-emerald-800 to-emerald-700 text-white shadow"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {p.label}
              <span className="font-arabic ml-1.5 text-xs opacity-70" aria-hidden>
                {p.arabic}
              </span>
            </button>
          );
        })}
      </nav>
    </Reveal>
  );
}
