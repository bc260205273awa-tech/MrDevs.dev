"use client";

import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Technologies", href: "#technologies" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "py-3 bg-[#070707]/85 backdrop-blur-2xl border-b border-white/5"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 bg-[#00D4FF] flex items-center justify-center rounded-[3px] group-hover:bg-white transition-colors duration-200">
            <span className="font-syne font-black text-black text-xs leading-none">
              M
            </span>
          </div>
          <span className="font-syne font-bold text-white tracking-tight text-[15px]">
            MrDevs
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="font-manrope text-sm text-[#666] hover:text-white transition-colors duration-200 tracking-wide"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="#contact"
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-manrope font-semibold bg-[#00D4FF] text-black rounded-[3px] hover:bg-white transition-colors duration-200"
        >
          Let&apos;s Talk
        </a>

        {/* Hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden flex flex-col gap-[5px] p-1.5 z-10"
          aria-label="Toggle navigation"
        >
          <span
            className={`block h-px w-6 bg-white origin-center transition-transform duration-300 ${
              open ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`block h-px w-6 bg-white transition-opacity duration-300 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-px w-6 bg-white origin-center transition-transform duration-300 ${
              open ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[#0A0A0A] border-t border-white/5 px-6 py-5 flex flex-col gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="font-manrope text-[15px] text-[#A0A0A0] hover:text-white py-3 border-b border-white/5 last:border-0 transition-colors duration-200"
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            className="mt-3 py-3.5 text-center text-sm font-manrope font-semibold bg-[#00D4FF] text-black rounded-[3px]"
            onClick={() => setOpen(false)}
          >
            Let&apos;s Talk
          </a>
        </div>
      </div>
    </header>
  );
}
