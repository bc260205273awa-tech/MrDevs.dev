"use client";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Services",     href: "#services" },
  { label: "Technologies", href: "#technologies" },
  { label: "Contact",      href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Behavior 1: Frosted Glass on scroll (after 60px)
      setScrolled(currentScrollY > 60);

      // Behavior 2: Hide on scroll down past 100px, show on scroll up
      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY) {
          setHidden(true); // scrolling down
        } else {
          setHidden(false); // scrolling up
        }
      } else {
        setHidden(false);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Behavior 3: Intersection Observer for active link
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-30% 0px -70% 0px" } // Adjust offsets so sections trigger correctly
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((s) => observer.observe(s));
    
    return () => sections.forEach((s) => observer.unobserve(s));
  }, []);

  return (
    <header 
      className={`fixed inset-x-0 top-0 z-50 w-full ${scrolled ? 'py-3' : 'py-5'}`}
      style={{
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease, padding 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease',
        backgroundColor: scrolled ? 'rgba(10, 22, 40, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0, 180, 216, 0.15)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 24px rgba(0, 0, 0, 0.3)' : 'none',
      }}>
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
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = activeSection === href;
            return (
              <a key={label} href={href}
                className={`relative font-manrope text-sm tracking-wide transition-colors duration-200 ${
                  isActive ? 'text-[#00b4d8]' : 'text-[rgba(255,255,255,0.6)] hover:text-[#FFFFFF]'
                }`}>
                {label}
                {isActive && (
                  <span className="absolute bottom-[-2px] left-0 w-full h-[2px] rounded-full"
                    style={{ background: 'linear-gradient(90deg, #00b4d8, #00d4aa)' }} />
                )}
              </a>
            );
          })}
        </nav>

        <a href="#contact"
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-manrope rounded-[5px] bg-[#00b4d8] text-[#0a1628] hover:bg-[#00d4aa] transition-colors" style={{ boxShadow: "0 0 20px rgba(0,180,216,0.3)" }}>
          Let&apos;s Talk
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        <button onClick={() => setOpen(v => !v)} className="md:hidden flex flex-col gap-[5px] p-2" aria-label="Toggle navigation">
          <span className={`block h-px w-6 bg-[#00b4d8] origin-center transition-transform duration-300 ${open ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`block h-px w-6 bg-[#00b4d8] transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`block h-px w-6 bg-[#00b4d8] origin-center transition-transform duration-300 ${open ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-6 py-5 flex flex-col gap-1 border-t border-[rgba(0,180,216,0.1)]"
          style={{ background: '#112240', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
          {NAV_LINKS.map(({ label, href }, i) => (
            <a key={label} href={href}
              className={`font-manrope text-[15px] text-[rgba(255,255,255,0.6)] hover:text-white py-3 border-b border-white/5 last:border-0 transition-all duration-300 ${open ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
              style={{ transitionDelay: `${open ? i * 50 : 0}ms` }}
              onClick={() => setOpen(false)}>{label}</a>
          ))}
          <a href="#contact"
            className={`mt-3 py-3.5 text-center text-sm font-manrope font-semibold rounded-[5px] bg-[#00b4d8] text-[#0a1628] hover:bg-[#00d4aa] transition-all shadow-[0_0_20px_rgba(0,180,216,0.3)] duration-300 ${open ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
            style={{ transitionDelay: `${open ? NAV_LINKS.length * 50 : 0}ms` }}
            onClick={() => setOpen(false)}>
            Let&apos;s Talk
          </a>
        </div>
      </div>
    </header>
  );
}