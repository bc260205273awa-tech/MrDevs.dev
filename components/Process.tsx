"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollReveal } from "@/hooks/useScrollReveal";

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
  const timelineRef = useRef<HTMLDivElement>(null);
  
  useScrollReveal(containerRef);

  useGSAP(() => {
    if (!timelineRef.current || !containerRef.current) return;
    
    // [FIX] The fragmentation bug was caused by a known SVG behavior: when vector-effect="non-scaling-stroke" 
    // is used alongside stroke-dasharray in a scaled viewBox, browsers evaluate the dasharray in screen pixels 
    // but getTotalLength in unscaled user units. This results in the dash acting like literal disconnected 
    // dashed lines (130px dashes on a 2000px screen height), which perfectly explains the screenshot.
    
    // To fix this forever, we will dynamically generate the SVG path inside GSAP using EXACT physical pixels 
    // relative to the container. No viewBox scaling, no non-scaling-stroke, no distortions. Just pure math.
    
    const timelineHeight = timelineRef.current.offsetHeight;
    
    // Grab the SVG elements (we scoped them with classes so they are easy to find)
    const desktopSvg = containerRef.current.querySelector('.gsap-desktop-svg') as SVGSVGElement;
    const mobileSvg = containerRef.current.querySelector('.gsap-mobile-svg') as SVGSVGElement;
    const desktopPath = containerRef.current.querySelector('.gsap-desktop-path') as SVGPathElement;
    const mobilePath = containerRef.current.querySelector('.gsap-mobile-path') as SVGPathElement;
    
    if (!desktopSvg || !mobileSvg || !desktopPath || !mobilePath) return;

    // Set pixel-perfect viewBoxes
    desktopSvg.setAttribute('viewBox', `0 0 400 ${timelineHeight}`);
    mobileSvg.setAttribute('viewBox', `0 0 2 ${timelineHeight}`);

    const cards = gsap.utils.toArray('.gsap-step-card') as HTMLDivElement[];
    
    // 1. Generate the exact pixel path tracing perfectly through every dot
    let dDesktop = `M 200 0`;
    let lastY = 0;
    
    if (cards.length > 0) {
      // First curve (Top to dot 1)
      const dot0Y = cards[0].offsetTop + cards[0].offsetHeight / 2;
      dDesktop += ` C 200 ${dot0Y * 0.2}, 100 ${dot0Y * 0.7}, 200 ${dot0Y}`;
      lastY = dot0Y;
      
      // Loop remaining dots
      for (let i = 1; i < cards.length; i++) {
        const dotY = cards[i].offsetTop + cards[i].offsetHeight / 2;
        const isEven = (i % 2 === 0);
        const controlX = isEven ? 100 : 300; // Alternate weave direction
        
        // S command seamlessly continues the smooth cubic curve to the next point
        dDesktop += ` S ${controlX} ${lastY + (dotY - lastY) * 0.7}, 200 ${dotY}`;
        lastY = dotY;
      }
    }
    // Final tail to the bottom
    dDesktop += ` S 200 ${lastY + (timelineHeight - lastY) * 0.6}, 200 ${timelineHeight}`;
    const dMobile = `M 1 0 L 1 ${timelineHeight}`;
    
    // Inject the generated paths directly into the DOM
    desktopPath.setAttribute('d', dDesktop);
    mobilePath.setAttribute('d', dMobile);

    // 2. Setup the Timeline using the actual rendered path
    const activePath = getComputedStyle(desktopPath).display !== 'none' ? desktopPath : mobilePath;
    const pathLength = activePath.getTotalLength();
    if (!pathLength || pathLength <= 0) return;
    
    const resolution = Math.max(1, pathLength / 500);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%", 
        end: "bottom 60%", 
        scrub: 1, 
      }
    });

    // Draw lines
    [desktopPath, mobilePath].forEach(p => {
      gsap.set(p, { strokeDasharray: pathLength, strokeDashoffset: pathLength, opacity: 0 });
      tl.to(p, { strokeDashoffset: 0, duration: 1, ease: "none" }, 0);
      tl.to(p, { opacity: 1, duration: 0.1, ease: "none" }, 0);
    });

    // 3. Perfect Sync for Dots & Cards
    cards.forEach((card) => {
      const cardY = card.offsetTop + (card.offsetHeight / 2);
      
      let targetLength = pathLength; 
      for (let l = 0; l <= pathLength; l += resolution) {
        // We can now accurately compare actual physical Y coordinates!
        if (activePath.getPointAtLength(l).y >= cardY) {
          targetLength = l;
          break;
        }
      }
      
      const progress = targetLength / pathLength;

      const dots = card.querySelectorAll('.gsap-center-dot');
      const content = card.querySelector('.gsap-card-content');
      
      // Setup initial stuck states (opacity 0) to ensure nothing is stuck half-visible
      tl.fromTo(dots, 
        { scale: 0.3, opacity: 0, boxShadow: 'none' },
        { scale: 1.2, opacity: 1, boxShadow: '0 0 20px var(--accent-cyan)', duration: 0.1, ease: "back.out(2)" },
        progress
      );
      
      if (content) {
        tl.fromTo(content,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.15, ease: "power2.out" },
          progress
        );
      }
    });

  }, { scope: containerRef });

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

            {/* Desktop Curved Spine (Completely Dynamic Pixel-Based) */}
            <svg className="gsap-desktop-svg hidden md:block absolute inset-0 w-full h-full overflow-visible">
              <path 
                className="gsap-desktop-path"
                // No d attribute here! Injected perfectly by GSAP above
                stroke="url(#spine-grad)" 
                strokeWidth="2" 
                fill="none" 
              />
            </svg>

            {/* Mobile Straight Spine */}
            <svg className="gsap-mobile-svg block md:hidden absolute inset-0 w-full h-full overflow-visible">
              <path 
                className="gsap-mobile-path"
                // No d attribute here! Injected perfectly by GSAP above
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
                  className={`gsap-step-card relative flex flex-col md:flex-row items-start md:items-center w-full ${!isEven ? 'md:flex-row-reverse' : ''}`}
                >
                  
                  {/* Mobile Node Indicator */}
                  <div className="md:hidden absolute left-[36px] top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center z-20">
                    <div className="gsap-center-dot w-3.5 h-3.5 rounded-full bg-bg-main border-2 border-accent-cyan opacity-0" />
                  </div>
                  
                  {/* Glass Card Half */}
                  <div className={`gsap-card-content w-full md:w-1/2 pl-[72px] md:pl-0 ${isEven ? 'md:pr-16 lg:pr-24' : 'md:pl-16 lg:pl-24'} opacity-0`}>
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
                  <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center z-20">
                    <div className="gsap-center-dot w-4 h-4 rounded-full bg-bg-main border-2 border-accent-cyan opacity-0" />
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
