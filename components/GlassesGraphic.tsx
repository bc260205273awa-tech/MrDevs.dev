"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

interface GlassesGraphicProps {
  imageSrc?: string;
  className?: string;
}

export default function GlassesGraphic({ imageSrc = "/logo.png", className = "" }: GlassesGraphicProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const glassesRef = useRef<HTMLDivElement>(null);
  const reflectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !glassesRef.current) return;

    // Create GSAP quickTo setters for 60fps buttery-smooth motion without React state overhead
    const xTo = gsap.quickTo(glassesRef.current, "rotateY", { duration: 0.5, ease: "power2.out" });
    const yTo = gsap.quickTo(glassesRef.current, "rotateX", { duration: 0.5, ease: "power2.out" });
    const zTo = gsap.quickTo(glassesRef.current, "rotateZ", { duration: 0.6, ease: "power2.out" });
    const translateRawX = gsap.quickTo(glassesRef.current, "x", { duration: 0.6, ease: "power2.out" });
    const translateRawY = gsap.quickTo(glassesRef.current, "y", { duration: 0.6, ease: "power2.out" });

    // Reflection shine movement
    const reflX = reflectionRef.current ? gsap.quickTo(reflectionRef.current, "x", { duration: 0.4, ease: "power1.out" }) : null;
    const reflY = reflectionRef.current ? gsap.quickTo(reflectionRef.current, "y", { duration: 0.4, ease: "power1.out" }) : null;

    const handleMouseMove = (e: MouseEvent) => {
      // Get container bounding rectangle
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Center point of the glasses container
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Distance from mouse to center
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Normalize offsets (-1 to 1 based on viewport window size)
      const normX = deltaX / (window.innerWidth / 2);
      const normY = deltaY / (window.innerHeight / 2);

      // Max rotation angles (in degrees)
      const maxRotateY = 35; // Yaw (left-right tilt)
      const maxRotateX = 25; // Pitch (up-down tilt)
      const maxRotateZ = 12; // Roll (slight head tilt)

      // Apply rotations (invert Y for natural perspective)
      xTo(normX * maxRotateY);
      yTo(-normY * maxRotateX);
      zTo(normX * normY * maxRotateZ);

      // Subtle positional offset to simulate 3D head movement
      translateRawX(normX * 20);
      translateRawY(normY * 15);

      // Shift lens reflection light effect in the direction of the cursor
      if (reflX && reflY) {
        reflX(normX * 30);
        reflY(normY * 20);
      }
    };

    const handleMouseLeave = () => {
      // Reset smoothly to center when cursor leaves the window
      xTo(0);
      yTo(0);
      zTo(0);
      translateRawX(0);
      translateRawY(0);
      if (reflX && reflY) {
        reflX(0);
        reflY(0);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ perspective: "1000px" }}
    >
      {/* Outer Ambient Glow under glasses */}
      <div className="absolute w-64 h-64 bg-accent-primary/20 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />

      {/* 3D Rotating Container anchored at center */}
      <div
        ref={glassesRef}
        className="relative z-10 flex items-center justify-center transition-shadow duration-300"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Render Vector Glasses SVG with glowing lenses */}
        <div className="relative group cursor-pointer">
          {imageSrc ? (
            <div className="relative flex items-center justify-center p-4">
              {/* Glasses SVG Graphic with glowing lenses */}
              <svg
                width="240"
                height="100"
                viewBox="0 0 240 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-[0_10px_25px_rgba(47,168,255,0.4)]"
              >
                {/* Bridge */}
                <path
                  d="M100 35 Q120 28 140 35"
                  stroke="#2FA8FF"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Left Lens Frame */}
                <path
                  d="M20 25 C45 20 85 20 95 30 C105 40 95 70 85 75 C70 82 35 80 20 70 C10 60 10 35 20 25 Z"
                  fill="url(#leftLensGrad)"
                  stroke="#2FA8FF"
                  strokeWidth="3.5"
                />

                {/* Right Lens Frame */}
                <path
                  d="M145 30 C155 20 195 20 220 25 C230 35 230 60 220 70 C205 80 170 82 155 75 C145 70 135 40 145 30 Z"
                  fill="url(#rightLensGrad)"
                  stroke="#2FA8FF"
                  strokeWidth="3.5"
                />

                {/* Temples (Arms) */}
                <path d="M15 32 L2 28" stroke="#378ADD" strokeWidth="4" strokeLinecap="round" />
                <path d="M225 32 L238 28" stroke="#378ADD" strokeWidth="4" strokeLinecap="round" />

                {/* Gradients */}
                <defs>
                  <linearGradient id="leftLensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0B1528" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#172A4A" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#2FA8FF" stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient id="rightLensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0B1528" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#172A4A" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#2FA8FF" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Dynamic Lens Reflection Highlight */}
              <div
                ref={reflectionRef}
                className="absolute inset-0 pointer-events-none flex justify-around items-center px-8"
              >
                <div className="w-12 h-16 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -rotate-45 rounded-full blur-[2px]" />
                <div className="w-12 h-16 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -rotate-45 rounded-full blur-[2px]" />
              </div>
            </div>
          ) : (
            <Image
              src={imageSrc}
              alt="Glasses Logo"
              width={200}
              height={80}
              className="object-contain drop-shadow-[0_10px_20px_rgba(47,168,255,0.4)]"
            />
          )}
        </div>
      </div>
    </div>
  );
}
