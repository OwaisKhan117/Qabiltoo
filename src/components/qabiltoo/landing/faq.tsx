"use client";

import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "../shared/section-heading";
import { Reveal } from "../shared/reveal";
import type { View } from "@/lib/qabiltoo/types";

const FAQS = [
  {
    q: "Is Qabiltoo free to use?",
    a: "Yes. Creating a profile, browsing matches and sending proposals are completely free — we believe finding your qabil should never be behind a paywall. Optional premium tiers offer extras like highlighted profiles and unlocked profile views, but the core journey stays free.",
  },
  {
    q: "How do you protect my privacy?",
    a: "Your full name is masked on cards (e.g. 'Ayesha S.'), photos are blurred until you choose to reveal them, and we never sell your data. You control who sees your details — proposals are only delivered when you approve them.",
  },
  {
    q: "How are profiles verified?",
    a: "Every profile passes manual review by our moderation team, with tiered verification: ID check (blue), ID plus activity review (green), and full document and reference vetting (gold). Look for the badge before your family proceeds.",
  },
  {
    q: "Can my parents or wali be involved?",
    a: "Absolutely — that is the Qabiltoo way. Profiles can be created on behalf of a family member, guardians can review proposals together, and every conversation is designed to be dignified and transparent.",
  },
  {
    q: "Can I filter by sect and religious commitment?",
    a: "Yes. Filter by Sunni, Shia or Just Muslim, and by religious level — from very practicing to exploring. Namaz commitment and Quran level are shown on profiles so families can match on the same deen journey.",
  },
  {
    q: "What happens after I send a proposal?",
    a: "The member — and their family, if they choose — reviews your profile and message. If they accept, both sides are notified and can move forward respectfully, family to family. If it is not the right match, you will be informed gently.",
  },
];

export function Faq({ navigate }: { navigate: (view: View) => void }) {
  return (
    <section
      id="faq"
      className="bg-cream py-20 lg:py-28 dark:bg-card/40"
      aria-label="Frequently asked questions"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          arabic="سؤال وجواب"
          eyebrow="Good to Know"
          title="Questions, answered with honesty"
          description="Everything you and your family need to know before beginning this blessed journey."
        />

        <Reveal duration={0.9}>
          <Accordion type="single" collapsible className="mt-2">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-border">
                <AccordionTrigger className="text-left font-semibold hover:text-primary hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>

        <Reveal delay={0.2} className="mt-10 text-center">
          <button
            onClick={() => navigate({ name: "info", page: "faq" })}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-gold-600 dark:text-emerald-300 dark:hover:text-gold-300"
          >
            Visit the full Help Centre
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden
            />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
