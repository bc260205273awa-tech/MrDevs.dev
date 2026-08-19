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
      // [NEW] Grid spanning rules for Bento layout
      gridClass: "lg:col-span-2 lg:row-span-2 min-h-0 sm:min-h-[350px] lg:min-h-[500px]",
      iconSize: 140,
    },
    {
      icon: ShieldCheck,
      title: "Single-Point Accountability",
      description: "One person responsible for your design, databases, code, and deployment. No hand-offs, no communication gaps, and 100% project ownership.",
      gridClass: "lg:col-span-1 lg:row-span-1 min-h-0 sm:min-h-[260px] lg:min-h-[300px]",
      iconSize: 90,
    },
    {
      icon: BuiltAtScale,
      title: "Proven Operational Scale",
      description: "We build deep operational software, not template websites. Engineered KhanHub — a 16-department healthcare ERP running 24/7 for 50,000+ people.",
      gridClass: "lg:col-span-1 lg:row-span-1 min-h-0 sm:min-h-[260px] lg:min-h-[300px]",
      iconSize: 90,
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
      className="py-24 md:py-32 bg-bg-main font-sans border-t border-accent-primary/5 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col mb-16 scroll-reveal">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_8px_rgba(0,212,255,0.8)]"></span>
            <span className="text-[11px] font-bold text-accent-cyan tracking-[0.2em] uppercase select-none">
              Why Us
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text-heading tracking-tighter max-w-3xl leading-[1.05]">
            Why hire MrDevs over the other{" "}
            <span className="text-accent-primary" style={{ textShadow: '0 0 20px rgba(47,168,255,0.3)' }}>
              10 agencies?
            </span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-6">
          {PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={index}
                className={`scroll-reveal group relative bg-white/5 backdrop-blur-xl border border-white/5 border-t-white/10 rounded-3xl p-6 sm:p-8 hover:border-white/10 hover:bg-white/10 transition-colors duration-500 flex flex-col justify-end overflow-hidden ${pillar.gridClass}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* [CHANGED] Massive Watermark Icon */}
                <div className="absolute top-8 right-8 text-accent-primary opacity-[0.07] group-hover:opacity-[0.15] group-hover:scale-110 transition-all duration-700 pointer-events-none">
                  <Icon size={pillar.iconSize} strokeWidth={1} />
                </div>

                {/* Content anchored to bottom */}
                <div className="relative z-10 mt-auto max-w-md">
                  <h3 className="font-sans font-semibold text-2xl lg:text-3xl text-text-heading mb-3 tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="font-sans text-text-body text-[15px] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
                
                {/* Subtle bottom gradient glow on hover */}
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent-primary/20 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Section Divider */}
        <div className="section-divider mt-32 opacity-50" />
      </div>
    </section>
  );
}
