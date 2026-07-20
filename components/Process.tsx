"use client";

import { useEffect, useRef } from "react";

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-4");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const elements = containerRef.current?.querySelectorAll(".scroll-reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => {
      elements?.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section id="process" className="py-20 bg-[#0a0f1a] font-sans overflow-hidden">
      <div ref={containerRef} className="max-w-4xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="text-[10px] font-medium text-[#888780] tracking-[0.15em] uppercase mb-3 select-none">
            Our workflow
          </span>
          <h2 className="text-2xl md:text-3xl font-medium text-[#f1efe8] tracking-tight">
            How We Build
          </h2>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          
          {/* Desktop Horizontal Connecting Line */}
          <div className="hidden md:block absolute top-[28px] left-[5%] right-[5%] h-[1px] bg-gradient-to-r from-[#378ADD]/10 via-[#378ADD]/45 to-[#378ADD]/10 z-0" />

          {/* Mobile Vertical Connecting Line */}
          <div className="block md:hidden absolute top-[10px] bottom-[10px] left-[32px] w-[1px] bg-gradient-to-b from-[#378ADD]/10 via-[#378ADD]/45 to-[#378ADD]/10 z-0" />

          {/* Steps Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-4 relative z-10">
            {STEPS.map((step, idx) => (
              <div
                key={step.num}
                className="scroll-reveal opacity-0 translate-y-4 transition-all duration-500 ease-out flex flex-row md:flex-col gap-4 md:gap-3 p-4 md:p-3 md:bg-transparent bg-[#0f1729]/30 border border-transparent md:border-transparent border-[rgba(133,183,235,0.06)] rounded-xl relative"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                {/* Node Indicator */}
                <div className="flex flex-col items-center select-none shrink-0">
                  <div className="w-8 h-8 rounded-full bg-[#0a0f1a] border-2 border-[#378ADD] flex items-center justify-center text-[10px] font-mono font-bold text-[#378ADD] shadow-md group-hover:scale-110 transition-transform">
                    {step.num}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-1.5 pt-1 md:pt-0">
                  <h3 className="font-sans font-medium text-[13px] text-[#f1efe8]">
                    {step.label}
                  </h3>
                  <p className="font-sans text-[#888780] text-xs leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Divider */}
        <div className="section-divider mt-24" />
      </div>
    </section>
  );
}
