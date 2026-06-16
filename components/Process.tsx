"use client";

import { useEffect, useRef } from "react";

const STEPS = [
  {
    num: "01",
    label: "Discover",
    description: "Understanding your business goals, target audience, and revenue pipelines.",
  },
  {
    num: "02",
    label: "Design",
    description: "Crafting minimalist, premium interfaces that build trust in under 3 seconds.",
  },
  {
    num: "03",
    label: "Build",
    description: "Engineering clean, high-performance systems with Next.js and React Native.",
  },
  {
    num: "04",
    label: "Launch",
    description: "Deploying to production, optimizing for search, and monitoring conversions.",
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
        threshold: 0.1,
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
    <section id="process" className="py-20 bg-[#0a0f1a] font-sans">
      <div ref={containerRef} className="max-w-4xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="text-[10px] font-medium text-[#888780] tracking-[0.15em] uppercase mb-3 select-none">
            Our workflow
          </span>
          <h2 className="text-2xl md:text-3xl font-medium text-[#f1efe8] tracking-tight">
            How we build
          </h2>
        </div>

        {/* Steps Flow (Grid/Timeline) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative">
          {STEPS.map((step, idx) => (
            <div
              key={step.num}
              className="scroll-reveal opacity-0 translate-y-4 transition-all duration-700 ease-out flex flex-col gap-3 p-5 bg-[#0f1729]/50 border border-[rgba(133,183,235,0.06)] rounded-xl relative"
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              {/* Step number */}
              <span className="text-[10px] font-mono text-[#378ADD]/75 tracking-wider select-none font-medium">
                step {step.num}
              </span>
              
              {/* Step title */}
              <h3 className="font-sans font-medium text-[13px] text-[#f1efe8]">
                {step.label.toLowerCase()}
              </h3>

              {/* Step description */}
              <p className="font-sans text-[#888780] text-xs leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Section Divider */}
        <div className="section-divider mt-24" />
      </div>
    </section>
  );
}
