"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send } from "lucide-react";

const PROJECT_TYPES = [
  "Web Development",
  "App Development",
  "Software Solution",
  "Graphic Design",
  "Other / Not sure yet",
];

interface FormState {
  name: string;
  email: string;
  projectType: string;
  message: string;
}

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  projectType: "",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Replace with your actual form submission (FormSubmit, EmailJS, custom API, etc.)
    // Example with FormSubmit: set the form action to https://formsubmit.co/YOUR_EMAIL
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  const inputClass =
    "w-full px-4 py-3 bg-[#0A0A0A] border border-white/7 rounded-[3px] font-manrope text-sm text-white placeholder-[#2e2e2e] focus:outline-none focus:border-[#00D4FF]/40 focus:bg-[#0D0D0D] transition-all duration-200";

  return (
    <section id="contact" className="py-28 relative">
      {/* Bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00D4FF]/4 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left — info */}
          <div>
            <p className="font-manrope text-[11px] text-[#00D4FF] tracking-[0.2em] uppercase mb-4">
              Get In Touch
            </p>
            <h2 className="font-syne font-bold text-4xl md:text-[2.8rem] leading-[1.1] tracking-tight mb-6">
              Let&apos;s Build
              <br />
              Something{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #00D4FF 0%, #0066FF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Great
              </span>
              <br />
              Together.
            </h2>
            <p className="font-manrope text-[#555] leading-relaxed max-w-xs mb-10 text-sm">
              Have a project in mind? Drop us a message and we&apos;ll get back
              to you within 24 hours.
            </p>

            {/* Contact methods */}
            <div className="flex flex-col gap-3">
              <a
                href="mailto:mubeenAhma1123@gmail.com"
                className="inline-flex items-center gap-3 group w-fit"
              >
                <div className="w-9 h-9 border border-white/7 rounded-[5px] flex items-center justify-center group-hover:border-[#00D4FF]/35 group-hover:bg-[#00D4FF]/8 transition-all duration-200">
                  <Mail size={14} className="text-[#00D4FF]" strokeWidth={1.75} />
                </div>
                <span className="font-manrope text-sm text-[#555] group-hover:text-white transition-colors duration-200">
                  mubeenAhma1123@gmail.com
                </span>
              </a>
              <a
                href="https://wa.me/923218492868"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 group w-fit"
              >
                <div className="w-9 h-9 border border-white/7 rounded-[5px] flex items-center justify-center group-hover:border-[#00D4FF]/35 group-hover:bg-[#00D4FF]/8 transition-all duration-200">
                  <MessageSquare size={14} className="text-[#00D4FF]" strokeWidth={1.75} />
                </div>
                <span className="font-manrope text-sm text-[#555] group-hover:text-white transition-colors duration-200">
                  WhatsApp — +92 321 8492868
                </span>
              </a>
              <a
                href="https://wa.me/923219565657"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 group w-fit"
              >
                <div className="w-9 h-9 border border-white/7 rounded-[5px] flex items-center justify-center group-hover:border-[#00D4FF]/35 group-hover:bg-[#00D4FF]/8 transition-all duration-200">
                  <MessageSquare size={14} className="text-[#00D4FF]" strokeWidth={1.75} />
                </div>
                <span className="font-manrope text-sm text-[#555] group-hover:text-white transition-colors duration-200">
                  WhatsApp — +92 321 9565657
                </span>
              </a>
            </div>

            {/* Response time badge */}
            <div className="mt-10 inline-flex items-center gap-2 px-4 py-2.5 border border-white/6 rounded-[5px] bg-white/[0.02]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="font-manrope text-xs text-[#555]">
                Average response time:{" "}
                <span className="text-[#888]">under 24 hours</span>
              </span>
            </div>
          </div>

          {/* Right — form */}
          <div className="border border-white/6 rounded-lg p-8 bg-[#080808]">
            {submitted ? (
              <div className="flex flex-col items-center text-center py-10 gap-4">
                <div className="w-16 h-16 rounded-full border border-[#00D4FF]/30 bg-[#00D4FF]/8 flex items-center justify-center mb-2">
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-[#00D4FF]"
                  >
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="font-syne font-bold text-xl text-white">
                  Message Received!
                </h3>
                <p className="font-manrope text-[#555] text-sm max-w-[220px] leading-relaxed">
                  We&apos;ll review your message and be in touch within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm(INITIAL_FORM);
                  }}
                  className="mt-3 font-manrope text-xs text-[#00D4FF] hover:text-white transition-colors duration-200 tracking-wider uppercase"
                >
                  Send another →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-manrope text-[11px] text-[#444] tracking-wide">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="John Smith"
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-manrope text-[11px] text-[#444] tracking-wide">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@company.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-manrope text-[11px] text-[#444] tracking-wide">
                    Project Type
                  </label>
                  <div className="relative">
                    <select
                      name="projectType"
                      value={form.projectType}
                      onChange={handleChange}
                      required
                      className={`${inputClass} cursor-pointer pr-9`}
                    >
                      <option value="" disabled>
                        Select a service...
                      </option>
                      {PROJECT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {/* Custom chevron */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M2 4l4 4 4-4"
                          stroke="#444"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-manrope text-[11px] text-[#444] tracking-wide">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us about your project, goals, and timeline..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-[#00D4FF] text-black font-manrope font-semibold text-sm rounded-[3px] hover:bg-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send
                        size={13}
                        className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </>
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
