import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

const WhyMrDevs = dynamic(() => import("@/components/WhyMrDevs"));
const Work = dynamic(() => import("@/components/Work"));
const LogoReveal = dynamic(() => import("@/components/LogoReveal"), {
  ssr: false,
});
const CondensedCTA = dynamic(() => import("@/components/CondensedCTA"));
const Services = dynamic(() => import("@/components/Services"));
const Process = dynamic(() => import("@/components/Process"));
const Founder = dynamic(() => import("@/components/Founder"));
const Contact = dynamic(() => import("@/components/Contact"));
const FAQ = dynamic(() => import("@/components/FAQ"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function Home() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Who actually builds my project?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "The founder of MrDevs builds your project end-to-end. You have a direct line of communication with the person writing your code, designing your interface, and structuring your database. No layers, no account managers, and no outsourced junior developers."
        }
      },
      {
        "@type": "Question",
        "name": "How is MrDevs different from a traditional 10-person agency?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Traditional agencies charge high markups to support overhead like project managers and sales reps, while outsourcing the actual development to junior staff. We do the opposite: you pay only for senior engineering, getting direct developer access and 5x faster iteration cycles."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide support after the launch?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Yes. We don't just hand over the code and disappear. We offer ongoing support packages for updates, security patches, API maintenance, and scaling as your business grows."
        }
      },
      {
        "@type": "Question",
        "name": "Can you integrate with our existing tools?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Absolutely. We specialize in custom API integrations, automated WhatsApp bots, database synchronizations, and connecting legacy spreadsheets or tools to modern web systems."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />
      <main>
        <Hero />
        <WhyMrDevs />
        <Work />
        <LogoReveal />
        <CondensedCTA />
        <Services />
        <Process />
        <Founder />
        <Contact />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
