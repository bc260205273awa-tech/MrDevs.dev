import type { Metadata } from "next";
import ColdCallingSurvey from "@/components/ColdCallingSurvey";

export const metadata: Metadata = {
  title: "Cold Calling Readiness Assessment | MR Devs Internal",
  description: "Internal readiness check for MR Devs team members.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      "max-video-preview": -1,
      "max-image-preview": "none",
      "max-snippet": -1,
    },
  },
};

export default function CCReadinessPage() {
  return (
    <>
      <head>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
      </head>
      <ColdCallingSurvey />
    </>
  );
}
