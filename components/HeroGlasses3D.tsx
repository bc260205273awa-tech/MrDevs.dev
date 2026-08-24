"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

export default function HeroGlasses3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !frameRef.current) return;

    // 3D Frame Rotation & Translation Setters (X, Y, Z)
    const rotY = gsap.quickTo(frameRef.current, "rotateY", { duration: 0.5, ease: "power2.out" });
    const rotX = gsap.quickTo(frameRef.current, "rotateX", { duration: 0.5, ease: "power2.out" });
    const rotZ = gsap.quickTo(frameRef.current, "rotateZ", { duration: 0.6, ease: "power2.out" });
    const transZ = gsap.quickTo(frameRef.current, "z", { duration: 0.5, ease: "power2.out" });
    const transX = gsap.quickTo(frameRef.current, "x", { duration: 0.6, ease: "power2.out" });
    const transY = gsap.quickTo(frameRef.current, "y", { duration: 0.6, ease: "power2.out" });

    // Eye Symbol Pupil Movement Setters (Left </> and Right ⏻)
    const leftPupilX = leftEyeRef.current ? gsap.quickTo(leftEyeRef.current, "x", { duration: 0.28, ease: "power1.out" }) : null;
    const leftPupilY = leftEyeRef.current ? gsap.quickTo(leftEyeRef.current, "y", { duration: 0.28, ease: "power1.out" }) : null;

    const rightPupilX = rightEyeRef.current ? gsap.quickTo(rightEyeRef.current, "x", { duration: 0.28, ease: "power1.out" }) : null;
    const rightPupilY = rightEyeRef.current ? gsap.quickTo(rightEyeRef.current, "y", { duration: 0.28, ease: "power1.out" }) : null;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const normX = deltaX / (window.innerWidth / 2);
      const normY = deltaY / (window.innerHeight / 2);

      // --- 1. 3D ROTATION & DEPTH ---
      const maxRotY = 32;
      const maxRotX = 24;
      const maxRotZ = 10;
      const maxTransZ = 45;

      rotY(normX * maxRotY);
      rotX(-normY * maxRotX);
      rotZ(normX * normY * maxRotZ);
      transZ(Math.abs(normX * normY) * maxTransZ);
      transX(normX * 18);
      transY(normY * 14);

      // --- 2. EYE SYMBOL PUPIL TRACKING ---
      const maxPupilShiftX = 18;
      const maxPupilShiftY = 14;

      if (leftPupilX && leftPupilY) {
        leftPupilX(normX * maxPupilShiftX);
        leftPupilY(normY * maxPupilShiftY);
      }
      if (rightPupilX && rightPupilY) {
        rightPupilX(normX * maxPupilShiftX);
        rightPupilY(normY * maxPupilShiftY);
      }
    };

    const handleMouseLeave = () => {
      rotY(0);
      rotX(0);
      rotZ(0);
      transZ(0);
      transX(0);
      transY(0);

      if (leftPupilX && leftPupilY) {
        leftPupilX(0);
        leftPupilY(0);
      }
      if (rightPupilX && rightPupilY) {
        rightPupilX(0);
        rightPupilY(0);
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
      {/* Ambient Radial Cyan Backlight Glow */}
      <div className="absolute w-[360px] sm:w-[420px] h-[180px] bg-accent-primary/20 rounded-full blur-[90px] pointer-events-none" />

      {/* Main 3D Glasses Frame Container */}
      <div
        ref={frameRef}
        className="relative z-10 flex items-center justify-center w-full max-w-[420px] sm:max-w-[480px] aspect-[598/225]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Layer 0: Dark lens glass floor */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <Image
            src="/hero-lens-backing.png"
            alt="Lens Glass"
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* Layer 1: Left Eye Pupil (</> Code Symbol) */}
        <div
          ref={leftEyeRef}
          className="absolute inset-0 pointer-events-none drop-shadow-[0_0_20px_rgba(47,168,255,0.9)] z-10"
        >
          <Image
            src="/hero-symbol-code.png"
            alt="Code Symbol Pupil"
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* Layer 2: Right Eye Pupil (⏻ Power Symbol) */}
        <div
          ref={rightEyeRef}
          className="absolute inset-0 pointer-events-none drop-shadow-[0_0_20px_rgba(0,212,255,0.9)] z-10"
        >
          <Image
            src="/hero-symbol-power.png"
            alt="Power Symbol Pupil"
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* Layer 3: Clean Metallic Outer Chassis Frame */}
        <div className="absolute inset-0 pointer-events-none drop-shadow-[0_15px_35px_rgba(47,168,255,0.45)] z-20">
          <Image
            src="/hero-glasses-frame.png"
            alt="MrDevs Metallic Glasses Frame"
            fill
            priority
            className="object-contain"
          />
        </div>

      </div>
    </div>
  );
}
