"use client";

import { useRef, useEffect } from "react";
import { UserCheck, ShieldCheck, Database, Code, Terminal, Cpu, Palette, Rocket, Server } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { use3DTilt } from "@/hooks/use3DTilt";

export default function WhyMrDevs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  
  useScrollReveal(containerRef);
  use3DTilt(containerRef, ".tilt-card", 15, 1000);

  // Dynamic Spotlight Effect
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const handleMouseMove = (e: MouseEvent) => {
      const cards = grid.querySelectorAll('.spotlight-card');
      for (const card of Array.from(cards)) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
        (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
      }
    };

    grid.addEventListener('mousemove', handleMouseMove);
    return () => grid.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const PILLARS = [
    {
      icon: UserCheck,
      title: "Direct Founder Access",
      description: "Speak directly to the developer building your system. No account managers or sales representatives. You get direct access and 5x faster iteration cycles.",
      gridClass: "lg:col-span-2 lg:row-span-2 min-h-[350px] lg:min-h-[500px]",
      iconSize: 140,
      visual: () => (
        <div className="absolute top-12 left-6 right-6 sm:left-12 sm:right-12 flex flex-col gap-4 pointer-events-none z-10 opacity-90">
          <div className="self-start bg-white/5 backdrop-blur-xl rounded-2xl rounded-tl-sm px-4 py-3 border border-white/10 max-w-[85%] sm:max-w-[70%] shadow-xl transform hover:scale-[1.02] transition-transform">
            <p className="text-[13px] sm:text-sm text-text-heading font-medium">Hey! Can we launch the new feature tomorrow?</p>
          </div>
          <div className="self-end bg-accent-primary/10 backdrop-blur-xl rounded-2xl rounded-tr-sm px-4 py-3 border border-accent-primary/30 max-w-[85%] sm:max-w-[70%] shadow-[0_4px_20px_rgba(47,168,255,0.15)] flex flex-col gap-1 transform hover:scale-[1.02] transition-transform">
            <p className="text-[13px] sm:text-sm text-white font-medium">Already done. It's live on your link right now! ⚡</p>
            <span className="text-[10px] text-accent-cyan/70 self-end">Just now</span>
          </div>
        </div>
      )
    },
    {
      icon: ShieldCheck,
      title: "Single-Point Accountability",
      description: "One person responsible for your design, databases, code, and deployment. No hand-offs, no communication gaps, and 100% project ownership.",
      gridClass: "lg:col-span-1 lg:row-span-1 min-h-[260px] lg:min-h-[300px]",
      iconSize: 90,
      visual: () => (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-32 pointer-events-none z-10 opacity-80">
          {/* Central Node */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-accent-primary/10 border border-accent-primary/50 flex items-center justify-center shadow-[0_0_15px_rgba(47,168,255,0.3)] z-20">
            <div className="w-2 h-2 rounded-full bg-accent-cyan animate-ping absolute"></div>
            <UserCheck size={20} className="text-accent-cyan relative z-10" />
          </div>
          {/* Lines */}
          <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 100 100">
            <path d="M50 50 L20 20 M50 50 L80 20 M50 50 L50 85" stroke="rgba(47,168,255,0.3)" strokeWidth="1.5" strokeDasharray="4 4" className="animate-[spin_20s_linear_infinite]" style={{ transformOrigin: '50% 50%' }} />
          </svg>
          {/* Child Nodes */}
          <div className="absolute top-[10%] left-[10%] w-8 h-8 rounded-full bg-bg-main border border-white/10 flex items-center justify-center z-10"><Palette size={14} className="text-text-body"/></div>
          <div className="absolute top-[10%] right-[10%] w-8 h-8 rounded-full bg-bg-main border border-white/10 flex items-center justify-center z-10"><Code size={14} className="text-text-body"/></div>
          <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-bg-main border border-white/10 flex items-center justify-center z-10"><Rocket size={14} className="text-text-body"/></div>
        </div>
      )
    },
    {
      icon: BuiltAtScale,
      title: "Proven Operational Scale",
      description: "We build deep operational software, not template websites. Engineered KhanHub, a 16-department healthcare ERP running 24/7 for 50,000+ people.",
      gridClass: "lg:col-span-1 lg:row-span-1 min-h-[260px] lg:min-h-[300px]",
      iconSize: 90,
      visual: () => (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col gap-2.5 pointer-events-none z-10 opacity-90 perspective-[800px]">
          {[1,2,3].map((i) => (
             <div key={i} className="w-32 h-7 rounded-lg border border-accent-cyan/30 bg-gradient-to-r from-accent-cyan/5 via-accent-cyan/10 to-accent-cyan/5 flex items-center px-4 relative overflow-hidden transform rotateX-[20deg] shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
                <div className={`w-1.5 h-1.5 rounded-full ${i === 2 ? 'bg-accent-primary animate-pulse' : 'bg-accent-cyan'}`}></div>
                <div className="ml-3 h-1 w-12 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-cyan/50 w-full animate-shimmer" style={{ animationDuration: `${2 + i*0.5}s` }}></div>
                </div>
             </div>
          ))}
        </div>
      )
    },
  ];

  function BuiltAtScale(props: any) {
    return <Database {...props} />;
  }

  return (
    <section
      id="why-us"
      ref={containerRef}
      className="py-24 md:py-32 bg-bg-main font-sans border-t border-accent-primary/5 overflow-hidden"
    >
      <style dangerouslySetInnerHTML={{__html: `
        .spotlight-card {
          position: relative;
        }
        .spotlight-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(
            600px circle at var(--mouse-x) var(--mouse-y),
            rgba(47, 168, 255, 0.08),
            transparent 40%
          );
          z-index: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.5s;
        }
        .spotlight-card::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: radial-gradient(
            400px circle at var(--mouse-x) var(--mouse-y),
            rgba(47, 168, 255, 0.4),
            transparent 40%
          );
          z-index: 1;
          pointer-events: none;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.5s;
        }
        .spotlight-card:hover::before,
        .spotlight-card:hover::after {
          opacity: 1;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-shimmer {
          animation: shimmer infinite linear;
        }
      `}} />

      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col mb-16 scroll-reveal">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_8px_rgba(0,212,255,0.8)]"></span>
            <span className="text-[11px] font-bold text-accent-cyan tracking-[0.2em] uppercase select-none">
              Why Us
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text-heading tracking-tighter max-w-3xl leading-[1.05]">
            Why hire MrDevs over the other{" "}
            <span className="text-accent-primary" style={{ textShadow: '0 0 20px rgba(47,168,255,0.3)' }}>
              10 agencies?
            </span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-6 relative group/grid">
          {PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={index}
                className={`tilt-card spotlight-card scroll-reveal group relative bg-white/5 backdrop-blur-xl border border-white/5 border-t-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-end overflow-hidden ${pillar.gridClass}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Custom Visual for the Card */}
                {pillar.visual && pillar.visual()}

                {/* Massive Watermark Icon (Faded in background) */}
                <div className="absolute top-8 right-8 text-accent-primary opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 group-hover:-rotate-3 transition-all duration-700 pointer-events-none z-0">
                  <Icon size={pillar.iconSize} strokeWidth={1} />
                </div>

                {/* Content anchored to bottom */}
                <div className="relative z-20 mt-auto max-w-md pt-32 lg:pt-0">
                  <h3 className="font-sans font-semibold text-2xl lg:text-3xl text-text-heading mb-3 tracking-tight group-hover:text-white transition-colors duration-300">
                    {pillar.title}
                  </h3>
                  <p className="font-sans text-text-body text-[15px] leading-relaxed group-hover:text-text-heading transition-colors duration-300">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Divider */}
        <div className="section-divider mt-32 opacity-50" />
      </div>
    </section>
  );
}
