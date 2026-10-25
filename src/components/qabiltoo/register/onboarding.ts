/* ── Onboarding shared types, constants & helpers ──────────── */

import { initialsOf, type OnBehalfOf } from "@/lib/qabiltoo/types";

export interface OnboardingData {
  /* step 1 */
  onBehalfOf: OnBehalfOf | "";
  gender: "male" | "female" | "";
  /* step 2 */
  phone: string;
  /* step 3 */
  fullName: string;
  age: string;
  height: string;
  city: string;
  state: string;
  maritalStatus: string;
  relocate: boolean;
  /* step 4 */
  sect: string;
  religiousLevel: string;
  namaz: string;
  quranLevel: string;
  hijabBeard: string;
  /* step 5 */
  education: string;
  profession: string;
  income: string;
  familyInfo: string;
  about: string;
  partnerPreference: string;
  /* step 6 — uploaded dataURL stays client-side ONLY, never sent to API */
  photoOption: "initials" | "upload";
  photoDataUrl: string;
  /* step 7 — demo only */
  idFileName: string;
  idVerified: boolean;
}

export const DEFAULT_DATA: OnboardingData = {
  onBehalfOf: "",
  gender: "",
  phone: "",
  fullName: "",
  age: "",
  height: "",
  city: "",
  state: "",
  maritalStatus: "Never Married",
  relocate: false,
  sect: "",
  religiousLevel: "",
  namaz: "",
  quranLevel: "",
  hijabBeard: "",
  education: "",
  profession: "",
  income: "",
  familyInfo: "",
  about: "",
  partnerPreference: "",
  photoOption: "initials",
  photoDataUrl: "",
  idFileName: "",
  idVerified: false,
};

/* Heights from 4'8" to 6'4", one-inch steps */
export const HEIGHTS: string[] = (() => {
  const out: string[] = [];
  for (let total = 4 * 12 + 8; total <= 6 * 12 + 4; total++) {
    out.push(`${Math.floor(total / 12)} ft ${total % 12} in`);
  }
  return out;
})();

export interface StepProps {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
}

/** Light, gentle per-step gating. Empty object = valid. */
export function validateStep(step: number, d: OnboardingData): Record<string, string> {
  const e: Record<string, string> = {};

  if (step === 1) {
    if (!d.onBehalfOf) e.onBehalfOf = "Please choose who this profile is for.";
    if (!d.gender) e.gender = "Please choose whom you are seeking.";
  }

  if (step === 3) {
    if (d.fullName.trim().length < 2) e.fullName = "Please enter the full name.";
    const age = Number(d.age);
    if (!d.age || Number.isNaN(age) || age < 18 || age > 80) {
      e.age = "Age should be between 18 and 80.";
    }
    if (!d.height) e.height = "Please select a height.";
    if (d.city.trim().length < 2) e.city = "Please enter a city.";
    if (d.state.trim().length < 2) e.state = "Please enter a state.";
  }

  if (step === 4) {
    if (!d.sect) e.sect = "Please choose one.";
    if (!d.religiousLevel) e.religiousLevel = "Please choose one.";
    if (!d.namaz) e.namaz = "Please choose one.";
    if (!d.quranLevel) e.quranLevel = "Please choose one.";
    if (!d.hijabBeard) e.hijabBeard = "Please choose one.";
  }

  if (step === 5) {
    if (!d.education) e.education = "Please select the highest education.";
    if (d.profession.trim().length < 2) e.profession = "Please add a profession or occupation.";
    if (d.about.trim().length < 30) {
      e.about = "A few more words, please — at least 30 characters helps families know you.";
    }
  }

  return e;
}

/** Build the POST /api/profiles body. Photos are always path strings, never base64. */
export function buildPayload(d: OnboardingData) {
  const image = `/api/avatar/${initialsOf(d.fullName) || "QT"}`;
  return {
    fullName: d.fullName.trim(),
    gender: d.gender as "male" | "female",
    age: Number(d.age),
    height: d.height,
    city: d.city.trim(),
    state: d.state.trim(),
    country: "India",
    education: d.education,
    profession: d.profession.trim(),
    income: d.income || null,
    maritalStatus: d.maritalStatus,
    sect: d.sect || null,
    religiousLevel: d.religiousLevel || null,
    namaz: d.namaz || null,
    quranLevel: d.quranLevel || null,
    hijabBeard: d.hijabBeard || null,
    about: d.about.trim(),
    partnerPreference: d.partnerPreference.trim() || null,
    familyInfo: d.familyInfo.trim() || null,
    image,
    photos: [image],
    phone: d.phone,
    onBehalfOf: d.onBehalfOf as OnBehalfOf,
    relocate: d.relocate,
  };
}
