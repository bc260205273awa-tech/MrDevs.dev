"use client";

import { useState } from "react";
import { Send, MessageSquare } from "lucide-react";

const PROJECT_TYPES = [
  "Web development",
  "App development",
  "Software systems",
  "WhatsApp & automation",
  "Google Maps optimization",
  "Design & branding",
  "Other",
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
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  const inputClass =
    "w-full px-3 py-2 bg-[#0f1729] border border-[rgba(133,183,235,0.1)] rounded font-sans text-xs text-[#f1efe8] placeholder-[#5F5E5A] focus:outline-none focus:border-[#378ADD]/40 focus:bg-[#0f1729]/80 transition-all duration-200";

  return (
    <section id="contact" className="py-20 bg-[#0a0f1a] font-sans">
      <div className="max-w-md mx-auto px-6 flex flex-col items-center">
        
        {/* Section Label */}
        <span className="text-[10px] font-medium text-[#888780] tracking-[0.15em] uppercase mb-3 select-none">
          Contact
        </span>

        {/* Headline */}
        <h2 className="text-[17px] font-medium text-[#f1efe8] mb-6 text-center">
          Let&apos;s build yours next.
        </h2>

        {/* Primary CTA — WhatsApp Button */}
        <a
          href="https://wa.me/923218492868"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#378ADD] text-[#042C53] font-medium text-xs rounded hover:bg-[#378ADD]/90 hover:scale-[0.98] active:scale-[0.95] transition-all duration-200 shadow mb-6 text-center select-none"
        >
          <MessageSquare size={14} />
          Message us on WhatsApp
        </a>

        {/* Separator */}
        <div className="w-full flex items-center justify-center gap-3 mb-6 select-none">
          <div className="h-px flex-1 bg-[rgba(133,183,235,0.08)]" />
          <span className="text-[10px] text-[#5F5E5A] tracking-wider uppercase font-medium">
            or send an email
          </span>
          <div className="h-px flex-1 bg-[rgba(133,183,235,0.08)]" />
        </div>

        {/* Secondary Form (Low Visual Weight) */}
        <div className="w-full p-6 border border-[rgba(133,183,235,0.08)] rounded-xl bg-[#0f1729]/30 backdrop-blur-sm">
          {submitted ? (
            <div className="flex flex-col items-center text-center py-6 gap-3 select-none">
              <div className="w-10 h-10 rounded-full border border-[#5DCAA5]/30 bg-[#5DCAA5]/5 flex items-center justify-center mb-1">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-[#5DCAA5]"
                >
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="font-sans font-medium text-xs text-[#f1efe8]">
                Message received!
              </h3>
              <p className="font-sans text-[#888780] text-[11px] max-w-[200px] leading-relaxed">
                We will get back to you within 24 hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm(INITIAL_FORM);
                }}
                className="mt-2 text-[10px] text-[#378ADD] hover:text-[#f1efe8] transition-colors duration-200 font-medium"
              >
                Send another message →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-[#888780] font-medium select-none">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-[#888780] font-medium select-none">
                  Email
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

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-[#888780] font-medium select-none">
                  Project type
                </label>
                <div className="relative">
                  <select
                    name="projectType"
                    value={form.projectType}
                    onChange={handleChange}
                    required
                    className={`${inputClass} cursor-pointer pr-8`}
                  >
                    <option value="" disabled>
                      Select a service...
                    </option>
                    {PROJECT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type.toLowerCase()}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#5F5E5A]">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 4l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-[#888780] font-medium select-none">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Describe your goals and budget..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-transparent border border-[rgba(133,183,235,0.2)] text-[#f1efe8] font-medium text-xs rounded hover:border-[rgba(133,183,235,0.4)] hover:bg-[#378ADD]/5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed select-none mt-1"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin w-3 h-3 text-[#f1efe8]"
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
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send message</span>
                    <Send size={10} className="text-[#888780]" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
