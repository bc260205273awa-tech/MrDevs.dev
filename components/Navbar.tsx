"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, ArrowRight, Code2, Smartphone, Shield, Zap, MapPin, Palette } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileAccordionOpen, setMobileAccordionOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".services-dropdown-container")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isHome) return;

    const sections = ["hero", "services", "work", "process", "contact"];
    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -50% 0px",
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
  }, [isHome]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const targetId = href.replace("#", "");
    
    if (isHome) {
      e.preventDefault();
      setOpen(false);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const navHeight = 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    }
    // If not home, standard navigation to "/#section" will occur
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
        {/* Logo Image */}
        <a
          href="/"
          className="flex items-center select-none"
        >
          <Image
            src="/logo.png"
            alt="mrdevs logo"
            width={78}
            height={30}
            priority
            className="block object-contain"
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {/* Hover Dropdown for Services */}
          <div
            className="relative services-dropdown-container"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                setDropdownOpen((prev) => !prev);
              }}
              className={`text-sm font-medium transition-colors duration-200 relative py-1 flex items-center gap-1 ${
                pathname.startsWith("/services") ? "text-[#378ADD]" : "text-[#f1efe8]/85 hover:text-[#f1efe8]"
              }`}
            >
              services
              <ChevronDown size={12} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 top-full pt-2 w-72 z-50 text-left animate-[fade-up_0.2s_ease-out_forwards]">
                <div className="rounded-xl bg-[#0f1729]/95 backdrop-blur-[16px] border border-[rgba(133,183,235,0.15)] shadow-2xl p-3 flex flex-col gap-1">
                  <a
                    href="/services/web-development"
                    className="group flex items-center gap-3 text-xs text-[#888780] hover:text-[#378ADD] hover:bg-white/[0.02] p-2 rounded-lg transition-all"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="w-6 h-6 rounded bg-[#378ADD]/10 flex items-center justify-center text-[#378ADD] group-hover:bg-[#378ADD]/20 transition-colors">
                      <Code2 size={12} />
                    </div>
                    <span>web development</span>
                  </a>
                  <a
                    href="/services/app-development"
                    className="group flex items-center gap-3 text-xs text-[#888780] hover:text-[#378ADD] hover:bg-white/[0.02] p-2 rounded-lg transition-all"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="w-6 h-6 rounded bg-[#378ADD]/10 flex items-center justify-center text-[#378ADD] group-hover:bg-[#378ADD]/20 transition-colors">
                      <Smartphone size={12} />
                    </div>
                    <span>app development</span>
                  </a>
                  <a
                    href="/services/hospital-software-systems"
                    className="group flex items-center gap-3 text-xs text-[#888780] hover:text-[#378ADD] hover:bg-white/[0.02] p-2 rounded-lg transition-all"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="w-6 h-6 rounded bg-[#378ADD]/10 flex items-center justify-center text-[#378ADD] group-hover:bg-[#378ADD]/20 transition-colors">
                      <Shield size={12} />
                    </div>
                    <span>hospital & software systems</span>
                  </a>
                  <a
                    href="/services/whatsapp-automation"
                    className="group flex items-center gap-3 text-xs text-[#888780] hover:text-[#378ADD] hover:bg-white/[0.02] p-2 rounded-lg transition-all"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="w-6 h-6 rounded bg-[#378ADD]/10 flex items-center justify-center text-[#378ADD] group-hover:bg-[#378ADD]/20 transition-colors">
                      <Zap size={12} />
                    </div>
                    <span>whatsapp & automation</span>
                  </a>
                  <a
                    href="/services/maps-optimization"
                    className="group flex items-center gap-3 text-xs text-[#888780] hover:text-[#378ADD] hover:bg-white/[0.02] p-2 rounded-lg transition-all"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="w-6 h-6 rounded bg-[#378ADD]/10 flex items-center justify-center text-[#378ADD] group-hover:bg-[#378ADD]/20 transition-colors">
                      <MapPin size={12} />
                    </div>
                    <span>google maps optimization</span>
                  </a>
                  <a
                    href="/services/design-branding"
                    className="group flex items-center gap-3 text-xs text-[#888780] hover:text-[#378ADD] hover:bg-white/[0.02] p-2 rounded-lg transition-all"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="w-6 h-6 rounded bg-[#378ADD]/10 flex items-center justify-center text-[#378ADD] group-hover:bg-[#378ADD]/20 transition-colors">
                      <Palette size={12} />
                    </div>
                    <span>design & branding</span>
                  </a>
                  
                  <div className="border-t border-[rgba(133,183,235,0.06)] pt-2 mt-1">
                    <a
                      href="/services/social-media"
                      className="group flex items-center gap-3 text-xs font-medium text-[#f1efe8] hover:text-[#378ADD] hover:bg-white/[0.02] p-2 rounded-lg transition-all"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <div className="w-6 h-6 rounded bg-[#378ADD]/10 flex items-center justify-center text-[#378ADD] group-hover:bg-[#378ADD]/20 transition-colors">
                        <ArrowRight size={12} />
                      </div>
                      <span className="flex-1">social media</span>
                    </a>
                    <div className="pl-8 flex flex-col gap-1 mt-1 border-l border-[rgba(133,183,235,0.08)] ml-5">
                      <a
                        href="/services/social-media/graphic-design"
                        className="text-[11px] text-[#888780] hover:text-[#378ADD] transition-colors py-1 block"
                        onClick={() => setDropdownOpen(false)}
                      >
                        graphic design
                      </a>
                      <a
                        href="/services/social-media/video-editing"
                        className="text-[11px] text-[#888780] hover:text-[#378ADD] transition-colors py-1 block"
                        onClick={() => setDropdownOpen(false)}
                      >
                        video editing
                      </a>
                      <a
                        href="/services/social-media/content-scripting"
                        className="text-[11px] text-[#888780] hover:text-[#378ADD] transition-colors py-1 block"
                        onClick={() => setDropdownOpen(false)}
                      >
                        content scripting
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Simple Link items */}
          <a
            href={isHome ? "#work" : "/#work"}
            onClick={(e) => handleLinkClick(e, "#work")}
            className={`text-sm font-medium transition-colors duration-200 relative py-1 ${
              isHome && activeSection === "work" ? "text-[#378ADD]" : "text-[#f1efe8]/85 hover:text-[#f1efe8]"
            }`}
          >
            work
            {isHome && activeSection === "work" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#378ADD] rounded-full" />
            )}
          </a>

          <a
            href={isHome ? "#process" : "/#process"}
            onClick={(e) => handleLinkClick(e, "#process")}
            className={`text-sm font-medium transition-colors duration-200 relative py-1 ${
              isHome && activeSection === "process" ? "text-[#378ADD]" : "text-[#f1efe8]/85 hover:text-[#f1efe8]"
            }`}
          >
            process
            {isHome && activeSection === "process" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#378ADD] rounded-full" />
            )}
          </a>

          <a
            href={isHome ? "#contact" : "/#contact"}
            onClick={(e) => handleLinkClick(e, "#contact")}
            className={`text-sm font-medium transition-colors duration-200 relative py-1 ${
              isHome && activeSection === "contact" ? "text-[#378ADD]" : "text-[#f1efe8]/85 hover:text-[#f1efe8]"
            }`}
          >
            contact
            {isHome && activeSection === "contact" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#378ADD] rounded-full" />
            )}
          </a>
        </nav>

        {/* CTA */}
        <a
          href={isHome ? "#contact" : "/#contact"}
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
        className={`md:hidden overflow-y-auto transition-all duration-300 ease-in-out border-b border-[rgba(133,183,235,0.06)] bg-[#0a0f1a] ${
          open ? "max-h-[85vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-1">
          {/* Services Accordion */}
          <div>
            <button
              onClick={() => setMobileAccordionOpen(!mobileAccordionOpen)}
              className="w-full text-left text-[15px] font-medium py-3 border-b border-white/5 flex items-center justify-between text-[#f1efe8]/80"
            >
              <span>services</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${mobileAccordionOpen ? "rotate-180" : ""}`} />
            </button>

            {mobileAccordionOpen && (
              <div className="pl-4 py-2 flex flex-col gap-3 border-l border-[rgba(133,183,235,0.1)] mb-2 mt-1">
                <a href="/services/web-development" className="text-xs text-[#888780] py-1">web development</a>
                <a href="/services/app-development" className="text-xs text-[#888780] py-1">app development</a>
                <a href="/services/hospital-software-systems" className="text-xs text-[#888780] py-1">hospital & software systems</a>
                <a href="/services/whatsapp-automation" className="text-xs text-[#888780] py-1">whatsapp & automation</a>
                <a href="/services/maps-optimization" className="text-xs text-[#888780] py-1">google maps optimization</a>
                <a href="/services/design-branding" className="text-xs text-[#888780] py-1">design & branding</a>
                
                <div className="border-t border-white/5 pt-2 flex flex-col gap-2">
                  <a href="/services/social-media" className="text-xs text-[#f1efe8] py-1 flex items-center justify-between">
                    social media
                    <ArrowRight size={12} />
                  </a>
                  <div className="pl-3 flex flex-col gap-2">
                    <a href="/services/social-media/graphic-design" className="text-[11px] text-[#888780] py-0.5">graphic design</a>
                    <a href="/services/social-media/video-editing" className="text-[11px] text-[#888780] py-0.5">video editing</a>
                    <a href="/services/social-media/content-scripting" className="text-[11px] text-[#888780] py-0.5">content scripting</a>
                  </div>
                </div>
              </div>
            )}
          </div>

          <a
            href={isHome ? "#work" : "/#work"}
            onClick={(e) => handleLinkClick(e, "#work")}
            className="text-[15px] font-medium py-3 border-b border-white/5 text-[#f1efe8]/80 flex items-center justify-between"
          >
            work
          </a>

          <a
            href={isHome ? "#process" : "/#process"}
            onClick={(e) => handleLinkClick(e, "#process")}
            className="text-[15px] font-medium py-3 border-b border-white/5 text-[#f1efe8]/80 flex items-center justify-between"
          >
            process
          </a>

          <a
            href={isHome ? "#contact" : "/#contact"}
            onClick={(e) => handleLinkClick(e, "#contact")}
            className="text-[15px] font-medium py-3 border-b border-white/5 text-[#f1efe8]/80 flex items-center justify-between"
          >
            contact
          </a>

          <a
            href={isHome ? "#contact" : "/#contact"}
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
