import type { Metadata } from "next";
import { Syne, Manrope } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MrDevs — Premium Digital Agency | Web & App Development",
    template: "%s | MrDevs"
  },
  description:
    "MrDevs is a premium digital agency crafting top-tier websites, mobile apps, and custom software solutions for ambitious businesses worldwide. Specialized in Next.js, React, React Native, and Node.js.",
  keywords: [
    "MrDevs",
    "Digital Agency",
    "Web Development",
    "Mobile App Development",
    "Custom Software",
    "Next.js Agency",
    "React Native Developers",
    "UI/UX Design Pakistan",
    "Software Agency Lahore",
    "E-commerce Development"
  ],
  authors: [{ name: "MrDevs", url: "https://mrdevs.dev" }],
  creator: "MrDevs",
  publisher: "MrDevs",
  metadataBase: new URL("https://mrdevs.dev"),
  alternates: {
    canonical: "https://mrdevs.dev",
  },
  openGraph: {
    title: "MrDevs — Premium Digital Agency | Web & App Development",
    description:
      "We craft premium websites, mobile apps, and custom software for ambitious businesses. Specialized in Next.js, React, React Native, and Node.js.",
    url: "https://mrdevs.dev",
    siteName: "MrDevs",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MrDevs — Premium Digital Agency | Web & App Development",
    description:
      "We craft premium websites, mobile apps, and custom software for ambitious businesses.",
    creator: "@mrdevs",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${manrope.variable}`}>
      <body className="bg-[#070707] text-[#F5F5F5] antialiased font-manrope overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
