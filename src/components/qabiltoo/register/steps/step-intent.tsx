"use client";

import { UserRound, Users } from "lucide-react";
import { OptionCard, StepNav } from "../kit";
import type { StepProps } from "../onboarding";

/** Step 1 — Welcome & Intent */
export function StepIntent({ data, update, onNext }: StepProps) {
  const ready = !!data.onBehalfOf && !!data.gender;

  return (
    <section aria-labelledby="step-intent-h">
      <p className="font-arabic text-lg leading-relaxed text-gold-600 dark:text-gold-300" aria-hidden>
        بسم الله
      </p>
      <h2 id="step-intent-h" className="mt-1 font-display text-2xl font-bold sm:text-3xl">
        Assalamu Alaikum
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
        You are beginning a serious and halal journey — one taken with intention, modesty and
        trust in Allah&apos;s plan. Everything you share here is reserved for sincere families
        seeking nikah, and nothing is shown publicly.
      </p>

      <div className="mt-8 space-y-7">
        <fieldset>
          <legend className="mb-3 text-sm font-semibold">Who is this profile for?</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <OptionCard
              selected={data.onBehalfOf === "self"}
              onSelect={() => update({ onBehalfOf: "self" })}
              icon={<UserRound className="h-5 w-5" aria-hidden />}
              title="For Myself"
              subtitle="I am creating my own profile to seek a spouse."
            />
            <OptionCard
              selected={data.onBehalfOf === "family"}
              onSelect={() => update({ onBehalfOf: "family" })}
              icon={<Users className="h-5 w-5" aria-hidden />}
              title="On Behalf of a Family Member"
              subtitle="I am a parent, sibling or wali (Wakeel) arranging for someone in my family."
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-sm font-semibold">Whom are you seeking?</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <OptionCard
              selected={data.gender === "male"}
              onSelect={() => update({ gender: "male" })}
              title="Seeking a Bride"
              subtitle="This profile will be for a man."
            />
            <OptionCard
              selected={data.gender === "female"}
              onSelect={() => update({ gender: "female" })}
              title="Seeking a Groom"
              subtitle="This profile will be for a woman."
            />
          </div>
        </fieldset>
      </div>

      <StepNav
        onNext={onNext}
        nextDisabled={!ready}
        hint={ready ? undefined : "Choose both options above to continue"}
      />
    </section>
  );
}
