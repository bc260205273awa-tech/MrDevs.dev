"use client";

import { useRef } from "react";
import { Code2, Smartphone, Shield, Zap, MapPin, Palette, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ServiceItem {
  icon: LucideIcon;
  title: string;
  href: string;
}

interface Step {
  num: string;
  title: string;
  outcome: string;
  services: ServiceItem[];
}

const STEPS: Step[] = [
  {
    num: "01",
    title: "The Foundation",
    outcome: "Launch high-performance frontends that establish instant brand authority and turn traffic into leads.",
    services: [
      {
        icon: Code2,
        title: "Web development",
        href: "/services/web-development",
      },
      {
        icon: Smartphone,
        title: "App development",
        href: "/services/app-development",
      },
    ],
  },
  {
    num: "02",
    title: "The Core",
    outcome: "Eliminate manual errors and scale operations with robust custom ERPs and database systems built for zero downtime.",
    services: [
      {
        icon: Shield,
        title: "Hospital & software systems",
        href: "/services/hospital-software-systems",
      },
    ],
  },
  {
    num: "03",
    title: "The Engine",
    outcome: "Maximize local search rankings and automate customer acquisition with smart API integration and visual styling.",
    services: [
      {
        icon: Zap,
        title: "WhatsApp & automation",
        href: "/services/whatsapp-automation",
      },
      {
        icon: MapPin,
        title: "Google Maps optimization",
        href: "/services/maps-optimization",
      },
      {
        icon: Palette,
        title: "Design & branding",
        href: "/services/design-branding",
      },
    ],
  },
];

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  useScrollReveal(containerRef);

  return (
    <section id="services" ref={containerRef} className="py-24 md:py-32 bg-bg-main font-sans overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center mb-16 md:mb-24 scroll-reveal">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_8px_rgba(0,212,255,0.8)]"></span>
            <span className="text-[11px] font-bold text-accent-cyan tracking-[0.2em] uppercase select-none">
              3-Step Growth Plan
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text-heading tracking-tighter max-w-3xl text-center leading-[1.05]">
            How We Scale Your Business
          </h2>
        </div>

        {/* Stacked Feature Blocks */}
        <div className="flex flex-col gap-8 md:gap-12 relative z-10">
          {STEPS.map((step, idx) => (
            <div
              key={step.num}
              className="scroll-reveal group relative bg-white/5 backdrop-blur-xl border border-white/5 border-t-white/10 rounded-3xl p-6 sm:p-8 lg:p-12 hover:border-white/10 hover:bg-white/[0.07] transition-all duration-500 overflow-hidden"
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              {/* Subtle background glow on hover */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-accent-primary/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Internal Split (Left: Content, Right: Command Palette Links) */}
              <div className="relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-24">
                
                {/* Left Side: Number, Title, Outcome */}
                <div className="lg:w-5/12 flex flex-col justify-center">
                  <div className="text-[3.5rem] sm:text-[5rem] lg:text-[7rem] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-accent-cyan/20 to-transparent leading-none mb-2 sm:mb-4 select-none pointer-events-none group-hover:from-accent-cyan/30 transition-all duration-500">
                    {step.num}
                  </div>
                  <h3 className="font-sans font-semibold text-2xl sm:text-3xl lg:text-4xl text-text-heading mb-3 sm:mb-4 tracking-tight group-hover:text-accent-cyan transition-colors duration-500">
                    {step.title}
                  </h3>
                  <p className="font-sans text-text-body text-sm sm:text-[16px] leading-relaxed">
                    {step.outcome}
                  </p>
                </div>

                {/* Right Side: Command Palette Service Links */}
                <div className="lg:w-7/12 flex flex-col gap-3 justify-center mt-2 lg:mt-0">
                  <div className="text-[10px] font-bold text-accent-cyan/70 tracking-[0.2em] uppercase select-none mb-2">
                    Available Services
                  </div>
                  
                  {step.services.map((service, sIdx) => {
                    const Icon = service.icon;
                    return (
                      <a
                        key={sIdx}
                        href={service.href}
                        className="group/link flex items-center justify-between w-full p-3.5 sm:p-4 lg:p-5 min-h-[44px] bg-white/[0.02] border border-white/5 hover:border-accent-primary/40 hover:bg-accent-primary/5 rounded-2xl transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center group-hover/link:bg-accent-primary/10 transition-colors shrink-0">
                            <Icon size={16} className="text-text-body group-hover/link:text-accent-cyan transition-colors sm:w-[18px] sm:h-[18px]" />
                          </div>
                          <span className="font-semibold text-sm sm:text-[15px] lg:text-[17px] text-text-heading group-hover/link:text-accent-cyan transition-colors">
                            {service.title}
                          </span>
                        </div>
                        <ArrowRight size={18} className="text-text-body/50 group-hover/link:text-accent-cyan group-hover/link:translate-x-1 transition-all shrink-0 sm:w-[20px] sm:h-[20px]" />
                      </a>
                    );
                  })}
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Section Divider */}
        <div className="section-divider mt-32 opacity-50" />
      </div>
    </section>
  );
}
