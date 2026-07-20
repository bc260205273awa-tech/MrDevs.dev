"use client";

import { useRef } from "react";
import { MessageSquare } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function CondensedCTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  useScrollReveal(containerRef);

  return (
    <section ref={containerRef} className="py-10 bg-[#0a0f1a] font-sans overflow-hidden">
      <div className="max-w-xl mx-auto px-6 flex flex-col items-center text-center gap-4 scroll-reveal opacity-0 translate-y-3 transition-all">
        <h3 className="text-xs md:text-sm font-medium text-[#f1efe8] tracking-wide">
          Ready to talk? Message us on WhatsApp
        </h3>
        <a
          href="https://wa.me/923218492868"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#378ADD] text-[#042C53] font-medium text-xs rounded hover:bg-[#378ADD]/90 hover:scale-[0.98] active:scale-[0.95] transition-all duration-200 shadow select-none"
        >
          <MessageSquare size={14} />
          Book a Free Strategy Call on WhatsApp
        </a>
        <div className="section-divider mt-10" />
      </div>
    </section>
  );
}
