const NAV_LINKS = [
  { label: "Services",     href: "#services" },
  { label: "Technologies", href: "#technologies" },
  { label: "Contact",      href: "#contact" },
];
const SOCIALS = [
  { label: "GH", title: "GitHub",      href: "https://github.com/mrdevs" },
  { label: "LI", title: "LinkedIn",    href: "https://linkedin.com/company/mrdevs" },
  { label: "TW", title: "Twitter / X", href: "https://x.com/mrdevs" },
];

export default function Footer() {
  return (
    <footer className="relative border-t py-14 bg-[#060f1e] border-[rgba(0,180,216,0.1)]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,180,216,0.4), transparent)" }} />
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mb-10">
          <div>
            <a href="/" className="flex items-center gap-3 mb-3">
              <div className="w-7 h-7 flex items-center justify-center rounded-[5px] bg-[#00b4d8]">
                <span className="font-syne font-black text-[#0a1628] text-xs leading-none">M</span>
              </div>
              <span className="font-syne font-bold text-white tracking-tight text-[15px]">
                MrDevs
              </span>
            </a>
            <p className="font-manrope text-[rgba(255,255,255,0.45)] text-xs max-w-[220px] leading-relaxed">
              Your trusted dev team — building digital solutions for local businesses and beyond.
            </p>
          </div>
          <nav className="flex gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <a key={label} href={href}
                className="font-manrope text-sm text-[rgba(255,255,255,0.45)] hover:text-white transition-colors duration-200">{label}</a>
            ))}
          </nav>
          <div className="flex gap-2">
            {SOCIALS.map(({ label, title, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={title}
                className="w-8 h-8 rounded-[5px] flex items-center justify-center transition-all duration-300 group hover:border-[rgba(0,180,216,0.4)] hover:bg-[rgba(0,180,216,0.08)]"
                style={{ border: "1px solid rgba(0,180,216,0.12)" }}>
                <span className="font-syne font-bold text-[10px] text-[rgba(255,255,255,0.45)] group-hover:text-[#00b4d8] transition-colors duration-300">{label}</span>
              </a>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-6 border-t"
          style={{ borderColor: "rgba(0,180,216,0.08)" }}>
          <p className="font-manrope text-[rgba(255,255,255,0.3)] text-xs">© {new Date().getFullYear()} MrDevs. All rights reserved.</p>
          <p className="font-manrope text-[rgba(255,255,255,0.3)] text-xs">mrdevs.dev</p>
        </div>
      </div>
    </footer>
  );
}