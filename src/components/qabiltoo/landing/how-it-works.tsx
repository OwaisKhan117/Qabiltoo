"use client";

import {
  BadgeCheck,
  Gem,
  MailOpen,
  Search,
  UserRoundPlus,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "../shared/section-heading";
import { RingsConnection } from "../shared/rings-connection";
import { Reveal } from "../shared/reveal";

interface Step {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const STEPS: Step[] = [
  {
    icon: UserRoundPlus,
    title: "Register & Profile",
    desc: "Create your free profile in minutes — values, deen and family details, respectfully presented.",
  },
  {
    icon: BadgeCheck,
    title: "Get Verified",
    desc: "Our team reviews your ID and details, so families can trust every introduction they see.",
  },
  {
    icon: Search,
    title: "Discover Matches",
    desc: "Browse verified profiles filtered by faith, sect, city and family background.",
  },
  {
    icon: MailOpen,
    title: "Send Proposal",
    desc: "Express interest through a respectful proposal — guardians included from the very start.",
  },
  {
    icon: Gem,
    title: "Begin Nikah Journey",
    desc: "From family introductions to the nikah day itself — with barakah at every step.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-20 bg-cream py-20 lg:py-28 dark:bg-card/40"
      aria-label="How Qabiltoo works"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading with the two-rings motif beside it */}
        <div className="relative">
          <SectionHeading
            arabic="خطواتنا"
            eyebrow="How It Works"
            title="A clear path to your nikah, made with barakah"
            description="Five graceful steps — designed around Islamic etiquette, with your family honoured at every stage."
          />
          <div
            className="pointer-events-none absolute -top-6 right-0 hidden opacity-90 lg:block xl:right-6"
            aria-hidden="true"
          >
            <RingsConnection size={150} />
          </div>
        </div>

        {/* Steps */}
        <div className="relative mt-4">
          {/* gold dashed connector — desktop only, threaded through the medallions */}
          <div
            className="absolute left-[10%] right-[10%] top-9 hidden border-t-2 border-dashed border-gold-400/50 lg:block"
            aria-hidden="true"
          />

          <ol className="grid grid-cols-1 gap-y-16 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-5 lg:gap-x-4">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.14} duration={0.8} className="mt-9 h-full">
                <li className="group relative h-full rounded-2xl border border-border bg-card px-5 pb-6 pt-14 text-center shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-400/50 hover:shadow-xl hover:shadow-gold-500/10">
                  {/* icon medallion seated on the connector line */}
                  <span className="absolute -top-9 left-1/2 flex h-[4.5rem] w-[4.5rem] -translate-x-1/2 items-center justify-center rounded-full border border-gold-400/40 bg-background p-1.5 shadow-md shadow-gold-500/10">
                    <span className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-emerald-700 to-emerald-900 text-white transition-transform duration-500 group-hover:scale-105">
                      <step.icon className="h-6 w-6 text-gold-300" aria-hidden />
                    </span>
                  </span>

                  <p
                    className="font-display text-xs font-bold uppercase tracking-[0.3em] text-gold-600 dark:text-gold-400"
                    aria-label={`Step ${i + 1} of ${STEPS.length}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1.5 font-display text-lg font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
