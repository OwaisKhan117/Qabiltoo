import { QabiltooApp } from "@/components/qabiltoo/qabiltoo-app";
import { getLandingInitialData } from "@/lib/qabiltoo/server-data";

/* The landing shell is data-driven but changes rarely — ISR keeps the HTML
   warm on the CDN edge (fast LCP) while staying fresh within a minute. */
export const revalidate = 60;

export default async function Home() {
  const initial = await getLandingInitialData();
  return <QabiltooApp initial={initial} />;
}
