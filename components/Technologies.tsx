"use client";
import { useEffect, useRef } from "react";

const TECHNOLOGIES = [
  { name: "Next.js",      category: "Frontend",  icon: "▲", accent: "#00b4d8" },
  { name: "React",        category: "Frontend",  icon: "⚛", accent: "#00b4d8" },
  { name: "TypeScript",   category: "Language",  icon: "TS", accent: "#00b4d8" },
  { name: "Tailwind CSS", category: "Styling",   icon: "✦", accent: "#00d4aa" },
  { name: "Node.js",      category: "Backend",   icon: "⬡", accent: "#00d4aa" },
  { name: "PostgreSQL",   category: "Database",  icon: "◆", accent: "#00b4d8" },
  { name: "MongoDB",      category: "Database",  icon: "◉", accent: "#00b4d8" },
  { name: "React Native", category: "Mobile",    icon: "◍", accent: "#00d4aa" },
  { name: "Figma",        category: "Design",    icon: "◐", accent: "#00b4d8" },
  { name: "Docker",       category: "DevOps",    icon: "◇", accent: "#00d4aa" },
  { name: "AWS",          category: "Cloud",     icon: "☁", accent: "#00b4d8" },
  { name: "GraphQL",      category: "API",       icon: "◈", accent: "#00d4aa" },
  { name: "Prisma",       category: "ORM",       icon: "△", accent: "#00b4d8" },
  { name: "Firebase",     category: "Backend",   icon: "🔥", accent: "#00d4aa" },
  { name: "Redis",        category: "Cache",     icon: "◎", accent: "#00d4aa" },
  { name: "Expo",         category: "Mobile",    icon: "◌", accent: "#00b4d8" },
];

function TechCard({ tech, delay }: { tech: typeof TECHNOLOGIES[0]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="reveal group relative card-glow rounded-[8px] p-5 flex flex-col gap-3 cursor-default"
      style={{ transitionDelay: `${delay}ms` }}>
      <div className="w-9 h-9 rounded-[6px] flex items-center justify-center text-sm font-bold font-syne transition-all duration-300"
        style={{ background: `${tech.accent}12`, color: tech.accent }}>{tech.icon}</div>
      <p className="font-syne font-bold text-[13px] text-white leading-none">{tech.name}</p>
      <span className="font-manrope text-[10px] font-semibold tracking-widest uppercase"
        style={{ color: `${tech.accent}88` }}>{tech.category}</span>
      <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: tech.accent, boxShadow: `0 0 6px ${tech.accent}` }} />
    </div>
  );
}

export default function Technologies() {
  const headerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = headerRef.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <section id="technologies" className="py-28 relative">
      <hr className="hr-gradient max-w-6xl mx-auto mb-28" />
      <div className="max-w-6xl mx-auto px-6">
        <div ref={headerRef} className="reveal flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="section-label mb-4">Tech Stack</p>
            <h2 className="font-syne font-bold text-4xl md:text-[2.8rem] leading-[1.1] tracking-tight">
              Modern Technologies,<br /><span className="gradient-text">Real-World Results</span>
            </h2>
          </div>
          <p className="font-manrope text-[#8892a4] max-w-xs leading-relaxed text-sm">
            We work with the best tools in the industry to deliver fast, scalable, and maintainable solutions.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {TECHNOLOGIES.map((tech, i) => (
            <TechCard key={tech.name} tech={tech} delay={i * 50} />
          ))}
        </div>
        <p className="font-manrope text-[11px] text-[#4a5568] text-center mt-10 tracking-wide">
          And more tools selected per-project based on your specific needs
        </p>
      </div>
    </section>
  );
}