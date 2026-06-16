"use client";

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

const SOCIALS = [
  { label: "gh", title: "GitHub", href: "https://github.com/mrdevs" },
  {
    label: "li",
    title: "LinkedIn",
    href: "https://linkedin.com/company/mrdevs",
  },
  { label: "tw", title: "Twitter / X", href: "https://x.com/mrdevs" },
];

export default function Footer() {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
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
  };

  return (
    <footer className="border-t border-[rgba(133,183,235,0.06)] py-12 bg-[#0a0f1a] font-sans">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mb-10">
          {/* Brand */}
          <div>
            <a
              href="#hero"
              onClick={(e) => handleScrollTo(e, "#hero")}
              className="flex items-center gap-0.5 font-sans font-medium text-base tracking-tight select-none mb-3"
            >
              <span className="text-[#f1efe8]">mr</span>
              <span className="text-[#378ADD]">devs</span>
            </a>
            <p className="text-[#888780] text-xs max-w-[280px] leading-relaxed">
              Your trusted dev team — building digital solutions for local businesses and beyond.
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={(e) => handleScrollTo(e, href)}
                className="text-xs text-[#888780] hover:text-[#378ADD] transition-colors duration-200"
              >
                {label.toLowerCase()}
              </a>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex gap-2.5">
            {SOCIALS.map(({ label, title, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={title}
                className="w-7 h-7 border border-[rgba(133,183,235,0.1)] rounded flex items-center justify-center text-[#888780] hover:text-[#378ADD] hover:border-[#378ADD]/30 transition-all duration-200"
              >
                <span className="font-sans font-medium text-[10px] tracking-tight uppercase">
                  {label}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-[rgba(133,183,235,0.06)]">
          <p className="text-[#5F5E5A] text-[11px]">
            © {new Date().getFullYear()} mrdevs. all rights reserved.
          </p>
          <p className="text-[#5F5E5A] text-[11px] tracking-wide select-all">
            mrdevs.dev
          </p>
        </div>
      </div>
    </footer>
  );
}
