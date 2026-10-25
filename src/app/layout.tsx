import type { Metadata, Viewport } from "next";
import {
  Playfair_Display,
  Plus_Jakarta_Sans,
  Geist_Mono,
  Amiri,
} from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Qabiltoo — Begin Your Journey to a Blessed Nikah",
  description:
    "Qabiltoo is a premium Muslim matrimonial platform. Find a nikah partner in a trustworthy, Islamic, privacy-first environment — verified profiles, guardian approval, and family-first matchmaking.",
  keywords: [
    "Muslim matrimony",
    "nikah",
    "Muslim marriage",
    "Islamic matchmaking",
    "Muslim brides",
    "Muslim grooms",
    "Qabiltoo",
    "India Muslim matrimony",
  ],
  authors: [{ name: "Qabiltoo" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Qabiltoo — Begin Your Journey to a Blessed Nikah",
    description:
      "A premium, privacy-first Muslim matrimonial platform. Verified profiles, guardian-approved, halal by design.",
    siteName: "Qabiltoo",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf7f0" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1512" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${jakarta.variable} ${geistMono.variable} ${amiri.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
