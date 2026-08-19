"use client";

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Initial reveal animation for headline, subtext, and CTA
    // The useGSAP hook automatically handles cleanup/revert for this timeline, 
    // ensuring no stray animations are left behind during Strict Mode double-mounts.
    const tl = gsap.timeline();
    
    tl.from(headlineRef.current, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.2
    })
    .from(subtextRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, "-=0.6")
    .from(ctaRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, "-=0.6");

    // [CHANGED] Removed the ScrollTrigger.create() pin here.
    // Pinning the root React node caused GSAP's pin-spacer to fight with React Strict Mode,
    // resulting in duplicated DOM elements (overlapping text) and a frozen scroll state.
    // We will reintroduce a pin on an *inner* wrapper when the cinematic background is built.

  }, { scope: containerRef });

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const navHeight = 80;
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      // [CHANGED] Updated to use locked design tokens: bg-main
      className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden font-sans bg-bg-main text-center"
    >
      {/* [CHANGED] Full-bleed background placeholder (edge-to-edge, z-index 0) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-bg-deep opacity-60">
        <span className="text-accent-primary/20 text-2xl tracking-[0.3em] uppercase font-bold select-none">
          [ Cinematic Scroll Sequence ]
        </span>
      </div>

      {/* Content Container */}
      <div ref={contentRef} className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center gap-6 -mt-12">
        
        {/* [NEW] Glass pill availability badge with pulsing dot */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-xl mb-4">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75 animate-ping-slow" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-cyan" />
          </span>
          <span className="text-xs font-medium text-text-heading tracking-wider uppercase">
            Available for new projects
          </span>
        </div>

        {/* Main Headline */}
        <h1 
          ref={headlineRef}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-text-heading leading-[1.08] sm:leading-[1.05] tracking-tighter max-w-4xl opacity-100 px-2 sm:px-0"
        >
          Everything your business needs to grow —{" "}
          <span className="text-accent-primary" style={{ textShadow: '0 0 20px rgba(47,168,255,0.3)' }}>
            under one roof.
          </span>
        </h1>

        {/* Subhead */}
        <p 
          ref={subtextRef}
          className="text-base sm:text-[17px] md:text-lg text-text-body max-w-lg leading-relaxed opacity-100 mt-2 px-2 sm:px-0"
        >
          A technical partner that designs and engineers high-converting web systems, mobile apps, and automated workflows built directly to drive your revenue.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mt-6 opacity-100 w-full sm:w-auto px-4 sm:px-0">
          <a
            href="#contact"
            onClick={(e) => handleScrollTo(e, "contact")}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 min-h-[44px] bg-accent-primary text-[#050B14] font-semibold text-[15px] rounded shadow-glow hover:bg-accent-cyan hover:shadow-glow-cyan hover:-translate-y-0.5 transition-all duration-300"
          >
            Let's Talk
          </a>
          <a
            href="#work"
            onClick={(e) => handleScrollTo(e, "work")}
            className="group inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 text-text-heading font-medium text-[15px] hover:text-accent-primary transition-colors duration-300"
          >
            See the work 
            <span className="group-hover:translate-x-1 transition-transform duration-300">↗</span>
          </a>
        </div>
      </div>
      
      {/* Scroll Hint */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 select-none pointer-events-none opacity-80 z-10">
        <span className="text-[10px] text-accent-primary tracking-[0.2em] uppercase font-bold" style={{ textShadow: '0 0 10px rgba(47,168,255,0.5)' }}>
          Scroll to explore
        </span>
        {/* [CHANGED] Taller scroll hint */}
        <div className="w-[1px] h-20 bg-gradient-to-b from-accent-primary to-transparent"></div>
      </div>
    </section>
  );
}
