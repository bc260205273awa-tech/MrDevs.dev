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
  name = "Mubeen Ahmad",
  role = "Founder & Lead Developer",
  story = "I started MrDevs to build software with total alignment and direct developer contact. When you hire me, there are no account managers, translation delays, or outsourced contractors. Every line of code, database index, and user interface element is written directly by me.",
  imageUrl = "/founder.webp"
}: FounderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useScrollReveal(containerRef);

  const TRUST_BADGES = [
    "Direct communication",
    "Solo-built systems",
    "No outsourced contractors"
  ];

  return (
    <section id="founder" ref={containerRef} className="py-24 md:py-32 bg-bg-main font-sans overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center mb-16 md:mb-24 text-center scroll-reveal">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_8px_rgba(0,212,255,0.8)]"></span>
            <span className="text-[11px] font-bold text-accent-cyan tracking-[0.2em] uppercase select-none">
              Trust & Craftsmanship
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-heading tracking-tighter max-w-3xl text-center leading-[1.05]">
            Direct Partnership, No Middlemen
          </h2>
        </div>

        {/* Editorial Glass Container */}
        <div className="scroll-reveal relative bg-white/5 backdrop-blur-xl border border-white/5 border-t-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
          
          {/* Left Side: Dramatic Vertical Portrait */}
          <div className="w-full md:w-2/5 shrink-0 relative aspect-square md:aspect-auto md:min-h-[500px]">
            {imageUrl ? (
              <Image 
                src={imageUrl} 
                alt={name} 
                fill 
                className="object-cover object-top md:object-center grayscale hover:grayscale-0 transition-all duration-700" 
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            ) : (
              <div className="w-full h-full bg-white/5 flex flex-col items-center justify-center text-[#888780] gap-4">
                <User size={48} className="text-accent-cyan/50" />
                <span className="text-xs uppercase tracking-widest">Portrait Slot</span>
              </div>
            )}
            
            {/* Subtle inner shadow for depth against the image */}
            <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.4)] pointer-events-none" />
          </div>

          {/* Right Side: Pull-Quote & Content */}
          <div className="flex-1 flex flex-col justify-between p-8 md:p-12 lg:p-16 relative">
            
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-6">
              {/* Giant Stylized Quotation Mark */}
              <div className="text-accent-cyan/20 text-8xl md:text-9xl font-serif absolute -top-8 -left-4 md:-top-12 md:-left-8 select-none pointer-events-none">
                &ldquo;
              </div>
              
              {/* Massive Pull Quote */}
              <div className="relative z-10">
                <p className="text-2xl md:text-3xl lg:text-[32px] font-medium text-white italic leading-relaxed tracking-tight">
                  {story}
                </p>
              </div>

              {/* Founder Bio Line */}
              <div className="mt-4 md:mt-8 flex flex-col">
                <h3 className="font-semibold text-lg text-text-heading">{name}</h3>
                <p className="text-sm text-accent-cyan tracking-wide font-medium mt-1">{role}</p>
              </div>
            </div>

            {/* Horizontal Trust Badges Ribbon */}
            <div className="relative z-10 mt-12 md:mt-24 pt-6 md:pt-8 border-t border-white/10">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                {TRUST_BADGES.map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-accent-cyan shrink-0" />
                    <span className="text-[13px] md:text-sm text-text-body font-medium tracking-wide">
                      {badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Section Divider */}
        <div className="section-divider mt-32 opacity-50" />
      </div>
    </section>
  );
}
