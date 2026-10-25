"use client";

import { HelpCircle, MessageCircleHeart } from "lucide-react";
import type { View } from "@/lib/qabiltoo/types";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHeading } from "../shared/section-heading";
import { Reveal } from "../shared/reveal";
import { PatternOverlay } from "../pattern";
import { InfoPageNav } from "./info-page-nav";
import { FAQ_ITEMS } from "./faq-data";

/** FAQ page — ~10 questions with accordion, CTA to contact. */
export function FaqSection({ navigate }: { navigate: (v: View) => void }) {
  return (
    <div className="bg-background">
      <section className="relative overflow-hidden">
        <PatternOverlay className="text-gold-600/5 dark:text-gold-400/5" />
        <div className="relative mx-auto max-w-4xl px-4 pt-14 text-center sm:pt-20">
          <SectionHeading
            arabic="أسئلة"
            eyebrow="Support"
            title="Frequently asked questions"
            description="Everything families ask us before beginning — verification, privacy, proposals and what it costs. If your question is not here, our team replies within a day."
          />
          <InfoPageNav page="faq" navigate={navigate} />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:pb-24" aria-label="Questions and answers">
        <Reveal>
          <Accordion type="single" collapsible className="space-y-3">
            {FAQ_ITEMS.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`faq-${i}`}
                className="rounded-xl border border-gold-500/15 bg-card px-5 last:border-b"
              >
                <AccordionTrigger className="text-left text-[15px] font-semibold text-foreground hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-12 rounded-2xl border border-gold-500/25 bg-gradient-to-br from-gold-50 to-card p-8 text-center dark:from-gold-900/15">
            <MessageCircleHeart className="mx-auto h-9 w-9 text-gold-600 dark:text-gold-400" aria-hidden />
            <h2 className="mt-3 font-display text-xl font-semibold text-foreground">Still have a question?</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Our support team reads every message personally — usually replying within a few hours,
              and always within 24.
            </p>
            <Button
              size="lg"
              className="btn-gold-shimmer mt-5 font-semibold"
              onClick={() => navigate({ name: "info", page: "contact" })}
            >
              Contact our team
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
            <HelpCircle className="h-3.5 w-3.5" aria-hidden />
            Tip: guardians and walis can explore every answer on this page too.
          </p>
        </Reveal>
      </section>
    </div>
  );
}
