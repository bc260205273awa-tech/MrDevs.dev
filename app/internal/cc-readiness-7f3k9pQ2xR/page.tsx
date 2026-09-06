import type { Metadata } from "next";
import ColdCallingSurvey from "@/components/ColdCallingSurvey";

// [NEW] Strict robots metadata blocking search engines from indexing or following
export const metadata: Metadata = {
  title: "Cold Calling Readiness Check | MR Devs Internal",
  description: "Internal staff questionnaire for MR Devs team members.",
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

export default function InternalColdCallingSurveyPage() {
  return (
    <>
      <head>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
      </head>
      <ColdCallingSurvey />
    </>
  );
}
