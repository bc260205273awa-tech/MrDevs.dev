"use client";

export default function Hero() {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const navHeight = 80;
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden pt-24 font-sans bg-[#0a0f1a] text-center"
    >
      <div className="relative max-w-2xl mx-auto px-6 py-16 flex flex-col items-center gap-8">
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(93,202,165,0.1)] border border-[rgba(93,202,165,0.15)] shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#5DCAA5] opacity-75 animate-ping-slow" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5DCAA5] animate-pulse-slow" />
          </span>
          <span className="text-[11px] font-medium text-[#5DCAA5] tracking-[0.08em] uppercase">
            Available for new projects
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl md:text-5xl font-medium text-[#f1efe8] leading-[1.15] tracking-tight max-w-xl">
          Everything your business needs to grow —{" "}
          <span className="text-[#378ADD]">under one roof.</span>
        </h1>

        {/* Subhead */}
        <p className="text-[15px] text-[#888780] max-w-[480px] leading-relaxed">
          A technical partner that designs and engineers high-converting web systems, mobile apps, and automated workflows built directly to drive your revenue.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
          <a
            href="#contact"
            onClick={(e) => handleScrollTo(e, "contact")}
            className="inline-flex items-center justify-center px-6 py-3 bg-[#378ADD] text-[#042C53] font-medium text-sm rounded shadow hover:bg-[#378ADD]/90 hover:scale-[0.98] active:scale-[0.95] transition-all duration-200"
          >
            Book a Free Strategy Call
          </a>
          <a
            href="#work"
            onClick={(e) => handleScrollTo(e, "work")}
            className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-[rgba(133,183,235,0.3)] text-[#f1efe8] font-medium text-sm rounded hover:border-[rgba(133,183,235,0.5)] hover:bg-[#378ADD]/5 hover:scale-[0.98] active:scale-[0.95] transition-all duration-200"
          >
            See the work
          </a>
        </div>

        {/* Scroll Hint */}
        <div className="mt-8 flex flex-col items-center gap-1 select-none pointer-events-none">
          <span className="text-[11px] text-[#5F5E5A] tracking-[0.15em] uppercase font-medium">
            scroll to feel the build ↓
          </span>
        </div>
      </div>
    </section>
  );
}
