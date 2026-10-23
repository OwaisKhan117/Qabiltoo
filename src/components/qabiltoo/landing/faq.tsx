"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "./section-heading";

const FAQS = [
  {
    q: "Is Qabiltoo free to use?",
    a: "Yes! Creating a profile, browsing matches and sending interests are completely free. We believe finding your qabil match shouldn't come with a price tag — premium add-ons like highlighted profiles may come later, but core features stay free.",
  },
  {
    q: "How do you protect my privacy?",
    a: "Your full name is masked on cards (e.g. 'Ayesha S.'), photos are only visible to members, and we never sell your data. You control who sees your details — interests are only delivered when you approve them.",
  },
  {
    q: "How are profiles verified?",
    a: "Every profile passes manual review by our moderation team before appearing in search. We check for authenticity, completeness and respectful content. Suspicious profiles are removed within hours.",
  },
  {
    q: "Can my parents or wali be involved?",
    a: "Absolutely — that's the Qabiltoo way. You can share profiles with your guardian, involve family in conversations from the start, and manage together. We built this for the whole family, not just the individual.",
  },
  {
    q: "Can I filter by sect and religious commitment?",
    a: "Yes. Filter by Sunni, Shia or Just Muslim, and by religious level — from very practicing to exploring. You can also see namaz commitment on profiles so you match with someone on the same deen journey.",
  },
  {
    q: "What happens after I send an interest?",
    a: "The member (and their family, if they choose) reviews your profile and message. If they accept, you're both notified and can take the conversation forward respectfully. If it's not a match, we'll let you know gently.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="bg-cream py-20 lg:py-24 dark:bg-card/40" aria-label="Frequently asked questions">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Good to Know"
          title="Questions, answered with honesty"
          desc="Everything you and your family need to know before starting this blessed journey."
        />
        <Accordion type="single" collapsible className="mt-10">
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
      </div>
    </section>
  );
}
