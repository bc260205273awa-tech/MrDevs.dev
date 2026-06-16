"use client";

import { ExternalLink } from "lucide-react";

export default function Work() {
  return (
    <section id="work" className="py-20 bg-[#0a0f1a] font-sans">
      <div className="max-w-4xl mx-auto px-6 flex flex-col items-center">
        
        {/* Section Label */}
        <span className="text-[10px] font-medium text-[#5DCAA5] tracking-[0.15em] uppercase mb-3 select-none">
          Proof, not promises
        </span>

        {/* Headline */}
        <h2 className="text-2xl md:text-3xl font-medium text-[#f1efe8] mb-12 text-center">
          Featured case study
        </h2>

        {/* Browser Mockup Card */}
        <a
          href="https://www.khanhub.com.pk/"
          target="_blank"
          rel="noopener noreferrer"
          className="group block w-full border border-[rgba(133,183,235,0.15)] rounded-xl overflow-hidden bg-[#0c1424] cursor-pointer hover:border-[rgba(133,183,235,0.3)] hover:scale-[0.98] active:scale-[0.97] transition-all duration-300 shadow-2xl"
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
                Trusted by 50,000+ lives
              </span>
            </div>

            {/* Project Title */}
            <h3 className="text-xl md:text-2xl font-medium text-[#f1efe8] tracking-tight max-w-md">
              Empowering lives through care
            </h3>

            {/* 3-Column Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl mt-4">
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
        </a>

        {/* Caption */}
        <p className="mt-6 text-[12px] text-[#888780] leading-relaxed text-center max-w-[320px]">
          Solo-built, multi-domain ERP for a national healthcare and welfare network — auth, finance, staff, and a TikTok-style video platform, end to end.
        </p>

        {/* Section Divider */}
        <div className="section-divider mt-24" />
      </div>
    </section>
  );
}
