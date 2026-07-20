"use client";

import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "Who actually builds my project?",
    answer: "The founder of MrDevs builds your project end-to-end. You have a direct line of communication with the person writing your code, designing your interface, and structuring your database. No layers, no account managers, and no outsourced junior developers.",
  },
  {
    question: "How is MrDevs different from a traditional 10-person agency?",
    answer: "Traditional agencies charge high markups to support overhead like project managers and sales reps, while outsourcing the actual development to junior staff. We do the opposite: you pay only for senior engineering, getting direct developer access and 5x faster iteration cycles.",
  },
  {
    question: "Do you provide support after the launch?",
    answer: "Yes. We don't just hand over the code and disappear. We offer ongoing support packages for updates, security patches, API maintenance, and scaling as your business grows.",
  },
  {
    question: "Can you integrate with our existing tools?",
    answer: "Absolutely. We specialize in custom API integrations, automated WhatsApp bots, database synchronizations, and connecting legacy spreadsheets or tools to modern web systems.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useScrollReveal(containerRef);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" ref={containerRef} className="py-20 bg-[#0a0f1a] font-sans border-t border-[rgba(133,183,235,0.03)] overflow-hidden">
      <div className="max-w-2xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center mb-12 text-center scroll-reveal">
          <span className="text-[10px] font-medium text-[#888780] tracking-[0.15em] uppercase mb-3 select-none">
            FAQ
          </span>
          <h2 className="text-2xl md:text-3xl font-medium text-[#f1efe8] tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ List */}
        <div className="flex flex-col gap-3 scroll-reveal" style={{ transitionDelay: "100ms" }}>
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#0f1729] border border-[rgba(133,183,235,0.12)] rounded-lg overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-sans font-medium text-xs md:text-sm text-[#f1efe8] hover:text-[#378ADD] transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={16}
                    className={`text-[#888780] transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#378ADD]" : ""
                    }`}
                  />
                </button>
                <div
                  className={`transition-all duration-200 ease-in-out ${
                    isOpen ? "max-h-40 border-t border-[rgba(133,183,235,0.06)]" : "max-h-0"
                  } overflow-hidden`}
                >
                  <p className="p-5 text-xs text-[#888780] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
