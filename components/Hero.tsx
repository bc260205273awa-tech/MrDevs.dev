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

    // 2. Scroll-triggered Pinning
    // [NEW] Pin the hero briefly on scroll before releasing into the next section
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=1000', // Pin for 1000px of scrolling
      pin: true,
      anticipatePin: 1,
    });

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
      {/* [NEW] Placeholder area for the frame-sequence/video background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40 border-b border-accent-primary/20">
        <div className="border border-dashed border-accent-primary/40 bg-bg-deep px-8 py-12 rounded-lg flex flex-col items-center gap-2">
          <span className="text-accent-primary text-sm tracking-widest uppercase font-bold">
            [ Cinematic Scroll Background ]
          </span>
          <span className="text-text-body text-xs">
            Placeholder for frame-sequence or looping video
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div ref={contentRef} className="relative z-10 max-w-3xl mx-auto px-6 flex flex-col items-center gap-8 -mt-16">
        
        {/* Main Headline */}
        <h1 
          ref={headlineRef}
          // [CHANGED] Updated headline to use text-heading and accent-primary
          className="text-4xl md:text-6xl font-bold text-text-heading leading-[1.15] tracking-tight max-w-2xl opacity-100"
        >
          Everything your business needs to grow —{" "}
          <span className="text-accent-primary" style={{ textShadow: '0 0 15px rgba(47,168,255,0.4)' }}>
            under one roof.
          </span>
        </h1>

        {/* Subhead */}
        <p 
          ref={subtextRef}
          // [CHANGED] Updated subtext to use text-body
          className="text-[17px] text-text-body max-w-[540px] leading-relaxed opacity-100"
        >
          A technical partner that designs and engineers high-converting web systems, mobile apps, and automated workflows built directly to drive your revenue.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto mt-4 opacity-100">
          <a
            href="#contact"
            onClick={(e) => handleScrollTo(e, "contact")}
            // [CHANGED] "Let's talk" CTA with electric blue glow (shadow-glow)
            className="inline-flex items-center justify-center px-8 py-3.5 bg-accent-primary text-[#050B14] font-semibold text-[15px] rounded-md shadow-glow hover:bg-accent-cyan hover:shadow-glow-cyan hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            Let's Talk
          </a>
          <a
            href="#work"
            onClick={(e) => handleScrollTo(e, "work")}
            // [CHANGED] Secondary CTA matching the dark navy/electric blue theme
            className="inline-flex items-center justify-center px-8 py-3.5 bg-transparent border border-accent-primary/30 text-text-heading font-medium text-[15px] rounded-md hover:border-accent-primary hover:bg-accent-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            See the work
          </a>
        </div>
      </div>
      
      {/* Scroll Hint */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 select-none pointer-events-none opacity-80 z-10">
        <span className="text-[10px] text-accent-primary tracking-[0.2em] uppercase font-bold" style={{ textShadow: '0 0 10px rgba(47,168,255,0.5)' }}>
          Scroll to explore
        </span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-accent-primary to-transparent"></div>
      </div>
    </section>
  );
}
