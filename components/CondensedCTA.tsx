"use client";

import { useRef } from "react";
import { MessageSquare } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { use3DTilt } from "@/hooks/use3DTilt";

export default function CondensedCTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  useScrollReveal(containerRef);
  use3DTilt(containerRef, ".tilt-card", 14, 850);

  return (
    <section ref={containerRef} className="py-24 bg-bg-main font-sans overflow-hidden">
      {/* Massive Glowing Band Container */}
      <div className="relative w-full max-w-6xl mx-auto px-6">
        <div className="tilt-card scroll-reveal relative overflow-hidden bg-white/[0.02] backdrop-blur-xl border border-white/10 py-20 px-8 flex flex-col items-center text-center gap-8 shadow-[0_0_50px_rgba(47,168,255,0.03)] rounded-3xl">
          
          {/* Subtle Background Glow inside the band */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[300px] bg-accent-primary/10 blur-[100px] rounded-full" />
          </div>

          {/* Elevated Typography */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            {/* [CHANGED] Branded H3 mentioning MR Devs */}
            <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tighter">
              Ready to move fast with MR Devs?
            </h3>
            {/* [CHANGED] Updated subtext for stronger branding */}
            <p className="text-sm md:text-lg text-text-body font-medium max-w-md mx-auto">
              Skip the forms. Connect directly with our founders on WhatsApp and start scaling your product today.
            </p>
          </div>
          
          {/* Premium CTA Button */}
          <a
            // [CHANGED] Updated to company number and added pre-filled text parameter
            href="https://wa.me/923219565657?text=Hi%20MR%20Devs,%20I'd%20like%20to%20talk%20about%20a%20project."
            target="_blank"
            rel="noopener noreferrer"
            // [CHANGED] Elevated button with hover-only shine sweep
            className="group relative z-10 inline-flex items-center justify-center gap-3 px-8 py-4 bg-accent-primary text-[#050B14] font-semibold text-[15px] rounded-full shadow-glow hover:bg-accent-cyan hover:shadow-glow-cyan hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 overflow-hidden"
          >
            {/* The sweep/shine effect (only triggers on hover) */}
            <span className="absolute top-0 bottom-0 left-0 w-16 -translate-x-[150%] group-hover:translate-x-[500%] bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 transition-transform duration-1000 ease-out" />
            
            {/* Pulsing icon */}
            <div className="relative flex items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-[#050B14] opacity-30 animate-ping-slow" />
              <MessageSquare size={18} className="relative z-10" />
            </div>
            Book a Strategy Call
          </a>
        </div>
      </div>
    </section>
  );
}
