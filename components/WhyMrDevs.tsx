"use client";

import { useRef, useEffect } from "react";
import { UserCheck, ShieldCheck, Database, Code, Terminal, Cpu } from "lucide-react";
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
      isLarge: true,
    },
    {
      icon: ShieldCheck,
      title: "Single-Point Accountability",
      description: "One person responsible for your design, databases, code, and deployment. No hand-offs, no communication gaps, and 100% project ownership.",
      gridClass: "lg:col-span-1 lg:row-span-1 min-h-[260px] lg:min-h-[300px]",
      iconSize: 90,
    },
    {
      icon: BuiltAtScale,
      title: "Proven Operational Scale",
      description: "We build deep operational software, not template websites. Engineered KhanHub, a 16-department healthcare ERP running 24/7 for 50,000+ people.",
      gridClass: "lg:col-span-1 lg:row-span-1 min-h-[260px] lg:min-h-[300px]",
      iconSize: 90,
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
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(-10deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(15deg); }
        }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 6s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 5s ease-in-out infinite; }
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
                {/* Floating Tech Symbols (Only on the large card) */}
                {pillar.isLarge && (
                  <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
                    <Code size={40} className="absolute top-[20%] left-[10%] text-accent-primary animate-float-slow" strokeWidth={1} />
                    <Terminal size={50} className="absolute top-[40%] right-[30%] text-white animate-float-medium" strokeWidth={1} />
                    <Cpu size={30} className="absolute bottom-[30%] left-[25%] text-accent-cyan animate-float-fast" strokeWidth={1} />
                  </div>
                )}

                {/* Massive Watermark Icon */}
                <div className="absolute top-8 right-8 text-accent-primary opacity-[0.05] group-hover:opacity-[0.15] group-hover:scale-110 group-hover:-rotate-3 transition-all duration-700 pointer-events-none z-10">
                  <Icon size={pillar.iconSize} strokeWidth={1} />
                </div>

                {/* Content anchored to bottom */}
                <div className="relative z-20 mt-auto max-w-md">
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
