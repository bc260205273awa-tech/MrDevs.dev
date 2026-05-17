const ROW1_BASE = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "Tailwind CSS",
  "MongoDB",
  "PostgreSQL",
];

const ROW2_BASE = [
  "React Native",
  "Docker",
  "AWS",
  "Figma",
  "GraphQL",
  "Prisma",
  "Redis",
  "Expo",
];

// Duplicate for seamless infinite scroll
const ROW1 = [...ROW1_BASE, ...ROW1_BASE];
const ROW2 = [...ROW2_BASE, ...ROW2_BASE];

const TECH_SYMBOLS: Record<string, string> = {
  "Next.js": "▲",
  "React": "⚛",
  "TypeScript": "TS",
  "Node.js": "⬡",
  "Tailwind CSS": "✦",
  "MongoDB": "◉",
  "PostgreSQL": "◆",
  "React Native": "◍",
  "Docker": "◇",
  "AWS": "☁",
  "Figma": "◐",
  "GraphQL": "◈",
  "Prisma": "△",
  "Redis": "◉",
  "Expo": "◎",
};

function TechPill({ name }: { name: string }) {
  return (
    <div className="flex-shrink-0 inline-flex items-center gap-3 px-5 py-3 border border-white/7 rounded-full bg-white/[0.02] hover:border-[#00D4FF]/30 hover:bg-[#00D4FF]/5 transition-all duration-200 cursor-default group">
      <span className="font-mono text-[11px] text-[#00D4FF]/50 group-hover:text-[#00D4FF] transition-colors duration-200 w-4 text-center leading-none">
        {TECH_SYMBOLS[name] ?? "·"}
      </span>
      <span className="font-manrope text-sm font-medium text-[#888] group-hover:text-[#ccc] transition-colors duration-200 whitespace-nowrap">
        {name}
      </span>
    </div>
  );
}

export default function Technologies() {
  return (
    <section id="technologies" className="py-28 relative overflow-hidden">
      {/* Section header */}
      <div className="max-w-6xl mx-auto px-6 mb-14 text-center">
        <p className="font-manrope text-[11px] text-[#00D4FF] tracking-[0.2em] uppercase mb-4">
          Tech Stack
        </p>
        <h2 className="font-syne font-bold text-4xl md:text-[2.8rem] leading-[1.1] tracking-tight mb-4">
          Modern Technologies,
          <br />
          Real-World Results
        </h2>
        <p className="font-manrope text-[#555] max-w-sm mx-auto text-sm leading-relaxed">
          We work with the best tools in the industry to deliver fast, scalable,
          and maintainable solutions.
        </p>
      </div>

      {/* Marquee row 1 — left to right */}
      <div className="relative flex overflow-hidden mb-4">
        <div className="absolute left-0 inset-y-0 w-28 z-10 bg-gradient-to-r from-[#070707] to-transparent pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-28 z-10 bg-gradient-to-l from-[#070707] to-transparent pointer-events-none" />
        <div className="flex gap-3 animate-marquee">
          {ROW1.map((tech, i) => (
            <TechPill key={`r1-${i}`} name={tech} />
          ))}
        </div>
      </div>

      {/* Marquee row 2 — right to left */}
      <div className="relative flex overflow-hidden">
        <div className="absolute left-0 inset-y-0 w-28 z-10 bg-gradient-to-r from-[#070707] to-transparent pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-28 z-10 bg-gradient-to-l from-[#070707] to-transparent pointer-events-none" />
        <div className="flex gap-3 animate-marquee-reverse">
          {ROW2.map((tech, i) => (
            <TechPill key={`r2-${i}`} name={tech} />
          ))}
        </div>
      </div>
    </section>
  );
}
