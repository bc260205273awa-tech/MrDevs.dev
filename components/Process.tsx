"use client";

import { useRef } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const STEPS = [
  {
    num: "01",
    label: "Discovery",
    description: "We jump on a call to map out your user flows, business goals, and project scope.",
  },
  {
    num: "02",
    label: "Planning",
    description: "I write a detailed architectural plan and database structure before writing any code.",
  },
  {
    num: "03",
    label: "Design",
    description: "You review interactive UI mockups and approve the visual style first.",
  },
  {
    num: "04",
    label: "Development",
    description: "I write clean, high-performance code in Next.js, React Native, or custom databases.",
  },
  {
    num: "05",
    label: "Launch",
    description: "We deploy your project to production and check that analytics and speed are perfect.",
  },
  {
    num: "06",
    label: "Support",
    description: "You get a direct line for monthly maintenance, API updates, and performance tuning.",
  },
];

export default function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  useScrollReveal(containerRef);

  return (
    <section id="process" ref={containerRef} className="py-24 md:py-32 bg-bg-main font-sans overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center mb-24 scroll-reveal">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_8px_rgba(0,212,255,0.8)]"></span>
            <span className="text-[11px] font-bold text-accent-cyan tracking-[0.2em] uppercase select-none">
              Our workflow
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-heading tracking-tighter max-w-3xl text-center leading-[1.05]">
            How We Build
          </h2>
        </div>

        {/* Vertical Timeline Container */}
        <div className="relative">
          
          {/* The Connecting Spine (Desktop centered, Mobile left) */}
          <div className="absolute top-0 bottom-0 left-[36px] md:left-1/2 w-[2px] -translate-x-1/2 z-0">
            {/* Static background track */}
            <div className="absolute inset-0 bg-white/5" />
            {/* 
              Inner gradient line prepped for future GSAP scroll-draw animation.
              Currently fully scaled (scale-y-100). When animating later, use scale-y-0 to scale-y-100.
            */}
            <div className="absolute top-0 w-full h-full bg-gradient-to-b from-accent-cyan via-accent-primary to-transparent origin-top scale-y-100" />
          </div>

          {/* Steps Loop */}
          <div className="relative z-10 flex flex-col gap-12 md:gap-24">
            {STEPS.map((step, idx) => {
              const isEven = idx % 2 === 0;
              
              return (
                <div 
                  key={step.num} 
                  className={`flex flex-col md:flex-row items-start md:items-center w-full scroll-reveal ${!isEven ? 'md:flex-row-reverse' : ''}`}
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  
                  {/* Mobile Node Indicator (sits exactly on the left spine) */}
                  <div className="md:hidden absolute left-[36px] -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-bg-main border-2 border-accent-cyan shadow-glow-cyan z-20 mt-[34px]" />
                  
                  {/* Glass Card Half */}
                  <div className={`w-full md:w-1/2 pl-[72px] md:pl-0 ${isEven ? 'md:pr-16 lg:pr-24' : 'md:pl-16 lg:pl-24'}`}>
                    <div className="bg-white/5 backdrop-blur-xl border border-white/5 border-t-white/10 rounded-3xl p-8 lg:p-10 hover:bg-white/10 transition-colors duration-500 relative group overflow-hidden">
                      
                      {/* Massive Typographic Glow Watermark */}
                      <div className={`absolute -top-8 ${isEven ? 'md:-right-4 right-4' : 'md:-left-4 right-4'} text-[8rem] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-accent-cyan/10 to-transparent select-none pointer-events-none group-hover:from-accent-cyan/20 transition-all duration-700`}>
                        {step.num}
                      </div>
                      
                      <div className="relative z-10">
                        <h3 className="font-sans font-semibold text-2xl lg:text-3xl text-text-heading mb-3 tracking-tight group-hover:text-accent-cyan transition-colors duration-500">
                          {step.label}
                        </h3>
                        <p className="font-sans text-text-body text-[15px] leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Desktop Center Node Indicator */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 items-center justify-center z-20">
                    <div className="w-4 h-4 rounded-full bg-bg-main border-2 border-accent-cyan shadow-glow-cyan" />
                  </div>

                  {/* Empty Space Half (Desktop) */}
                  <div className="hidden md:block w-1/2" />
                  
                </div>
              );
            })}
          </div>
        </div>

        {/* Section Divider */}
        <div className="section-divider mt-32 opacity-50" />
      </div>
    </section>
  );
}
