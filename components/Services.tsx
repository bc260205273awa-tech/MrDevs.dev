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
    <section id="services" ref={containerRef} className="py-20 bg-[#0a0f1a] font-sans overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center mb-12 text-center scroll-reveal">
          <span className="text-[10px] font-medium text-[#888780] tracking-[0.15em] uppercase mb-3 select-none">
            3-Step Growth Plan
          </span>
          <h2 className="text-2xl md:text-3xl font-medium text-[#f1efe8] tracking-tight">
            How We Scale Your Business
          </h2>
        </div>

        {/* 3-Step Flow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, idx) => (
            <div
              key={step.num}
              className="scroll-reveal group relative bg-[#0f1729] border border-[rgba(133,183,235,0.15)] rounded-xl p-6 hover:border-[rgba(133,183,235,0.3)] duration-200 flex flex-col justify-between"
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div>
                {/* Step Number Badge */}
                <div className="inline-block px-2.5 py-0.5 rounded bg-[#378ADD]/10 border border-[#378ADD]/15 mb-4 select-none">
                  <span className="text-[10px] font-mono font-medium text-[#378ADD] tracking-wider">
                    STEP {step.num}
                  </span>
                </div>

                {/* Step Title */}
                <h3 className="font-sans font-medium text-[15px] text-[#f1efe8] mb-3">
                  {step.title}
                </h3>

                {/* Step Outcome */}
                <p className="font-sans text-[#888780] text-xs leading-relaxed">
                  {step.outcome}
                </p>
              </div>

              {/* Sub-services links */}
              <div className="flex flex-col gap-2 mt-6">
                <span className="text-[9px] font-medium text-[#5F5E5A] tracking-wider uppercase select-none mb-1">
                  Available Services:
                </span>
                {step.services.map((service, sIdx) => {
                  const Icon = service.icon;
                  return (
                    <a
                      key={sIdx}
                      href={service.href}
                      className="group/btn inline-flex items-center justify-between w-full px-3 py-2 bg-[#0a0f1a]/85 border border-[rgba(133,183,235,0.06)] hover:border-[#378ADD]/45 hover:bg-[#378ADD]/5 rounded-lg transition-all duration-200"
                    >
                      <div className="flex items-center gap-2">
                        <Icon size={12} className="text-[#378ADD]" />
                        <span className="font-sans text-[11px] text-[#888780] group-hover/btn:text-[#f1efe8] transition-colors">
                          {service.title.toLowerCase()}
                        </span>
                      </div>
                      <ArrowRight size={10} className="text-[#5F5E5A] group-hover/btn:text-[#378ADD] group-hover/btn:translate-x-0.5 transition-all" />
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Section Divider */}
        <div className="section-divider mt-24" />
      </div>
    </section>
  );
}
