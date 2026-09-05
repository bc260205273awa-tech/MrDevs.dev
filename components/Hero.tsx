"use client";

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

import HeroGlasses3D from "./HeroGlasses3D";
import HeroParticles from "./HeroParticles";
import { use3DTilt } from "@/hooks/use3DTilt";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  use3DTilt(containerRef, ".tilt-hero", 18, 700);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from(headlineRef.current, {
      y: 24,
      duration: 0.8,
      ease: 'power3.out'
    })
    .from(subtextRef.current, {
      y: 16,
      opacity: 0.2,
      duration: 0.7,
      ease: 'power3.out'
    }, "-=0.5")
    .from(ctaRef.current, {
      y: 16,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out'
    }, "-=0.5");
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
      className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden font-sans bg-bg-main pt-32 sm:pt-36 lg:pt-28 pb-16"
    >
      {/* Interactive Cursor-Reactive Dust Particles */}
      <HeroParticles />

      {/* Main 2-Column Split Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center pt-4 sm:pt-8 lg:pt-12">
        
        {/* Right Column: 3D Interactive Agency Glasses Logo (Shown first on mobile) */}
        <div className="order-1 lg:order-2 lg:col-span-5 flex items-center justify-center w-full relative z-10 py-4 lg:py-0">
          <HeroGlasses3D />
        </div>

        {/* Left Column: Typography & CTAs (Shown below the logo on mobile) */}
        <div ref={contentRef} className="order-2 lg:order-1 lg:col-span-7 flex flex-col items-start text-left gap-6 z-20">
          
          {/* Glass pill availability badge with pulsing dot */}
          <div className="tilt-hero inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-xl cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75 animate-ping-slow" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-cyan" />
            </span>
            <span className="text-xs font-medium text-text-heading tracking-wider uppercase">
              Available for new projects
            </span>
          </div>

          {/* Main Headline (Clean Human Copy without AI em-dash) */}
          <h1 
            ref={headlineRef}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-[4.2rem] xl:text-[4.75rem] font-bold text-text-heading leading-[1.08] tracking-tighter max-w-2xl"
          >
            Everything your business needs to grow,{" "}
            <span className="text-accent-primary" style={{ textShadow: '0 0 24px rgba(47,168,255,0.35)' }}>
              all under one roof.
            </span>
          </h1>

          {/* Subhead */}
          <p 
            ref={subtextRef}
            className="text-base sm:text-lg text-text-body max-w-xl leading-relaxed mt-1"
          >
            A technical partner that designs and engineers high-converting web systems, mobile apps, and automated workflows built directly to drive your revenue.
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-4 w-full sm:w-auto">
            <a
              href="#contact"
              onClick={(e) => handleScrollTo(e, "contact")}
              className="tilt-hero w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 min-h-[48px] bg-accent-primary text-[#050B14] font-semibold text-[15px] rounded shadow-glow hover:bg-accent-cyan hover:shadow-glow-cyan hover:-translate-y-0.5 transition-all duration-300"
            >
              Let&apos;s Talk
            </a>
            <a
              href="#work"
              onClick={(e) => handleScrollTo(e, "work")}
              className="group inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-2 text-text-heading font-medium text-[15px] hover:text-accent-primary transition-colors duration-300"
            >
              See the work 
              <span className="group-hover:translate-x-1 transition-transform duration-300">↗</span>
            </a>
          </div>

        </div>

      </div>
      
      {/* Scroll Hint */}
      <div className="hidden lg:flex absolute bottom-4 left-1/2 -translate-x-1/2 flex-col items-center gap-3 select-none pointer-events-none opacity-70 z-10">
        <span className="text-[10px] text-accent-primary tracking-[0.2em] uppercase font-bold" style={{ textShadow: '0 0 10px rgba(47,168,255,0.5)' }}>
          Scroll to explore
        </span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-accent-primary to-transparent" />
      </div>
    </section>
  );
}
