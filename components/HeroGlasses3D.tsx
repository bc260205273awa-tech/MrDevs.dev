"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

export default function HeroGlasses3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const leftPupilGlowRef = useRef<HTMLDivElement>(null);
  const rightPupilGlowRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !frameRef.current) return;

    // 3D Frame Rotation & Translation Setters (X, Y, Z)
    const rotY = gsap.quickTo(frameRef.current, "rotateY", { duration: 0.45, ease: "power2.out" });
    const rotX = gsap.quickTo(frameRef.current, "rotateX", { duration: 0.45, ease: "power2.out" });
    const rotZ = gsap.quickTo(frameRef.current, "rotateZ", { duration: 0.55, ease: "power2.out" });
    const transZ = gsap.quickTo(frameRef.current, "z", { duration: 0.45, ease: "power2.out" });
    const transX = gsap.quickTo(frameRef.current, "x", { duration: 0.55, ease: "power2.out" });
    const transY = gsap.quickTo(frameRef.current, "y", { duration: 0.55, ease: "power2.out" });

    // Reactive Pupil Glow Movement (Subtle 3D parallax without layer separation or breaking seams)
    const leftGlowX = leftPupilGlowRef.current ? gsap.quickTo(leftPupilGlowRef.current, "x", { duration: 0.3, ease: "power1.out" }) : null;
    const leftGlowY = leftPupilGlowRef.current ? gsap.quickTo(leftPupilGlowRef.current, "y", { duration: 0.3, ease: "power1.out" }) : null;

    const rightGlowX = rightPupilGlowRef.current ? gsap.quickTo(rightPupilGlowRef.current, "x", { duration: 0.3, ease: "power1.out" }) : null;
    const rightGlowY = rightPupilGlowRef.current ? gsap.quickTo(rightPupilGlowRef.current, "y", { duration: 0.3, ease: "power1.out" }) : null;

    const bgGlowX = glowRef.current ? gsap.quickTo(glowRef.current, "x", { duration: 0.6, ease: "power1.out" }) : null;
    const bgGlowY = glowRef.current ? gsap.quickTo(glowRef.current, "y", { duration: 0.6, ease: "power1.out" }) : null;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const normX = deltaX / (window.innerWidth / 2);
      const normY = deltaY / (window.innerHeight / 2);

      // --- FULL 3D PERSPECTIVE TILT (Never breaks or separates) ---
      const maxRotY = 34; // Yaw
      const maxRotX = 26; // Pitch
      const maxRotZ = 12; // Roll
      const maxTransZ = 55; // Depth toward user

      rotY(normX * maxRotY);
      rotX(-normY * maxRotX);
      rotZ(normX * normY * maxRotZ);
      transZ(Math.abs(normX * normY) * maxTransZ);
      transX(normX * 22);
      transY(normY * 16);

      // --- REACTIVE EYE PUPIL GLOW SHIFT ---
      if (leftGlowX && leftGlowY) {
        leftGlowX(normX * 14);
        leftGlowY(normY * 10);
      }
      if (rightGlowX && rightGlowY) {
        rightGlowX(normX * 14);
        rightGlowY(normY * 10);
      }
      if (bgGlowX && bgGlowY) {
        bgGlowX(normX * 30);
        bgGlowY(normY * 20);
      }
    };

    const handleMouseLeave = () => {
      rotY(0);
      rotX(0);
      rotZ(0);
      transZ(0);
      transX(0);
      transY(0);

      if (leftGlowX && leftGlowY) {
        leftGlowX(0);
        leftGlowY(0);
      }
      if (rightGlowX && rightGlowY) {
        rightGlowX(0);
        rightGlowY(0);
      }
      if (bgGlowX && bgGlowY) {
        bgGlowX(0);
        bgGlowY(0);
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
      className="relative flex items-center justify-center select-none w-full max-w-xl h-[300px] sm:h-[360px] lg:h-[400px] mx-auto"
      style={{ perspective: "1200px" }}
    >
      {/* Ambient Radial Cyan Backlight Glow (Tracks mouse in parallax) */}
      <div
        ref={glowRef}
        className="absolute w-[380px] sm:w-[460px] h-[200px] bg-accent-primary/25 rounded-full blur-[100px] pointer-events-none"
      />

      {/* Main 3D Unified Glasses Frame Container */}
      <div
        ref={frameRef}
        className="relative z-10 flex items-center justify-center w-full max-w-[420px] sm:max-w-[490px] aspect-[598/225] drop-shadow-[0_20px_50px_rgba(47,168,255,0.45)] cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Master Authentic Agency Logo (Seamless & Indestructible in all corners) */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <Image
            src="/hero-logo-full.png"
            alt="MrDevs Official Logo"
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* Dynamic Eye Pupil Glow Highlights (Tracks gaze inside lenses with zero breakage) */}
        <div className="absolute inset-0 flex items-center justify-between px-[15%] pointer-events-none z-20 overflow-hidden">
          {/* Left Lens Glow (</>) */}
          <div className="relative w-[34%] h-[75%] flex items-center justify-center">
            <div
              ref={leftPupilGlowRef}
              className="w-16 h-16 rounded-full bg-accent-primary/30 blur-[12px] mix-blend-screen"
            />
          </div>

          {/* Right Lens Glow (⏻) */}
          <div className="relative w-[34%] h-[75%] flex items-center justify-center">
            <div
              ref={rightPupilGlowRef}
              className="w-16 h-16 rounded-full bg-accent-cyan/30 blur-[12px] mix-blend-screen"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
