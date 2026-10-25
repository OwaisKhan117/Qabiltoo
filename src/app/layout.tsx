import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Qabiltoo — Where Faith Finds Its Forever | Muslim Matrimony",
  description:
    "Qabiltoo is India's trusted Muslim matrimonial platform. Find your qabil match — verified profiles, faith-centered matching, complete privacy, and family-first values. Begin your journey to nikah today.",
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
    title: "Qabiltoo — Where Faith Finds Its Forever",
    description:
      "India's trusted Muslim matrimonial platform. Verified profiles, faith-centered matching, and complete privacy.",
    siteName: "Qabiltoo",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f2" },
    { media: "(prefers-color-scheme: dark)", color: "#12211d" },
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
        className={`${playfair.variable} ${jakarta.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
