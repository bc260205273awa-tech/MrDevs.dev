"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const VALUE_PROPS = [
  { icon: "⚡", label: "Fast Delivery" },
  { icon: "🎯", label: "Local & Personal" },
  { icon: "🔒", label: "Quality Guaranteed" },
];

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      const badge = ".gsap-badge";
      const headlines = ".gsap-headline";
      const subtext = ".gsap-subtext";
      const btns = ".gsap-btn";
      const stats = ".gsap-stat";
      const scrollIndicator = ".gsap-scroll";

      const tl = gsap.timeline();

      // STEP 2 — Hero badge/tag (0.2s offset)
      tl.fromTo(badge,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        0.2
      );

      // STEP 3 — Hero headline (0.1s after step 2 -> 0.3s)
      tl.fromTo(headlines,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.1 },
        0.3
      );

      // STEP 4 — Hero subtext (0.1s after step 3 -> 0.4s)
      tl.fromTo(subtext,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        0.4
      );

      // STEP 5 — CTA buttons (0.1s after step 4 -> 0.5s)
      tl.fromTo(btns,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.1 },
        0.5
      );

      // STEP 6 — Stats row (0.1s after step 5 -> 0.6s)
      tl.fromTo(stats,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.12 },
        0.6
      );

      // STEP 7 — Scroll indicator (0.2s after step 6 -> 0.8s)
      tl.fromTo(scrollIndicator,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power1.out" },
        0.8
      );

      // Looping scroll indicator
      tl.add(() => {
        gsap.to(scrollIndicator, {
          y: 8,
          duration: 0.8,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1
        });
      });

    }, containerRef); // scope to container

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#0a1628]"
      style={{ background: "radial-gradient(ellipse at 60% 50%, #112240 0%, #0a1628 70%)" }}>
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      <div className="glow-orb float-slow w-[700px] h-[500px] top-[-100px] left-[-200px]"
        style={{ background: "radial-gradient(circle, rgba(96,165,250,0.12) 0%, transparent 70%)" }} />
      <div className="glow-orb float-slower w-[500px] h-[500px] bottom-[-80px] right-[-100px]"
        style={{ background: "radial-gradient(circle, rgba(0,212,170,0.09) 0%, transparent 70%)" }} />
      <div className="absolute top-0 right-[20%] w-px h-full opacity-10 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #00b4d8 40%, transparent)" }} />

      <div className="relative max-w-6xl mx-auto px-6 pt-36 pb-24 w-full">

        <div className="gsap-badge opacity-0 inline-flex items-center gap-2.5 px-4 py-2 border border-[rgba(0,180,216,0.2)] rounded-full mb-10"
          style={{ background: "rgba(0,180,216,0.06)" }}>
          <span className="relative flex h-2 w-2">
            <span className="ping-slow absolute inline-flex h-full w-full rounded-full bg-[#00b4d8]" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00b4d8]" />
          </span>
          <span className="font-manrope text-[11px] font-semibold text-[#00b4d8] tracking-widest uppercase">
            Available for new projects
          </span>
        </div>

        <div className="mb-8 max-w-4xl">
          <h1 className="gsap-headline opacity-0 font-syne font-black text-[clamp(2.8rem,7vw,5.8rem)] leading-[1.0] tracking-tight text-white">
            We Build
          </h1>
          <h1 className="gsap-headline opacity-0 font-syne font-black text-[clamp(2.8rem,7vw,5.8rem)] leading-[1.0] tracking-tight">
            <span className="bg-gradient-to-r from-[#00b4d8] to-[#00d4aa] bg-clip-text text-transparent">Digital Products</span>
          </h1>
          <h1 className="gsap-headline opacity-0 font-syne font-black text-[clamp(2.8rem,7vw,5.8rem)] leading-[1.0] tracking-tight text-white">
            That Drive Results.
          </h1>
        </div>

        <p className="gsap-subtext opacity-0 font-manrope text-[rgba(255,255,255,0.65)] text-lg md:text-xl leading-relaxed max-w-xl mb-10">
          MrDevs is a full-service digital agency building premium websites,
          software, and mobile apps — crafted with modern tech for businesses
          that mean business.
        </p>

        <div className="flex flex-wrap gap-3 mb-20">
          <a href="#contact"
            className="gsap-btn opacity-0 group inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-manrope rounded-[6px] bg-[#00b4d8] text-[#0a1628] hover:bg-[#00d4aa] transition-colors">
            Start a Project
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"
              className="transition-transform duration-200 group-hover:translate-x-1">
              <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="https://wa.me/923218492868" target="_blank" rel="noopener noreferrer"
            className="gsap-btn opacity-0 inline-flex items-center gap-2.5 px-7 py-3.5 border font-manrope font-medium text-sm rounded-[6px] text-[#00b4d8] bg-transparent transition-all duration-300 hover:bg-[rgba(0,180,216,0.1)]"
            style={{ borderColor: "#00b4d8" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#00b4d8]">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp Us
          </a>
        </div>

        <div className="flex flex-wrap gap-4 pt-8 border-t" style={{ borderColor: "rgba(0,180,216,0.12)" }}>
          {VALUE_PROPS.map(({ icon, label }) => (
            <div key={label} className="gsap-stat opacity-0 flex items-center gap-2.5 px-4 py-2.5 rounded-[6px] border"
              style={{ borderColor: "rgba(0,180,216,0.15)", background: "rgba(0,180,216,0.05)" }}>
              <span className="text-base leading-none">{icon}</span>
              <span className="font-manrope text-xs font-semibold text-[rgba(255,255,255,0.5)] tracking-wide uppercase">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="gsap-scroll opacity-0 absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
        <span className="font-manrope text-[10px] text-[#8892a4] tracking-[0.2em] uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-[#8892a4] to-transparent" />
      </div>
    </section>
  );
}