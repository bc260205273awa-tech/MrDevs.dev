import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MrDevs — Premium digital agency | Web & app development",
    template: "%s | MrDevs"
  },
  description:
    "MrDevs is a premium digital agency crafting top-tier websites, mobile apps, and custom software systems engineered around one outcome — your revenue.",
  keywords: [
    "mrdevs",
    "digital agency",
    "web development",
    "mobile app development",
    "custom software",
    "next.js agency",
    "react native developers",
    "ui/ux design",
    "software systems",
    "e-commerce development"
  ],
  authors: [{ name: "mrdevs", url: "https://mrdevs.dev" }],
  creator: "mrdevs",
  publisher: "mrdevs",
  metadataBase: new URL("https://mrdevs.dev"),
  alternates: {
    canonical: "https://mrdevs.dev",
  },
  openGraph: {
    title: "MrDevs — Premium digital agency | Web & app development",
    description:
      "We craft premium websites, mobile apps, and custom software systems engineered around one outcome — your revenue.",
    url: "https://mrdevs.dev",
    siteName: "mrdevs",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MrDevs — Premium digital agency | Web & app development",
    description:
      "We craft premium websites, mobile apps, and custom software systems engineered around one outcome — your revenue.",
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
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="bg-[#0a0f1a] text-[#f1efe8] antialiased font-sans overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
