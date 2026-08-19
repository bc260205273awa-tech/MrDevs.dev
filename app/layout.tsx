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
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
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
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "MrDevs",
    "image": "https://mrdevs.dev/logo.png",
    "url": "https://mrdevs.dev",
    "description":
      "MrDevs is a premium digital agency crafting top-tier websites, mobile apps, and custom software systems engineered around one outcome — your revenue.",
    "priceRange": "$$$",
    "telephone": "+923219565657",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "PK"
    },
    "sameAs": [
      "https://github.com/mrdevs",
      "https://linkedin.com/company/mrdevs",
      "https://x.com/mrdevs"
    ]
  };

  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="bg-[#0a0f1a] text-[#f1efe8] antialiased font-sans overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
