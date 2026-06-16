"use client";

import { Code2, Smartphone, Shield, Zap, MapPin, Palette } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  isPrimary?: boolean;
}

const SERVICES: Service[] = [
  {
    icon: Code2,
    title: "Web development",
    description: "Fast, SEO-optimized, and premium websites built with Next.js and Tailwind CSS.",
    href: "/services/web-development",
    isPrimary: true,
  },
  {
    icon: Smartphone,
    title: "App development",
    description: "Beautiful iOS and Android apps powered by React Native and Expo.",
    href: "/services/app-development",
    isPrimary: true,
  },
  {
    icon: Shield,
    title: "Hospital & software systems",
    description: "Custom clinic, hospital, and enterprise software systems designed for scale.",
    href: "/services/hospital-software-systems",
  },
  {
    icon: Zap,
    title: "WhatsApp & automation",
    description: "Automate customer support and notifications with custom WhatsApp API integrations.",
    href: "/services/whatsapp-automation",
  },
  {
    icon: MapPin,
    title: "Google Maps optimization",
    description: "Improve your local search rankings and drive foot traffic to your business.",
    href: "/services/maps-optimization",
  },
  {
    icon: Palette,
    title: "Design & branding",
    description: "Premium identity design and visual interfaces built around your company values.",
    href: "/services/design-branding",
  },
];

function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;
  return (
    <a
      href={service.href}
      className={`group relative bg-[#0f1729] border border-[rgba(133,183,235,0.15)] rounded-xl p-5 hover:border-[rgba(133,183,235,0.3)] hover:-translate-y-1 active:scale-[0.97] transition-all duration-200 cursor-pointer flex flex-col justify-between ${
        service.isPrimary ? "md:col-span-1 border-[rgba(133,183,235,0.22)]" : ""
      }`}
    >
      <div>
        {/* Icon */}
        <div className="w-10 h-10 rounded-lg bg-[#378ADD]/10 flex items-center justify-center mb-4 group-hover:bg-[#378ADD]/20 transition-colors duration-200">
          <Icon size={18} className="text-[#378ADD]" strokeWidth={1.5} />
        </div>

        {/* Content */}
        <h3 className="font-sans font-medium text-[13px] text-[#f1efe8] mb-1.5 flex items-center gap-2">
          {service.title}
          {service.isPrimary && (
            <span className="text-[9px] font-medium text-[#378ADD] tracking-wider uppercase bg-[#378ADD]/10 px-1.5 py-0.5 rounded">
              primary
            </span>
          )}
        </h3>
        <p className="font-sans text-[#888780] text-xs leading-relaxed max-w-sm">
          {service.description}
        </p>
      </div>
    </a>
  );
}

export default function Services() {
  return (
    <section id="services" className="py-20 bg-[#0a0f1a] font-sans">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center mb-12 text-center">
          <span className="text-[10px] font-medium text-[#888780] tracking-[0.15em] uppercase mb-3 select-none">
            Tap to explore
          </span>
          <h2 className="text-2xl md:text-3xl font-medium text-[#f1efe8] tracking-tight">
            Services built for growth
          </h2>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SERVICES.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>

        {/* Section Divider */}
        <div className="section-divider mt-24" />
      </div>
    </section>
  );
}
