"use client";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Services",     href: "#services" },
  { label: "Technologies", href: "#technologies" },
  { label: "Contact",      href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
      scrolled ? "py-3 bg-[#0a1628]/90 backdrop-blur-2xl border-b border-[rgba(0,180,216,0.1)]" : "py-6 bg-transparent"
    }`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

        <a href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 flex items-center justify-center rounded-[5px] overflow-hidden bg-transparent">
            <span className="font-syne font-black text-white text-sm leading-none z-10">M</span>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)" }} />
          </div>
          <span className="font-syne font-bold text-white tracking-tight text-[15px]">
            MrDevs
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href}
              className="font-manrope text-sm text-[rgba(255,255,255,0.6)] hover:text-[#FFFFFF] transition-colors duration-200 tracking-wide">
              {label}
            </a>
          ))}
        </nav>

        <a href="#contact"
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-manrope rounded-[5px] bg-[#00b4d8] text-[#0a1628] hover:bg-[#00d4aa] transition-colors" style={{ boxShadow: "0 0 20px rgba(0,180,216,0.3)" }}>
          Let&apos;s Talk
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        <button onClick={() => setOpen(v => !v)} className="md:hidden flex flex-col gap-[5px] p-2" aria-label="Toggle navigation">
          <span className={`block h-px w-6 bg-white origin-center transition-transform duration-300 ${open ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`block h-px w-6 bg-white transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`block h-px w-6 bg-white origin-center transition-transform duration-300 ${open ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="bg-[#0d1b36] border-t border-[rgba(0,180,216,0.1)] px-6 py-5 flex flex-col gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href}
              className="font-manrope text-[15px] text-[#8892a4] hover:text-white py-3 border-b border-white/5 last:border-0 transition-colors duration-200"
              onClick={() => setOpen(false)}>{label}</a>
          ))}
          <a href="#contact"
            className="mt-3 py-3.5 text-center text-sm font-manrope font-semibold rounded-[5px] bg-[#00b4d8] text-[#0a1628] hover:bg-[#00d4aa] transition-colors shadow-[0_0_20px_rgba(0,180,216,0.3)]"
            onClick={() => setOpen(false)}>
            Let&apos;s Talk
          </a>
        </div>
      </div>
    </header>
  );
}