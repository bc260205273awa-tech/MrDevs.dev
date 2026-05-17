const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Technologies", href: "#technologies" },
  { label: "Contact", href: "#contact" },
];

const SOCIALS = [
  { label: "GH", title: "GitHub", href: "https://github.com/mrdevs" },
  {
    label: "LI",
    title: "LinkedIn",
    href: "https://linkedin.com/company/mrdevs",
  },
  { label: "TW", title: "Twitter / X", href: "https://x.com/mrdevs" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mb-10">
          {/* Brand */}
          <div>
            <a href="/" className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 bg-[#00D4FF] flex items-center justify-center rounded-[3px]">
                <span className="font-syne font-black text-black text-xs leading-none">
                  M
                </span>
              </div>
              <span className="font-syne font-bold text-white tracking-tight text-[15px]">
                MrDevs
              </span>
            </a>
            <p className="font-manrope text-[#333] text-xs max-w-[240px] leading-relaxed">
              Premium digital agency building websites, apps &amp; software for
              ambitious businesses.
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="font-manrope text-sm text-[#444] hover:text-white transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex gap-2">
            {SOCIALS.map(({ label, title, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={title}
                className="w-8 h-8 border border-white/7 rounded-[4px] flex items-center justify-center text-[#3a3a3a] hover:text-white hover:border-white/15 transition-all duration-200"
              >
                <span className="font-syne font-bold text-[10px] tracking-tight">
                  {label}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-6 border-t border-white/5">
          <p className="font-manrope text-[#2e2e2e] text-xs">
            © {new Date().getFullYear()} MrDevs. All rights reserved.
          </p>
          <p className="font-manrope text-[#2e2e2e] text-xs tracking-wide">
            mrdevs.dev
          </p>
        </div>
      </div>
    </footer>
  );
}
