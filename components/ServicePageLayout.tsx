"use client";

import { useState } from "react";
import { ChevronDown, MessageSquare, ArrowRight } from "lucide-react";
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

export default function ServicePageLayout({ data }: { data: ServicePageProps }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

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

        {/* Hero Section */}
        <section className="py-20 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto px-6 flex flex-col items-center gap-6">
            <span className="text-[10px] font-medium text-[#378ADD] tracking-[0.15em] uppercase select-none">
              {data.keyword.toLowerCase()}
            </span>
            <h1 className="text-3xl md:text-5xl font-medium text-[#f1efe8] leading-[1.15] tracking-tight">
              {data.h1Outcome}
            </h1>
            <p className="text-[15px] text-[#888780] max-w-lg leading-relaxed">
              {data.subhead}
            </p>
            <a
              href="https://wa.me/923218492868"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#378ADD] text-[#042C53] font-medium text-xs rounded hover:bg-[#378ADD]/90 hover:scale-[0.98] active:scale-[0.95] transition-all duration-200 shadow"
            >
              <MessageSquare size={13} />
              Get a free quote
            </a>
          </div>
          <div className="section-divider mt-20" />
        </section>

        {/* What You Get Section */}
        <section className="py-16 bg-[#0a0f1a]">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-xl md:text-2xl font-medium text-[#f1efe8] mb-8 text-center">
              What you get
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.deliverables.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#0f1729] border border-[rgba(133,183,235,0.15)] rounded-xl p-5 hover:border-[rgba(133,183,235,0.3)] hover:-translate-y-1 transition-all duration-200"
                >
                  <h3 className="font-sans font-medium text-[13px] text-[#f1efe8] mb-2">
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

        {/* Who This Is For Section */}
        <section className="py-16 bg-[#0a0f1a]">
          <div className="max-w-2xl mx-auto px-6 text-center flex flex-col items-center gap-4">
            <h2 className="text-xl md:text-2xl font-medium text-[#f1efe8]">
              Who this is for
            </h2>
            <p className="text-xs text-[#888780] max-w-md leading-relaxed">
              {data.whoThisIsFor}
            </p>
            <div className="section-divider mt-16" />
          </div>
        </section>

        {/* Proof Section (Optional) */}
        {data.proof && (
          <section className="py-16 bg-[#0a0f1a]">
            <div className="max-w-2xl mx-auto px-6 flex flex-col items-center gap-6">
              <span className="text-[10px] font-medium text-[#5DCAA5] tracking-[0.15em] uppercase select-none">
                proven capability
              </span>
              <h2 className="text-xl md:text-2xl font-medium text-[#f1efe8] text-center">
                {data.proof.title}
              </h2>
              <div className="p-6 border border-[rgba(133,183,235,0.15)] rounded-xl bg-[#0f1729]/50 text-center max-w-xl">
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
              <div className="section-divider mt-16" />
            </div>
          </section>
        )}

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

        {/* Final CTA / Related Services Section */}
        <section className="py-20 bg-[#0a0f1a] text-center">
          <div className="max-w-3xl mx-auto px-6 flex flex-col items-center gap-12">
            <div className="flex flex-col items-center gap-6">
              <h2 className="text-xl md:text-2xl font-medium text-[#f1efe8]">
                Ready to grow your business?
              </h2>
              <a
                href="https://wa.me/923218492868"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#378ADD] text-[#042C53] font-medium text-xs rounded hover:bg-[#378ADD]/90 hover:scale-[0.98] active:scale-[0.95] transition-all duration-200 shadow"
              >
                <MessageSquare size={14} />
                Message us on WhatsApp
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
