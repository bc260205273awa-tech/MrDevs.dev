"use client";

import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = ["hero", "services", "work", "process", "contact"];
    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -50% 0px", // Trigger when section occupies the upper-middle of viewport
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    const targetId = href.replace("#", "");
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
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 font-sans ${
        scrolled
          ? "py-4 bg-[#0a0f1a]/85 backdrop-blur-[12px] border-b border-[rgba(133,183,235,0.12)] shadow-lg"
          : "py-6 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => handleLinkClick(e, "#hero")}
          className="flex items-center gap-0.5 font-sans font-medium text-lg tracking-tight select-none"
        >
          <span className="text-[#f1efe8]">mr</span>
          <span className="text-[#378ADD]">devs</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = activeSection === href.replace("#", "");
            return (
              <a
                key={label}
                href={href}
                onClick={(e) => handleLinkClick(e, href)}
                className={`text-sm font-medium transition-colors duration-200 relative py-1 ${
                  isActive ? "text-[#378ADD]" : "text-[#f1efe8]/85 hover:text-[#f1efe8]"
                }`}
              >
                {label.toLowerCase()}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#378ADD] rounded-full transition-all duration-200" />
                )}
              </a>
            );
          })}
        </nav>

        {/* CTA */}
        <a
          href="#contact"
          onClick={(e) => handleLinkClick(e, "#contact")}
          className="hidden md:inline-flex items-center justify-center px-4 py-2 text-xs font-medium bg-[#378ADD] text-[#042C53] rounded hover:bg-[#378ADD]/90 hover:scale-[0.98] active:scale-[0.95] transition-all duration-200 shadow-sm"
        >
          let&apos;s talk
        </a>

        {/* Hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden flex flex-col justify-center gap-1.5 p-1.5 z-10 w-8 h-8 rounded hover:bg-white/5 active:scale-95 transition-all duration-200"
          aria-label="Toggle navigation"
        >
          <span
            className={`block h-0.5 w-5 bg-[#f1efe8] origin-center transition-transform duration-300 ${
              open ? "rotate-45 translate-y-[4px]" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-[#f1efe8] transition-opacity duration-300 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-[#f1efe8] origin-center transition-transform duration-300 ${
              open ? "-rotate-45 -translate-y-[4px]" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile dropdown panel */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-[rgba(133,183,235,0.06)] bg-[#0a0f1a] ${
          open ? "max-h-[350px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-1">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = activeSection === href.replace("#", "");
            return (
              <a
                key={label}
                href={href}
                onClick={(e) => handleLinkClick(e, href)}
                className={`text-[15px] font-medium py-3 border-b border-white/5 last:border-0 transition-colors duration-200 flex items-center justify-between ${
                  isActive ? "text-[#378ADD]" : "text-[#f1efe8]/80"
                }`}
              >
                <span>{label.toLowerCase()}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#378ADD]" />}
              </a>
            );
          })}
          <a
            href="#contact"
            onClick={(e) => handleLinkClick(e, "#contact")}
            className="mt-4 py-3 text-center text-sm font-medium bg-[#378ADD] text-[#042C53] rounded hover:bg-[#378ADD]/90 transition-colors duration-200"
          >
            let&apos;s talk
          </a>
        </div>
      </div>
    </header>
  );
}
