import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://qff2026.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BITS Qiskit Fall Fest 2026 | QFF 2026",
    template: "%s | QFF 2026",
  },
  description:
    "BITS Qiskit Fall Fest 2026 (QFF 2026) — talks, workshops, and a 24-hour quantum computing hackathon at BITS Pilani.",
  keywords: [
    "Qiskit Fall Fest",
    "QFF 2026",
    "BITS Pilani",
    "quantum computing",
    "hackathon",
    "Qiskit",
  ],
  authors: [{ name: "BITS Qiskit Fall Fest" }],
  icons: {
    icon: "/image-removebg-preview.png",
    apple: "/image-removebg-preview.png",
  },
  openGraph: {
    title: "BITS Qiskit Fall Fest 2026",
    description:
      "A campus-wide gathering for quantum computing — talks, workshops, and a 24-hour hackathon at BITS Pilani.",
    url: siteUrl,
    siteName: "QFF 2026",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BITS Qiskit Fall Fest 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BITS Qiskit Fall Fest 2026",
    description:
      "A campus-wide gathering for quantum computing — talks, workshops, and a 24-hour hackathon at BITS Pilani.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf8fc",
  width: "device-width",
  initialScale: 1,
};

import { ThemeProvider } from "@/components/ui/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
