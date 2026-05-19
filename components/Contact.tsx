"use client";
import { useState, useEffect, useRef } from "react";
import { Mail, MessageSquare, Send } from "lucide-react";

const PROJECT_TYPES = [
  "Web Development", "App Development", "Hospital / Software System",
  "WhatsApp & Automation", "Google Maps Optimization",
  "Graphic Design & Branding", "Other / Not sure yet",
];

interface FormState { name: string; email: string; projectType: string; message: string; }
const INITIAL_FORM: FormState = { name: "", email: "", projectType: "", message: "" };

export default function Contact() {
  const [form, setForm]           = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const leftRef  = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observe = (el: HTMLElement | null, delay = 0) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setTimeout(() => el.classList.add("visible"), delay); obs.disconnect(); } },
        { threshold: 0.15 });
      obs.observe(el); return () => obs.disconnect();
    };
    observe(leftRef.current, 0);
    observe(rightRef.current, 150);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false); setSubmitted(true);
  };

  const inputClass = "w-full px-4 py-3 rounded-[6px] font-manrope text-sm text-white placeholder-[#2e3a4e] focus:outline-none transition-all duration-200 border focus:border-[rgba(0,180,216,0.5)] bg-[#0d1b36] border-[rgba(0,180,216,0.12)] focus:bg-[#112240]";

  return (
    <section id="contact" className="py-28 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(0,212,170,0.06) 0%, transparent 70%)", filter: "blur(80px)" }} />
      <hr className="hr-gradient max-w-6xl mx-auto mb-28" />
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          <div ref={leftRef} className="reveal">
            <p className="section-label mb-4">Get In Touch</p>
            <h2 className="font-syne font-bold text-4xl md:text-[2.8rem] leading-[1.1] tracking-tight mb-6">
              Let&apos;s Build<br />Something <span className="gradient-text">Great</span><br />Together.
            </h2>
            <p className="font-manrope text-[#8892a4] leading-relaxed max-w-xs mb-10 text-sm">
              Have a project in mind? Drop us a message and we&apos;ll get back to you within 24 hours.
            </p>
            <div className="flex flex-col gap-3 mb-10">
              {[
                { href: "mailto:mubeenAhma1123@gmail.com", icon: Mail,          label: "mubeenAhma1123@gmail.com" },
                { href: "https://wa.me/923218492868",       icon: MessageSquare, label: "WhatsApp — +92 321 849 2868" },
                { href: "https://wa.me/923219565657",       icon: MessageSquare, label: "WhatsApp — +92 321 956 5657" },
              ].map(({ href, icon: Icon, label }) => (
                <a key={href} href={href} target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-3 group w-fit">
                  <div className="w-9 h-9 rounded-[6px] flex items-center justify-center transition-all duration-300 group-hover:border-[rgba(0,180,216,0.4)] group-hover:bg-[rgba(0,180,216,0.1)]"
                    style={{ border: "1px solid rgba(0,180,216,0.15)", background: "rgba(0,180,216,0.04)" }}>
                    <Icon size={14} className="text-[#00b4d8]" strokeWidth={1.75} />
                  </div>
                  <span className="font-manrope text-sm text-[#8892a4] group-hover:text-white transition-colors duration-200">{label}</span>
                </a>
              ))}
            </div>
            <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-[6px]"
              style={{ border: "1px solid rgba(0,212,170,0.2)", background: "rgba(0,212,170,0.05)" }}>
              <div className="status-dot" />
              <span className="font-manrope text-xs text-[#8892a4]">
                Average response time: <span className="text-[#00d4aa] font-semibold">under 24 hours</span>
              </span>
            </div>
          </div>

          <div ref={rightRef} className="reveal rounded-[12px] p-8"
            style={{ border: "1px solid rgba(0,180,216,0.15)", background: "rgba(11,27,54,0.8)", backdropFilter: "blur(12px)" }}>
            {submitted ? (
              <div className="flex flex-col items-center text-center py-10 gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
                  style={{ border: "1px solid rgba(0,212,170,0.4)", background: "rgba(0,212,170,0.08)" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-[#00d4aa]">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-syne font-bold text-xl text-white">Message Received!</h3>
                <p className="font-manrope text-[#8892a4] text-sm max-w-[220px] leading-relaxed">
                  We&apos;ll review your message and be in touch within 24 hours.
                </p>
                <button onClick={() => { setSubmitted(false); setForm(INITIAL_FORM); }}
                  className="mt-3 font-manrope text-xs text-[#00b4d8] hover:text-white transition-colors duration-200 tracking-wider uppercase">
                  Send another →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: "name",  label: "Full Name",     type: "text",  placeholder: "Your name" },
                    { name: "email", label: "Email Address", type: "email", placeholder: "you@company.com" },
                  ].map(f => (
                    <div key={f.name} className="flex flex-col gap-1.5">
                      <label className="font-manrope text-[11px] text-[#4a5568] tracking-wide uppercase font-semibold">{f.label}</label>
                      <input type={f.type} name={f.name} value={form[f.name as keyof FormState]}
                        onChange={handleChange} required placeholder={f.placeholder} className={inputClass} />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-manrope text-[11px] text-[#4a5568] tracking-wide uppercase font-semibold">Project Type</label>
                  <div className="relative">
                    <select name="projectType" value={form.projectType} onChange={handleChange} required
                      className={`${inputClass} cursor-pointer pr-9`}>
                      <option value="" disabled>Select a service...</option>
                      {PROJECT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 4l4 4 4-4" stroke="#4a5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-manrope text-[11px] text-[#4a5568] tracking-wide uppercase font-semibold">Your Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                    placeholder="Tell us about your project, goals, and timeline..." className={`${inputClass} resize-none`} />
                </div>
                <button type="submit" disabled={loading}
                  className="btn-primary group inline-flex items-center justify-center gap-2.5 px-7 py-4 font-manrope font-semibold text-sm rounded-[6px] disabled:opacity-60 disabled:cursor-not-allowed mt-1">
                  {loading ? (
                    <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>Sending...</>
                  ) : (
                    <>Send Message<Send size={13} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}