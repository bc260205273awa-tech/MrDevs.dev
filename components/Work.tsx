"use client";

import { useRef } from "react";
import { ExternalLink } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { use3DTilt } from "@/hooks/use3DTilt";

export default function Work() {
  const containerRef = useRef<HTMLDivElement>(null);
  useScrollReveal(containerRef);
  use3DTilt(containerRef, ".tilt-card", 10, 1000); // Powerful tilt

  return (
    <section id="work" ref={containerRef} className="py-24 md:py-32 bg-bg-main font-sans overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center">
        
        {/* Section Header */}
        <div className="flex flex-col items-center mb-16 scroll-reveal">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_8px_rgba(0,212,255,0.8)]"></span>
            <span className="text-[11px] font-bold text-accent-cyan tracking-[0.2em] uppercase select-none">
              Proof, not promises
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-heading tracking-tighter max-w-3xl text-center leading-[1.05]">
            Featured case study
          </h2>
        </div>

        {/* 3D Glass Browser Mockup */}
        <div className="tilt-card scroll-reveal group w-full bg-white/[0.02] backdrop-blur-3xl ring-1 ring-white/10 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(47,168,255,0.05)] transition-shadow duration-500 hover:shadow-[0_0_100px_rgba(47,168,255,0.15)]">
          
          {/* Browser Chrome Top Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-black/40 border-b border-white/5 backdrop-blur-md">
            <div className="flex items-center gap-1.5 sm:gap-2 select-none">
              {/* Glossy dark macOS buttons */}
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white/10 border border-white/10" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white/10 border border-white/10" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white/10 border border-white/10" />
            </div>
            
            {/* Interactive URL Bar glow */}
            <a
              href="https://www.khanhub.com.pk/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-black/40 border border-white/5 px-3 sm:px-6 py-1.5 sm:py-2 rounded-md text-[11px] sm:text-xs text-text-body font-mono hover:text-accent-primary hover:border-accent-primary/50 hover:shadow-glow-cyan transition-all duration-300 min-h-[36px]"
            >
              khanhub.com.pk
              <ExternalLink size={12} className="opacity-70 shrink-0" />
            </a>
            <div className="w-6 sm:w-12" /> {/* Spacer to balance dots */}
          </div>

          {/* Browser Content Area (Dashboard Split) */}
          <div className="p-4 sm:p-8 md:p-12 lg:p-16 flex flex-col xl:flex-row gap-8 lg:gap-16">
            
            {/* Left Column: The Narrative */}
            <div className="flex-1 flex flex-col gap-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_5px_rgba(0,212,255,0.8)]" />
                  <span className="text-[11px] font-medium text-accent-cyan tracking-widest uppercase">
                    KhanHub ERP
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-heading tracking-tight leading-[1.1] max-w-lg">
                  Centralized ERP built for national welfare workflows
                </h3>
              </div>

              <div className="flex flex-col gap-6 max-w-lg mt-4">
                <div className="tilt-card bg-white/5 border border-white/5 rounded-xl p-5 sm:p-6">
                  <span className="inline-block px-2.5 py-1 rounded bg-red-500/10 text-red-400 text-[10px] font-bold tracking-widest uppercase mb-3 border border-red-500/20">
                    The Problem
                  </span>
                  <p className="text-sm text-text-body leading-relaxed">
                    The organization struggled with managing thousands of patient records, staff schedules, and financial operations manually across multiple disconnected systems, causing massive data silos and delays.
                  </p>
                </div>
                
                <div className="tilt-card bg-white/5 border border-white/5 rounded-xl p-5 sm:p-6 relative overflow-hidden group/solution">
                  <div className="absolute inset-0 bg-accent-primary/5 opacity-0 group-hover/solution:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative z-10 inline-block px-2.5 py-1 rounded bg-accent-cyan/10 text-accent-cyan text-[10px] font-bold tracking-widest uppercase mb-3 border border-accent-cyan/20">
                    The Solution
                  </span>
                  <p className="relative z-10 text-sm text-text-body leading-relaxed">
                    We engineered a custom, centralized healthcare ERP built from scratch. It handles staff management, secure patient check-ins, automated billing, and live hospital workflows in one unified dashboard.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Telemetry Dashboard */}
            <div className="flex-1 flex flex-col gap-4 max-w-lg w-full">
              <span className="text-[10px] font-bold text-text-body tracking-widest uppercase mb-2 select-none">
                Live Telemetry Overview
              </span>
              
              {/* Massive Top Widget */}
              <div className="tilt-card relative bg-bg-deep border border-white/5 rounded-2xl p-6 sm:p-8 flex flex-col items-start justify-center h-36 sm:h-48 overflow-hidden group/widget">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent-primary/20 blur-[50px] rounded-full"></div>
                <span className="relative z-10 text-accent-primary text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-1">
                  50K+
                </span>
                <span className="relative z-10 text-xs sm:text-sm text-text-body font-medium tracking-wide">
                  Lives impacted directly
                </span>
              </div>

              {/* Bottom Split Widgets */}
              <div className="flex flex-row gap-3 sm:gap-4 h-auto sm:h-40">
                <div className="tilt-card flex-1 bg-bg-deep border border-white/5 rounded-2xl p-4 sm:p-6 flex flex-col justify-end relative overflow-hidden min-h-[110px] sm:min-h-0">
                  <div className="absolute -top-10 -left-10 w-32 h-32 bg-accent-cyan/10 blur-[40px] rounded-full"></div>
                  <span className="relative z-10 text-text-heading text-2xl sm:text-3xl font-bold tracking-tight mb-1">
                    16+
                  </span>
                  <span className="relative z-10 text-[10px] sm:text-xs text-text-body font-medium uppercase tracking-wider">
                    Departments
                  </span>
                </div>
                
                <div className="tilt-card flex-1 bg-bg-deep border border-white/5 rounded-2xl p-4 sm:p-6 flex flex-col justify-end relative overflow-hidden min-h-[110px] sm:min-h-0">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/10 blur-[40px] rounded-full"></div>
                  <span className="relative z-10 text-text-heading text-2xl sm:text-3xl font-bold tracking-tight mb-1">
                    24/7
                  </span>
                  <span className="relative z-10 text-[10px] sm:text-xs text-text-body font-medium uppercase tracking-wider">
                    Emergency Care
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Caption */}
        <p className="scroll-reveal mt-10 text-sm text-text-body leading-relaxed text-center max-w-md">
          Built solo, end-to-end, by the exact same engineer you'd be working with.
        </p>

        {/* Section Divider */}
        <div className="section-divider mt-32 opacity-50" />
      </div>
    </section>
  );
}
