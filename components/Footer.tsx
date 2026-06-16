"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { Github, Linkedin, Twitter, Mail, MessageSquare } from "lucide-react";

const SERVICES_LINKS = [
  { label: "web development", href: "/services/web-development" },
  { label: "app development", href: "/services/app-development" },
  { label: "hospital & software systems", href: "/services/hospital-software-systems" },
  { label: "whatsapp & automation", href: "/services/whatsapp-automation" },
  { label: "google maps optimization", href: "/services/maps-optimization" },
  { label: "design & branding", href: "/services/design-branding" },
];

const NAV_LINKS = [
  { label: "work", href: "#work" },
  { label: "process", href: "#process" },
  { label: "contact", href: "#contact" },
  { label: "social media hub", href: "/services/social-media" },
];

const SOCIALS = [
  { icon: Github, title: "GitHub", href: "https://github.com/mrdevs" },
  { icon: Linkedin, title: "LinkedIn", href: "https://linkedin.com/company/mrdevs" },
  { icon: Twitter, title: "Twitter / X", href: "https://x.com/mrdevs" },
];

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isHome && href.startsWith("#")) {
      e.preventDefault();
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
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#0a0f1a] to-[#070b13] font-sans border-t border-[rgba(133,183,235,0.06)] overflow-hidden">
      {/* Visual Accent Top Divider */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(133,183,235,0.18)] to-transparent" />

      <div className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          {/* Column 1: Brand Info */}
          <div className="flex flex-col items-start gap-4">
            <a
              href={isHome ? "#hero" : "/"}
              onClick={(e) => handleScrollTo(e, "#hero")}
              className="flex items-center select-none"
            >
              <Image
                src="/logo.png"
                alt="mrdevs logo"
                width={73}
                height={28}
                className="block object-contain"
              />
            </a>
            <p className="text-[#888780] text-[12px] leading-relaxed max-w-[240px]">
              Your trusted engineering team. Building premium websites, mobile apps, and custom software systems designed to drive your revenue.
            </p>
            {/* Glow Availability status */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(93,202,165,0.06)] border border-[rgba(93,202,165,0.12)] shadow-sm mt-1 select-none">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#5DCAA5] opacity-75 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#5DCAA5]" />
              </span>
              <span className="text-[10px] font-medium text-[#5DCAA5] tracking-[0.05em] uppercase">
                available now
              </span>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-medium text-[#f1efe8]/40 tracking-wider uppercase select-none">
              services
            </span>
            <div className="flex flex-col gap-2">
              {SERVICES_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xs text-[#888780] hover:text-[#378ADD] transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Agency Navigation */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-medium text-[#f1efe8]/40 tracking-wider uppercase select-none">
              agency
            </span>
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={isHome ? link.href : `/${link.href}`}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className="text-xs text-[#888780] hover:text-[#378ADD] transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Column 4: Contact & Socials */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-medium text-[#f1efe8]/40 tracking-wider uppercase select-none">
                get in touch
              </span>
              <div className="flex flex-col gap-2">
                <a
                  href="mailto:hello@mrdevs.dev"
                  className="inline-flex items-center gap-1.5 text-xs text-[#888780] hover:text-[#378ADD] transition-colors group"
                >
                  <Mail size={12} className="text-[#5F5E5A] group-hover:text-[#378ADD] transition-colors" />
                  hello@mrdevs.dev
                </a>
                <a
                  href="https://wa.me/923218492868"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#888780] hover:text-[#378ADD] transition-colors group"
                >
                  <MessageSquare size={12} className="text-[#5F5E5A] group-hover:text-[#378ADD] transition-colors" />
                  chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="flex gap-2.5 mt-2">
              {SOCIALS.map((soc) => {
                const Icon = soc.icon;
                return (
                  <a
                    key={soc.title}
                    href={soc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={soc.title}
                    className="w-8 h-8 border border-[rgba(133,183,235,0.1)] rounded bg-[#0f1729]/30 flex items-center justify-center text-[#888780] hover:text-[#378ADD] hover:border-[#378ADD]/30 hover:bg-[#378ADD]/5 transition-all duration-200"
                  >
                    <Icon size={14} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[rgba(133,183,235,0.06)]">
          <p className="text-[#5F5E5A] text-[11px]">
            © {new Date().getFullYear()} mrdevs. all rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[#5F5E5A] text-[11px] select-none">
            <span className="tracking-wide">mrdevs.dev</span>
            <span className="text-[#5F5E5A]/30">|</span>
            <span className="text-[#378ADD]/80">engineered for growth</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
