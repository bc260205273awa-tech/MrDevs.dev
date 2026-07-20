"use client";

import { useState } from "react";
import { ChevronDown, MessageSquare, ArrowRight, CheckCircle2 } from "lucide-react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ServiceDeliverable {
  title: string;
  description: string;
}

export interface ServicePageProps {
  title: string;
  metaDescription: string;
  keyword: string;
  h1Outcome: string;
  subhead: string;
  deliverables: ServiceDeliverable[];
  whoThisIsFor: string;
  proof?: {
    title: string;
    text: string;
  };
  faqs: FAQItem[];
  nextServices: {
    title: string;
    href: string;
  }[];
  schemaUrl: string;
}

export default function ServicePageLayout({ data, children }: { data: ServicePageProps; children?: React.ReactNode }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const pathname = usePathname();

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const getProblemText = () => {
    if (pathname.includes("web-development")) {
      return "Your website is the face of your business, but if it loads slowly, looks outdated, or is invisible on Google, you are losing potential customers to competitors every single day. Managing content should be simple, not a technical struggle that wastes your time.";
    }
    if (pathname.includes("app-development")) {
      return "Reaching mobile customers through browsers is inefficient, yet building a mobile app often feels prohibitively expensive and complicated. Without a direct channel to your users' homescreens, you miss out on retention, direct notifications, and seamless customer interactions.";
    }
    if (pathname.includes("hospital-software-systems")) {
      return "Hospitals and clinics waste hours of valuable staff time manually coordinating patient records, appointments, staff schedules, and billing. When medical records are scattered across paper files or slow software, it leads to administrative errors, longer patient wait times, and frustrated staff.";
    }
    if (pathname.includes("whatsapp-automation")) {
      return "Your support team is overwhelmed by repetitive customer queries, leaving hot leads waiting for answers for hours. Manually sending invoice receipts, appointment reminders, and shipping updates is a bottleneck that limits your ability to scale operations.";
    }
    if (pathname.includes("maps-optimization")) {
      return "Local customers are actively searching for your services in your city, but your business doesn't show up in the top Google Maps results. If competitors with fewer reviews or worse service rank higher, you are losing valuable foot traffic and phone calls every single day.";
    }
    if (pathname.includes("design-branding")) {
      return "First impressions are made in under 3 seconds, and an unprofessional logo or messy user interface instantly destroys customer trust. Without a consistent, premium design system, your business looks amateurish and fails to justify premium pricing.";
    }
    if (pathname.includes("social-media")) {
      return "Creating engaging content regularly is exhausting, and inconsistent postings make your brand look inactive. Without professional scripting, visuals, and high-quality video editing, your social channels fail to capture attention and convert viewers into loyal clients.";
    }
    return "Businesses struggle to attract and retain customers online when using generic, slow, or disconnected digital tools. Without a custom technical strategy, you are wasting marketing budget and losing prospects to more agile competitors.";
  };

  const problemText = getProblemText();

  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": data.title,
    "description": data.metaDescription,
    "provider": {
      "@type": "LocalBusiness",
      "name": "MrDevs",
      "image": "https://mrdevs.dev/logo.png",
      "url": "https://mrdevs.dev"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Pakistan"
    }
  };

  return (
    <>
      <Navbar />
      <main className="bg-[#0a0f1a] text-[#f1efe8] font-sans min-h-screen pt-24">
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
        />

        {/* 1. Intent-Clarifying Header */}
        <section className="py-20 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto px-6 flex flex-col items-center gap-6">
            <span className="text-[10px] font-medium text-[#378ADD] tracking-[0.15em] uppercase select-none bg-[#378ADD]/10 px-2.5 py-0.5 rounded border border-[#378ADD]/15">
              {data.keyword.toLowerCase()}
            </span>
            <h1 className="text-3xl md:text-5xl font-medium text-[#f1efe8] leading-[1.15] tracking-tight">
              {data.h1Outcome}
            </h1>
            <p className="text-xs md:text-sm text-[#5DCAA5] max-w-lg leading-relaxed font-medium uppercase tracking-[0.05em]">
              {data.whoThisIsFor}
            </p>
          </div>
          <div className="section-divider mt-20" />
        </section>

        {/* 2. Client-Perspective Problem Section */}
        <section className="py-16 bg-[#0a0f1a] border-b border-[rgba(133,183,235,0.03)]">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <span className="text-[10px] font-medium text-[#5F5E5A] tracking-[0.15em] uppercase mb-4 block select-none">
              The Problem
            </span>
            <p className="text-xs md:text-sm text-[#888780] leading-relaxed max-w-lg mx-auto italic font-sans">
              &ldquo;{problemText}&rdquo;
            </p>
          </div>
        </section>

        {/* 3. What's Included / Deliverables */}
        <section className="py-16 bg-[#0a0f1a]">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-xl md:text-2xl font-medium text-[#f1efe8] mb-8 text-center">
              What&apos;s Included
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.deliverables.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#0f1729] border border-[rgba(133,183,235,0.15)] rounded-xl p-5 hover:border-[rgba(133,183,235,0.3)] transition-all duration-200"
                >
                  <h3 className="font-sans font-medium text-[13px] text-[#f1efe8] mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#378ADD]" />
                    {item.title}
                  </h3>
                  <p className="font-sans text-[#888780] text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Custom Child Elements (such as Design Sub-cards) */}
        {children && (
          <section className="py-8 bg-[#0a0f1a]">
            <div className="max-w-3xl mx-auto px-6">
              {children}
            </div>
          </section>
        )}

        {/* 4. Relevant Proof Section */}
        <section className="py-16 bg-[#0a0f1a]">
          <div className="max-w-3xl mx-auto px-6 flex flex-col items-center gap-6">
            <span className="text-[10px] font-medium text-[#5DCAA5] tracking-[0.15em] uppercase select-none">
              proven capability
            </span>
            {data.proof ? (
              <>
                <h2 className="text-xl md:text-2xl font-medium text-[#f1efe8] text-center">
                  {data.proof.title}
                </h2>
                <div className="w-full p-6 border border-[rgba(133,183,235,0.15)] rounded-xl bg-[#0f1729]/50 text-center max-w-xl">
                  <p className="text-xs text-[#888780] leading-relaxed mb-4">
                    {data.proof.text}
                  </p>
                  <a
                    href="https://www.khanhub.com.pk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#378ADD] hover:text-[#f1efe8] transition-colors font-medium"
                  >
                    Visit khanhub.com.pk
                    <ArrowRight size={12} />
                  </a>
                </div>
              </>
            ) : (
              <div className="w-full flex flex-col items-center gap-6">
                <h2 className="text-xl md:text-2xl font-medium text-[#f1efe8] text-center">
                  Why Hire MrDevs?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-left">
                  <div className="bg-[#0f1729] border border-[rgba(133,183,235,0.12)] rounded-xl p-5">
                    <h3 className="text-xs font-medium text-[#f1efe8] mb-1.5 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#378ADD]" />
                      Direct Founder Access
                    </h3>
                    <p className="text-[11px] text-[#888780] leading-relaxed">
                      Speak directly to the engineer building your product. No account managers or outsourced junior developers.
                    </p>
                  </div>
                  <div className="bg-[#0f1729] border border-[rgba(133,183,235,0.12)] rounded-xl p-5">
                    <h3 className="text-xs font-medium text-[#f1efe8] mb-1.5 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#378ADD]" />
                      Total Accountability
                    </h3>
                    <p className="text-[11px] text-[#888780] leading-relaxed">
                      One point of contact responsible for UI design, databases, security, and deployment end-to-end.
                    </p>
                  </div>
                  <div className="bg-[#0f1729] border border-[rgba(133,183,235,0.12)] rounded-xl p-5">
                    <h3 className="text-xs font-medium text-[#f1efe8] mb-1.5 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#378ADD]" />
                      Proven at Scale
                    </h3>
                    <p className="text-[11px] text-[#888780] leading-relaxed">
                      Engineered KhanHub — a multi-department clinic & hospital ERP handling 24/7 operations for 50,000+ people.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="section-divider mt-16" />
          </div>
        </section>

        {/* FAQs Section */}
        <section className="py-16 bg-[#0a0f1a]">
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-xl md:text-2xl font-medium text-[#f1efe8] mb-8 text-center">
              Frequently asked questions
            </h2>
            <div className="flex flex-col gap-3">
              {data.faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-[rgba(133,183,235,0.08)] rounded-lg bg-[#0f1729]/20 overflow-hidden transition-all duration-200"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left font-medium text-xs text-[#f1efe8] hover:bg-[#0f1729]/50 transition-colors"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        size={14}
                        className={`text-[#888780] transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`transition-all duration-300 ease-in-out ${
                        isOpen ? "max-h-48 border-t border-[rgba(133,183,235,0.06)]" : "max-h-0"
                      } overflow-hidden`}
                    >
                      <p className="px-5 py-4 text-xs text-[#888780] leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="section-divider mt-20" />
          </div>
        </section>

        {/* 5. Low-Friction CTA Section */}
        <section className="py-20 bg-[#0a0f1a] text-center border-t border-[rgba(133,183,235,0.03)]">
          <div className="max-w-3xl mx-auto px-6 flex flex-col items-center gap-10">
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-xl md:text-2xl font-medium text-[#f1efe8]">
                Book a Free Strategy Call
              </h2>
              <p className="text-xs text-[#888780] max-w-sm leading-relaxed mb-4">
                Ready to talk? Message us on WhatsApp to select a time that works for you.
              </p>
              <a
                href="https://wa.me/923218492868"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#378ADD] text-[#042C53] font-medium text-xs rounded hover:bg-[#378ADD]/90 hover:scale-[0.98] active:scale-[0.95] transition-all duration-200 shadow"
              >
                <MessageSquare size={14} />
                Book a Free Strategy Call on WhatsApp
              </a>
            </div>

            {/* Related / Internal Links */}
            <div className="w-full flex flex-col items-center gap-4 pt-10 border-t border-[rgba(133,183,235,0.08)]">
              <span className="text-[10px] text-[#5F5E5A] tracking-wider uppercase font-medium select-none">
                See other services
              </span>
              <div className="flex flex-wrap justify-center gap-4">
                {data.nextServices.map((svc, idx) => (
                  <a
                    key={idx}
                    href={svc.href}
                    className="inline-flex items-center gap-1 px-4 py-2 border border-[rgba(133,183,235,0.1)] rounded text-xs text-[#888780] hover:text-[#378ADD] hover:border-[#378ADD]/30 transition-all duration-200"
                  >
                    <span>{svc.title.toLowerCase()}</span>
                    <ArrowRight size={10} />
                  </a>
                ))}
              </div>
            </div>

          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
