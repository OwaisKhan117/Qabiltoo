"use client";

import type { View } from "@/lib/qabiltoo/types";
import { AboutSection } from "./about-section";
import { ContactSection } from "./contact-section";
import { FaqSection } from "./faq-section";

/** Info pages — FAQ, About Us, Contact & Support (switch on `page`). */
export function InfoView({
  page,
  navigate,
}: {
  page: "faq" | "about" | "contact";
  navigate: (v: View) => void;
}) {
  if (page === "about") return <AboutSection navigate={navigate} />;
  if (page === "contact") return <ContactSection navigate={navigate} />;
  return <FaqSection navigate={navigate} />;
}
