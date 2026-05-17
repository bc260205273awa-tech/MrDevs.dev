const STATS = [
  { value: "50+", label: "Projects Delivered" },
  { value: "30+", label: "Happy Clients" },
  { value: "3+", label: "Years of Excellence" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" />

      {/* Top radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-[#00D4FF] opacity-[0.04] blur-[160px] pointer-events-none" />

      {/* Bottom-right accent */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#0044FF] opacity-[0.04] blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 pt-36 pb-24 w-full">
        {/* Availability badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 border border-white/8 rounded-full bg-white/[0.03] backdrop-blur-sm mb-10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4FF] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00D4FF]" />
          </span>
          <span className="font-manrope text-[11px] font-medium text-[#888] tracking-widest uppercase">
            Available for new projects
          </span>
        </div>

        {/* Main headline */}
        <h1 className="font-syne font-bold text-[clamp(2.6rem,6.5vw,5.5rem)] leading-[1.02] tracking-tight mb-6 max-w-4xl">
          We Build Digital{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #00D4FF 0%, #0066FF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Products
          </span>
          <br />
          That Drive{" "}
          <span className="relative inline-block">
            Results
            {/* Underline accent */}
            <svg
              className="absolute -bottom-1 left-0 w-full"
              viewBox="0 0 100 8"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 6 Q25 2 50 5 Q75 8 100 4"
                stroke="#00D4FF"
                strokeWidth="1.5"
                strokeOpacity="0.45"
                strokeLinecap="round"
              />
            </svg>
          </span>
          .
        </h1>

        {/* Subtext */}
        <p className="font-manrope text-[#666] text-lg md:text-xl leading-relaxed max-w-lg mb-10">
          MrDevs is a full-service digital agency building premium websites,
          software, and mobile apps — crafted with modern tech for businesses
          that mean business.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-3 mb-24">
          <a
            href="#contact"
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#00D4FF] text-black font-manrope font-semibold text-sm rounded-[3px] hover:bg-white transition-all duration-200"
          >
            Start a Project
            <svg
              width="13"
              height="13"
              viewBox="0 0 14 14"
              fill="none"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              <path
                d="M1 7h12M7 1l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a
            href="#services"
            className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/10 text-[#F5F5F5] font-manrope font-medium text-sm rounded-[3px] hover:border-[#00D4FF]/40 hover:bg-[#00D4FF]/5 transition-all duration-200"
          >
            Our Services
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-10 sm:gap-16 pt-8 border-t border-white/5">
          {STATS.map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="font-syne font-bold text-[2rem] text-white leading-none">
                {value}
              </span>
              <span className="font-manrope text-[11px] text-[#555] tracking-wider uppercase mt-1">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-25 pointer-events-none">
        <span className="font-manrope text-[10px] text-[#666] tracking-[0.2em] uppercase">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-[#666] to-transparent" />
      </div>
    </section>
  );
}
