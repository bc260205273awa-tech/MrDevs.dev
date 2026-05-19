"use client";
import { useEffect, useRef } from "react";
import { Code2, Smartphone, Cpu, Palette, MessageSquare, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Service {
  num: string; icon: LucideIcon; title: string;
  description: string; tags: string[]; accent: string;
}

const SERVICES: Service[] = [
  { num: "01", icon: Code2, title: "Web Development",
    description: "From landing pages to full-stack web apps — fast, SEO-optimised, and visually outstanding websites using Next.js, React, and modern frameworks.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"], accent: "#00b4d8" },
  { num: "02", icon: Smartphone, title: "App Development",
    description: "Cross-platform mobile applications for iOS and Android using React Native — near-native performance and beautiful UX your users will love.",
    tags: ["React Native", "iOS", "Android", "Expo"], accent: "#00d4aa" },
  { num: "03", icon: Cpu, title: "Hospital & Software Systems",
    description: "Custom hospital management, appointment & patient systems, SaaS platforms, and scalable backend solutions tailored to your business needs.",
    tags: ["Node.js", "APIs", "SaaS", "Databases"], accent: "#00b4d8" },
  { num: "04", icon: MessageSquare, title: "WhatsApp & Automation",
    description: "WhatsApp communication systems and business automation that keep you connected with your customers without lifting a finger.",
    tags: ["WhatsApp API", "Automation", "CRM", "Bots"], accent: "#00d4aa" },
  { num: "05", icon: MapPin, title: "Google Maps Optimization",
    description: "Get your business found locally. We optimise your Google Business Profile so nearby customers can discover you first.",
    tags: ["Google Business", "Local SEO", "Maps", "Reviews"], accent: "#00b4d8" },
  { num: "06", icon: Palette, title: "Design & Branding",
    description: "Brand identity, UI/UX, social media graphics, and marketing collateral crafted to make your business instantly recognisable.",
    tags: ["Branding", "UI/UX", "Figma", "Social Media"], accent: "#00d4aa" },
];

function ServiceCard({ service, delay }: { service: Service; delay: number }) {
  const Icon = service.icon;
  const ref  = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="reveal rounded-[10px] p-7 cursor-default group bg-[#112240] border border-[rgba(0,180,216,0.15)] hover:border-[rgba(0,180,216,0.6)] hover:shadow-[0_8px_32px_rgba(0,180,216,0.1)] transition-all duration-300"
      style={{ transitionDelay: `${delay}ms` }}>
      <span className="absolute top-5 right-6 font-syne font-black text-[4rem] leading-none select-none pointer-events-none text-[#00b4d8] opacity-30">
        {service.num}
      </span>
      <div className="w-11 h-11 rounded-full flex items-center justify-center mb-6 transition-all duration-300 bg-[rgba(0,180,216,0.12)]">
        <Icon size={18} className="text-[#00b4d8]" strokeWidth={1.75} />
      </div>
      <h3 className="font-syne font-bold text-[1.1rem] text-white mb-3 leading-snug">{service.title}</h3>
      <p className="font-manrope text-[rgba(255,255,255,0.6)] text-sm leading-relaxed mb-6">{service.description}</p>
      <div className="flex flex-wrap gap-2">
        {service.tags.map(tag => (
          <span key={tag} className="text-[10px] font-manrope font-semibold px-2.5 py-1 rounded-full tracking-wide bg-[rgba(0,180,216,0.1)] border border-[rgba(0,180,216,0.25)] text-[#00b4d8]">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Services() {
  const headerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = headerRef.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <section id="services" className="py-28 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(0,180,216,0.04) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="max-w-6xl mx-auto px-6">
        <div ref={headerRef} className="reveal flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="section-label mb-4">What We Do</p>
            <h2 className="font-syne font-bold text-4xl md:text-[2.8rem] leading-[1.1] tracking-tight text-white">
              Services Built for<br /><span className="bg-gradient-to-r from-[#00b4d8] to-[#00d4aa] bg-clip-text text-transparent">Modern Businesses</span>
            </h2>
          </div>
          <p className="font-manrope text-[#8892a4] max-w-xs leading-relaxed text-sm">
            Everything you need to build and scale your digital presence — under one roof.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.num} service={service} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}