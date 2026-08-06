"use client";

import { useRef } from "react";
// [CHANGED] GSAP imports maintained
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
  // [NEW] Ref for the timeline wrapper to measure exact vertical height
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Keep CSS reveal for the static header
  useScrollReveal(containerRef);

  // [CHANGED] Master timeline syncing the path drawing, dot glows, and card fades
  useGSAP(() => {
    if (!timelineRef.current) return;
    
    const timelineHeight = timelineRef.current.offsetHeight;
    const paths = gsap.utils.toArray('.gsap-spine-path') as SVGPathElement[];
    
    // Create the master scrubbed timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%", 
        end: "bottom 60%", 
        scrub: 1, 
      }
    });

    // 1. Setup and Animate Paths
    paths.forEach((path) => {
      const length = path.getTotalLength();
      
      // Hide stroke initially
      gsap.set(path, { 
        strokeDasharray: length, 
        strokeDashoffset: length,
        opacity: 0
      });

      // Animate stroke and opacity over the entire scrub (absolute time 0 to 1)
      tl.to(path, { strokeDashoffset: 0, duration: 1, ease: "none" }, 0);
      tl.to(path, { opacity: 1, duration: 0.1, ease: "none" }, 0);
    });

    // 2. Synchronize Dots and Cards to the Path
    const refPath = paths[0]; // Use desktop path for coordinate math (Y values are identical to mobile)
    const pathLength = refPath.getTotalLength();
    const resolution = pathLength / 500; // Granular stepping resolution
    
    const cards = gsap.utils.toArray('.gsap-step-card') as HTMLDivElement[];
    
    cards.forEach((card) => {
      // Find exact vertical center of the card relative to the SVG container
      const cardY = card.offsetTop + (card.offsetHeight / 2);
      const targetYPercentage = (cardY / timelineHeight) * 100;
      
      // Trace the SVG path length until its Y coordinate hits our target
      let targetLength = pathLength; 
      for (let l = 0; l <= pathLength; l += resolution) {
        if (refPath.getPointAtLength(l).y >= targetYPercentage) {
          targetLength = l;
          break;
        }
      }
      
      // Calculate scrub progress (0 to 1) at which the line physically touches this dot
      const progress = targetLength / pathLength;

      const dots = card.querySelectorAll('.gsap-center-dot');
      const content = card.querySelector('.gsap-card-content');
      
      // Insert dot glow precisely at 'progress'
      tl.fromTo(dots, 
        { scale: 0.3, opacity: 0.2, boxShadow: 'none' },
        { scale: 1.2, opacity: 1, boxShadow: '0 0 20px var(--accent-cyan)', duration: 0.1, ease: "back.out(2)" },
        progress
      );
      
      // Insert card fade exactly concurrently
      if (content) {
        tl.fromTo(content,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.15, ease: "power2.out" },
          progress
        );
      }
    });

  }, { scope: containerRef }); // Auto cleanup

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
        {/* [CHANGED] Added timelineRef to measure absolute heights for the SVG sync */}
        <div className="relative" ref={timelineRef}>
          
          {/* SVG Connecting Spine Wrapper */}
          <div className="absolute top-0 bottom-0 left-[36px] md:left-1/2 w-[2px] md:w-[400px] -translate-x-1/2 z-0 pointer-events-none">
            
            <svg className="w-0 h-0 absolute">
              <defs>
                <linearGradient id="spine-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent-cyan)" />
                  <stop offset="50%" stopColor="var(--accent-primary)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>

            {/* Desktop Curved Spine (Single Continuous Path) */}
            <svg className="hidden md:block absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path 
                className="gsap-spine-path"
                d="M 50 0 C 50 5, 20 10, 50 17 S 80 25, 50 33 S 20 42, 50 50 S 80 58, 50 67 S 20 75, 50 83 S 80 92, 50 100" 
                vectorEffect="non-scaling-stroke" 
                stroke="url(#spine-grad)" 
                strokeWidth="2" 
                fill="none" 
              />
            </svg>

            {/* Mobile Straight Spine */}
            <svg className="block md:hidden absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path 
                className="gsap-spine-path"
                d="M 50 0 L 50 100" 
                vectorEffect="non-scaling-stroke" 
                stroke="url(#spine-grad)" 
                strokeWidth="2" 
                fill="none" 
              />
            </svg>
          </div>

          {/* Steps Loop */}
          <div className="relative z-10 flex flex-col gap-12 md:gap-24">
            {STEPS.map((step, idx) => {
              const isEven = idx % 2 === 0;
              
              return (
                <div 
                  key={step.num} 
                  // [CHANGED] Standard relative flex row for exact DOM measurements
                  className={`gsap-step-card relative flex flex-col md:flex-row items-start md:items-center w-full ${!isEven ? 'md:flex-row-reverse' : ''}`}
                >
                  
                  {/* Mobile Node Indicator */}
                  {/* [CHANGED] Aligned exactly to absolute center of card for perfect Y-sync */}
                  <div className="md:hidden absolute left-[36px] top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center z-20">
                    <div className="gsap-center-dot w-3.5 h-3.5 rounded-full bg-bg-main border-2 border-accent-cyan" />
                  </div>
                  
                  {/* Glass Card Half */}
                  {/* [CHANGED] Added gsap-card-content class for targeted fade */}
                  <div className={`gsap-card-content w-full md:w-1/2 pl-[72px] md:pl-0 ${isEven ? 'md:pr-16 lg:pr-24' : 'md:pl-16 lg:pl-24'}`}>
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
                  {/* [CHANGED] Aligned exactly to absolute center of card for perfect Y-sync */}
                  <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center z-20">
                    <div className="gsap-center-dot w-4 h-4 rounded-full bg-bg-main border-2 border-accent-cyan" />
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
