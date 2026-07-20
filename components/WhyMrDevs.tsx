"use client";

import { useRef } from "react";
import { UserCheck, ShieldCheck, Database } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function WhyMrDevs() {
  const containerRef = useRef<HTMLDivElement>(null);
  useScrollReveal(containerRef);

  const PILLARS = [
    {
      icon: UserCheck,
      title: "Direct Founder Access",
      description: "Speak directly to the developer building your system. No account managers or sales representatives. You get direct access and 5x faster iteration cycles.",
    },
    {
      icon: ShieldCheck,
      title: "Single-Point Accountability",
      description: "One person responsible for your design, databases, code, and deployment. No hand-offs, no communication gaps, and 100% project ownership.",
    },
    {
      icon: BuiltAtScale,
      title: "Proven Operational Scale",
      description: "We build deep operational software, not template websites. Engineered KhanHub — a 16-department healthcare ERP running 24/7 for 50,000+ people.",
    },
  ];

  // Helper inside the file to avoid import issues
  function BuiltAtScale(props: any) {
    return <Database {...props} />;
  }

  return (
    <section
      id="why-us"
      ref={containerRef}
      className="py-20 bg-[#0a0f1a] font-sans border-t border-[rgba(133,183,235,0.03)] overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center mb-12 text-center scroll-reveal opacity-0 translate-y-3 transition-all">
          <span className="text-[10px] font-medium text-[#5DCAA5] tracking-[0.15em] uppercase mb-3 select-none">
            Why Us
          </span>
          <h2 className="text-2xl md:text-3xl font-medium text-[#f1efe8] tracking-tight max-w-lg leading-tight">
            Why hire MrDevs over the other 10 agencies?
          </h2>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={index}
                className="scroll-reveal opacity-0 translate-y-3 transition-all group relative bg-[#0f1729] border border-[rgba(133,183,235,0.15)] rounded-xl p-5 hover:border-[rgba(133,183,235,0.3)] hover:-translate-y-1 duration-200 flex flex-col gap-4"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-[#378ADD]/10 flex items-center justify-center group-hover:bg-[#378ADD]/20 transition-colors duration-200">
                  <Icon size={18} className="text-[#378ADD]" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-sans font-medium text-[13px] text-[#f1efe8] mb-1.5">
                    {pillar.title}
                  </h3>
                  <p className="font-sans text-[#888780] text-xs leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Divider */}
        <div className="section-divider mt-24" />
      </div>
    </section>
  );
}
