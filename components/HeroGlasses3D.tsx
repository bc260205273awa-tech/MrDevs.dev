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
  const leftGlareRef = useRef<HTMLDivElement>(null);
  const rightGlareRef = useRef<HTMLDivElement>(null);

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

    // Lens Glare Highlight Movement Setters
    const leftGlareX = leftGlareRef.current ? gsap.quickTo(leftGlareRef.current, "x", { duration: 0.4, ease: "power1.out" }) : null;
    const leftGlareY = leftGlareRef.current ? gsap.quickTo(leftGlareRef.current, "y", { duration: 0.4, ease: "power1.out" }) : null;

    const rightGlareX = rightGlareRef.current ? gsap.quickTo(rightGlareRef.current, "x", { duration: 0.4, ease: "power1.out" }) : null;
    const rightGlareY = rightGlareRef.current ? gsap.quickTo(rightGlareRef.current, "y", { duration: 0.4, ease: "power1.out" }) : null;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Screen & Frame Center
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Cursor offsets
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Normalized coordinates (-1 to 1)
      const normX = deltaX / (window.innerWidth / 2);
      const normY = deltaY / (window.innerHeight / 2);

      // --- 1. FULL 3D ROTATION & DEPTH (X, Y, Z Axis) ---
      const maxRotY = 38; // Yaw angle (degrees)
      const maxRotX = 28; // Pitch angle (degrees)
      const maxRotZ = 12; // Roll angle
      const maxTransZ = 50; // Depth outward tilt toward user

      rotY(normX * maxRotY);
      rotX(-normY * maxRotX);
      rotZ(normX * normY * maxRotZ);
      transZ(Math.abs(normX * normY) * maxTransZ);
      transX(normX * 22);
      transY(normY * 18);

      // --- 2. EYE SYMBOL PUPIL TRACKING ---
      // Shift symbols inside the lenses towards the cursor direction
      const maxPupilShiftX = 20; // px shift inside lens
      const maxPupilShiftY = 16; // px shift inside lens

      if (leftPupilX && leftPupilY) {
        leftPupilX(normX * maxPupilShiftX);
        leftPupilY(normY * maxPupilShiftY);
      }
      if (rightPupilX && rightPupilY) {
        rightPupilX(normX * maxPupilShiftX);
        rightPupilY(normY * maxPupilShiftY);
      }

      // --- 3. LENS GLARE PARALLAX ---
      if (leftGlareX && leftGlareY) {
        leftGlareX(-normX * 24);
        leftGlareY(-normY * 18);
      }
      if (rightGlareX && rightGlareY) {
        rightGlareX(-normX * 24);
        rightGlareY(-normY * 18);
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
      if (leftGlareX && leftGlareY) {
        leftGlareX(0);
        leftGlareY(0);
      }
      if (rightGlareX && rightGlareY) {
        rightGlareX(0);
        rightGlareY(0);
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
      className="relative flex items-center justify-center select-none w-full max-w-2xl h-80 mx-auto"
      style={{ perspective: "1200px" }}
    >
      {/* Ambient Radial Cyan Backlight Glow */}
      <div className="absolute w-[460px] h-[220px] bg-accent-primary/25 rounded-full blur-[110px] pointer-events-none" />

      {/* Main 3D Glasses Frame Container */}
      <div
        ref={frameRef}
        className="relative z-10 flex items-center justify-center w-[480px] sm:w-[540px] md:w-[600px] aspect-[594/219]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Layer 0: Dark lens glass backings with subtle glow */}
        <div className="absolute inset-0 flex items-center justify-between px-[14%] pointer-events-none">
          <div className="w-[36%] h-[78%] rounded-[45%] bg-[#060D1A]/90 shadow-[inset_0_0_25px_rgba(47,168,255,0.25)] blur-[1px]" />
          <div className="w-[36%] h-[78%] rounded-[45%] bg-[#060D1A]/90 shadow-[inset_0_0_25px_rgba(0,212,255,0.25)] blur-[1px]" />
        </div>

        {/* Layer 1: Left Eye Pupil (</> Code Symbol) */}
        <div
          ref={leftEyeRef}
          className="absolute inset-0 pointer-events-none drop-shadow-[0_0_18px_rgba(47,168,255,0.85)] z-10"
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
          className="absolute inset-0 pointer-events-none drop-shadow-[0_0_18px_rgba(0,212,255,0.85)] z-10"
        >
          <Image
            src="/hero-symbol-power.png"
            alt="Power Symbol Pupil"
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* Layer 3: Realistic Metallic Glasses Outer Frame */}
        <div className="absolute inset-0 pointer-events-none drop-shadow-[0_20px_45px_rgba(47,168,255,0.5)] z-20">
          <Image
            src="/hero-glasses-frame.png"
            alt="MrDevs Metallic Glasses Frame"
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* Layer 4: Interactive Glass Reflections & Glare */}
        <div className="absolute inset-0 flex items-center justify-between px-[14%] pointer-events-none z-30 overflow-hidden">
          {/* Left Lens Glare */}
          <div className="relative w-[36%] h-[78%] rounded-[45%] overflow-hidden">
            <div
              ref={leftGlareRef}
              className="absolute -top-1/2 -left-1/2 w-full h-[200%] bg-gradient-to-r from-transparent via-white/25 to-transparent transform -rotate-45 blur-[3px]"
            />
          </div>

          {/* Right Lens Glare */}
          <div className="relative w-[36%] h-[78%] rounded-[45%] overflow-hidden">
            <div
              ref={rightGlareRef}
              className="absolute -top-1/2 -left-1/2 w-full h-[200%] bg-gradient-to-r from-transparent via-white/25 to-transparent transform -rotate-45 blur-[3px]"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
