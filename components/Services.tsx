import { Code2, Smartphone, Cpu, Palette } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Service {
  num: string;
  icon: LucideIcon;
  title: string;
  description: string;
  tags: string[];
}

const SERVICES: Service[] = [
  {
    num: "01",
    icon: Code2,
    title: "Web Development",
    description:
      "From landing pages to full-stack web apps — we build fast, SEO-optimised, and visually outstanding websites using Next.js, React, and modern frameworks.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    num: "02",
    icon: Smartphone,
    title: "App Development",
    description:
      "Cross-platform mobile applications for iOS and Android using React Native — delivering near-native performance and beautiful UX your users will love.",
    tags: ["React Native", "iOS", "Android", "Expo"],
  },
  {
    num: "03",
    icon: Cpu,
    title: "Software Solutions",
    description:
      "Custom software tailored to your unique business needs — APIs, dashboards, SaaS platforms, and scalable backend systems that grow with you.",
    tags: ["Node.js", "APIs", "SaaS", "Databases"],
  },
  {
    num: "04",
    icon: Palette,
    title: "Graphic Design",
    description:
      "Brand identity, UI/UX design, social media graphics, and marketing collateral crafted to make your business instantly recognizable and impossible to ignore.",
    tags: ["Branding", "UI/UX", "Figma", "Social Media"],
  },
];

function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;
  return (
    <div className="group relative bg-[#070707] p-8 hover:bg-[#090909] transition-colors duration-300 cursor-default">
      {/* Hover border glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-[#00D4FF]/12" />

      {/* Big ghost number */}
      <span className="absolute top-5 right-7 font-syne font-black text-[4.5rem] leading-none text-white/[0.03] select-none pointer-events-none">
        {service.num}
      </span>

      {/* Icon */}
      <div className="w-10 h-10 rounded-[5px] bg-[#00D4FF]/8 flex items-center justify-center mb-6 group-hover:bg-[#00D4FF]/14 transition-colors duration-300">
        <Icon size={17} className="text-[#00D4FF]" strokeWidth={1.75} />
      </div>

      {/* Content */}
      <h3 className="font-syne font-bold text-[1.15rem] text-white mb-3 leading-snug">
        {service.title}
      </h3>
      <p className="font-manrope text-[#5a5a5a] text-sm leading-relaxed mb-6">
        {service.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {service.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-manrope font-medium px-2.5 py-1 border border-white/7 text-[#4a4a4a] rounded-full tracking-wide group-hover:border-white/10 group-hover:text-[#666] transition-all duration-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" className="py-28 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="font-manrope text-[11px] text-[#00D4FF] tracking-[0.2em] uppercase mb-4">
              What We Do
            </p>
            <h2 className="font-syne font-bold text-4xl md:text-[2.8rem] leading-[1.1] tracking-tight">
              Services Built for
              <br />
              Modern Businesses
            </h2>
          </div>
          <p className="font-manrope text-[#555] max-w-xs leading-relaxed text-sm">
            Everything you need to build and scale your digital presence —
            under one roof.
          </p>
        </div>

        {/* 2×2 grid with dividing lines */}
        <div className="grid grid-cols-1 md:grid-cols-2 border border-white/6 rounded-lg overflow-hidden divide-y md:divide-y-0 divide-white/6">
          <div className="md:border-r border-white/6 md:divide-y divide-white/6 flex flex-col">
            <ServiceCard service={SERVICES[0]} />
            <ServiceCard service={SERVICES[2]} />
          </div>
          <div className="md:divide-y divide-white/6 flex flex-col border-t md:border-t-0 border-white/6">
            <ServiceCard service={SERVICES[1]} />
            <ServiceCard service={SERVICES[3]} />
          </div>
        </div>
      </div>
    </section>
  );
}
