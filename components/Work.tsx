"use client";

import { useRef } from "react";
import { ExternalLink } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function Work() {
  const containerRef = useRef<HTMLDivElement>(null);
  useScrollReveal(containerRef);

  return (
    <section id="work" ref={containerRef} className="py-20 bg-[#0a0f1a] font-sans overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 flex flex-col items-center">
        
        {/* Section Label */}
        <span className="text-[10px] font-medium text-[#5DCAA5] tracking-[0.15em] uppercase mb-3 select-none scroll-reveal opacity-0 translate-y-3 transition-all">
          Proof, not promises
        </span>

        {/* Headline */}
        <h2 className="text-2xl md:text-3xl font-medium text-[#f1efe8] mb-12 text-center scroll-reveal opacity-0 translate-y-3 transition-all">
          Featured case study
        </h2>

        {/* Browser Mockup Card */}
        <a
          href="https://www.khanhub.com.pk/"
          target="_blank"
          rel="noopener noreferrer"
          className="scroll-reveal opacity-0 translate-y-3 transition-all duration-300 group block w-full border border-[rgba(133,183,235,0.15)] rounded-xl overflow-hidden bg-[#0c1424] cursor-pointer hover:border-[rgba(133,183,235,0.3)] hover:scale-[0.98] active:scale-[0.97] shadow-2xl"
        >
          {/* Browser Chrome Top Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#000000] border-b border-[rgba(133,183,235,0.08)]">
            <div className="flex items-center gap-1.5 select-none">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
            </div>
            <div className="flex items-center gap-1 bg-[#0a0f1a] px-4 py-1 rounded text-[10px] text-[#888780] font-mono select-all">
              khanhub.com.pk
              <ExternalLink size={10} className="text-[#5F5E5A] group-hover:text-[#378ADD] transition-colors" />
            </div>
            <div className="w-8" /> {/* Spacer */}
          </div>

          {/* Browser Content Area */}
          <div className="p-8 md:p-12 flex flex-col items-center text-center gap-6">
            
            {/* Status Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(93,202,165,0.08)] border border-[rgba(93,202,165,0.12)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5DCAA5]" />
              <span className="text-[11px] font-medium text-[#5DCAA5] tracking-wide">
                Case Study: KhanHub ERP
              </span>
            </div>

            {/* Project Title */}
            <h3 className="text-xl md:text-2xl font-medium text-[#f1efe8] tracking-tight max-w-md">
              Centralized ERP built for national welfare workflows
            </h3>

            {/* Problem & Solution Narrative */}
            <div className="flex flex-col gap-4 max-w-xl text-left border-l border-[rgba(133,183,235,0.15)] pl-4 my-2">
              <div>
                <span className="text-[10px] font-medium text-[#378ADD] tracking-wider uppercase block mb-1">
                  The Problem
                </span>
                <p className="text-xs text-[#888780] leading-relaxed">
                  The organization struggled with managing thousands of patient records, staff schedules, and financial operations manually across multiple disconnected systems.
                </p>
              </div>
              <div>
                <span className="text-[10px] font-medium text-[#378ADD] tracking-wider uppercase block mb-1">
                  The Solution
                </span>
                <p className="text-xs text-[#888780] leading-relaxed">
                  We engineered KhanHub — a custom, centralized healthcare ERP built from scratch. It handles staff management, secure patient check-ins, automated billing, and live hospital workflows in one unified dashboard.
                </p>
              </div>
            </div>

            {/* 3-Column Stats Row (The Result) */}
            <div className="w-full flex flex-col gap-2 max-w-2xl mt-2">
              <span className="text-[10px] font-medium text-[#5DCAA5] tracking-wider uppercase text-center block mb-1 select-none">
                The Result
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-[#0a0f1a]/80 border border-[rgba(133,183,235,0.06)] rounded-lg flex flex-col items-center gap-1">
                  <span className="text-[#378ADD] text-lg font-medium">50K+</span>
                  <span className="text-[11px] text-[#888780]">Lives impacted</span>
                </div>
                <div className="p-4 bg-[#0a0f1a]/80 border border-[rgba(133,183,235,0.06)] rounded-lg flex flex-col items-center gap-1">
                  <span className="text-[#378ADD] text-lg font-medium">16+</span>
                  <span className="text-[11px] text-[#888780]">Departments</span>
                </div>
                <div className="p-4 bg-[#0a0f1a]/80 border border-[rgba(133,183,235,0.06)] rounded-lg flex flex-col items-center gap-1">
                  <span className="text-[#378ADD] text-lg font-medium">24/7</span>
                  <span className="text-[11px] text-[#888780]">Emergency care</span>
                </div>
              </div>
            </div>

          </div>
        </a>

        {/* Caption */}
        <p className="scroll-reveal opacity-0 translate-y-3 transition-all mt-6 text-[12px] text-[#888780] leading-relaxed text-center max-w-[360px]" style={{ transitionDelay: "150ms" }}>
          Built solo, end-to-end, by the same engineer you&apos;d be working with.
        </p>

        {/* Section Divider */}
        <div className="section-divider mt-24" />
      </div>
    </section>
  );
}
