"use client";

import { useRef } from "react";
import { CheckCircle2, User } from "lucide-react";
import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface FounderProps {
  name?: string;
  role?: string;
  story?: string;
  imageUrl?: string;
}

export default function Founder({
  name = "Hammad Mirza",
  role = "Founder & Lead Developer",
  story = "I started MrDevs to build software with total alignment and direct developer contact. When you hire me, there are no account managers, translation delays, or outsourced contractors. Every line of code, database index, and user interface element is written directly by me.",
  imageUrl
}: FounderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useScrollReveal(containerRef);

  const TRUST_BADGES = [
    "Direct communication — no account managers",
    "You work with the person who builds it",
    "Solo-built systems, end-to-end"
  ];

  return (
    <section id="founder" ref={containerRef} className="py-20 bg-[#0a0f1a] font-sans border-t border-[rgba(133,183,235,0.03)] overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center mb-12 text-center scroll-reveal opacity-0 translate-y-3 transition-all">
          <span className="text-[10px] font-medium text-[#5DCAA5] tracking-[0.15em] uppercase mb-3 select-none">
            Trust & Craftsmanship
          </span>
          <h2 className="text-2xl md:text-3xl font-medium text-[#f1efe8] tracking-tight">
            Direct Partnership, No Middlemen
          </h2>
        </div>

        {/* Founder Card */}
        <div className="scroll-reveal opacity-0 translate-y-3 transition-all duration-300 relative bg-[#0f1729] border border-[rgba(133,183,235,0.15)] rounded-xl p-8 md:p-12 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Accent glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#378ADD]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Photo Placeholder */}
          <div className="shrink-0 flex flex-col items-center gap-3">
            {imageUrl ? (
              <div className="relative w-36 h-36 rounded-full overflow-hidden border border-[rgba(133,183,235,0.2)] bg-[#0a0f1a]">
                <Image src={imageUrl} alt={name} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-36 h-36 rounded-full border border-dashed border-[rgba(133,183,235,0.3)] bg-[#0a0f1a] flex flex-col items-center justify-center p-4 text-center text-[10px] text-[#888780] gap-2">
                <User size={24} className="text-[#378ADD]/65" />
                <span>Founder Photo<br />(300x300px)</span>
              </div>
            )}
            <div className="text-center">
              <h3 className="font-medium text-sm text-[#f1efe8]">{name}</h3>
              <p className="text-[10px] text-[#378ADD] font-mono mt-0.5">{role}</p>
            </div>
          </div>

          {/* Founder Bio / Story */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-medium text-[#5F5E5A] tracking-wider uppercase select-none">
                Founder Story
              </span>
              <p className="text-xs text-[#888780] leading-relaxed italic">
                &ldquo;{story}&rdquo;
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-col gap-2 pt-4 border-t border-[rgba(133,183,235,0.06)]">
              <span className="text-[10px] font-medium text-[#5F5E5A] tracking-wider uppercase select-none mb-1">
                How We Operate:
              </span>
              <div className="flex flex-col gap-2">
                {TRUST_BADGES.map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <CheckCircle2 size={12} className="text-[#5DCAA5]" />
                    <span className="text-[11px] text-[#f1efe8]">{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Section Divider */}
        <div className="section-divider mt-24" />
      </div>
    </section>
  );
}
