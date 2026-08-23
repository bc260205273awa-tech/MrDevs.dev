"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Power, Code2 } from "lucide-react";

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

    // Eye Symbol Pupil Movement Setters (Left & Right Lens Symbols)
    const leftPupilX = leftEyeRef.current ? gsap.quickTo(leftEyeRef.current, "x", { duration: 0.3, ease: "power1.out" }) : null;
    const leftPupilY = leftEyeRef.current ? gsap.quickTo(leftEyeRef.current, "y", { duration: 0.3, ease: "power1.out" }) : null;

    const rightPupilX = rightEyeRef.current ? gsap.quickTo(rightEyeRef.current, "x", { duration: 0.3, ease: "power1.out" }) : null;
    const rightPupilY = rightEyeRef.current ? gsap.quickTo(rightEyeRef.current, "y", { duration: 0.3, ease: "power1.out" }) : null;

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
      const maxRotY = 40; // Yaw angle (degrees)
      const maxRotX = 30; // Pitch angle (degrees)
      const maxRotZ = 15; // Roll angle (tilt outward on Z-axis)
      const maxTransZ = 45; // Depth outward tilt toward user

      rotY(normX * maxRotY);
      rotX(-normY * maxRotX);
      rotZ(normX * normY * maxRotZ);
      transZ(Math.abs(normX * normY) * maxTransZ);
      transX(normX * 25);
      transY(normY * 20);

      // --- 2. EYE SYMBOL PUPIL TRACKING ---
      // Symbols shift inside the lenses towards the cursor direction
      const maxPupilShiftX = 18; // px shift inside lens
      const maxPupilShiftY = 14; // px shift inside lens

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
        leftGlareX(-normX * 20);
        leftGlareY(-normY * 15);
      }
      if (rightGlareX && rightGlareY) {
        rightGlareX(-normX * 20);
        rightGlareY(-normY * 15);
      }
    };

    const handleMouseLeave = () => {
      // Smooth reset on mouse leave
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
      className="relative flex items-center justify-center select-none w-full max-w-lg h-64 mx-auto"
      style={{ perspective: "1200px" }}
    >
      {/* Ambient Radial Cyan Backlight */}
      <div className="absolute w-80 h-40 bg-accent-primary/25 rounded-full blur-[90px] pointer-events-none" />

      {/* Main 3D Glasses Frame Container */}
      <div
        ref={frameRef}
        className="relative z-10 flex items-center justify-center transition-shadow duration-300"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Glasses Outer Frame SVG Structure */}
        <div className="relative flex items-center justify-center">
          
          {/* SVG Frame Chassis */}
          <svg
            width="340"
            height="140"
            viewBox="0 0 340 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_15px_35px_rgba(47,168,255,0.45)]"
          >
            {/* Top Bridge */}
            <path
              d="M140 45 Q170 35 200 45"
              stroke="#2FA8FF"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M145 52 Q170 45 195 52"
              stroke="#0B1528"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Left Lens Outer Rim */}
            <path
              d="M25 35 C60 28 120 28 135 42 C150 56 135 98 120 108 C98 120 48 116 25 102 C10 88 10 52 25 35 Z"
              fill="url(#leftLensBg)"
              stroke="#2FA8FF"
              strokeWidth="5"
            />

            {/* Right Lens Outer Rim */}
            <path
              d="M205 42 C220 28 280 28 315 35 C330 52 330 88 315 102 C292 116 242 120 220 108 C205 98 190 56 205 42 Z"
              fill="url(#rightLensBg)"
              stroke="#2FA8FF"
              strokeWidth="5"
            />

            {/* Left Temple Arm */}
            <path d="M20 42 L2 35" stroke="#378ADD" strokeWidth="6" strokeLinecap="round" />
            
            {/* Right Temple Arm */}
            <path d="M320 42 L338 35" stroke="#378ADD" strokeWidth="6" strokeLinecap="round" />

            <defs>
              <linearGradient id="leftLensBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0B1528" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#0F2442" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#1E4575" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="rightLensBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0B1528" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#0F2442" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#1E4575" stopOpacity="0.85" />
              </linearGradient>
            </defs>
          </svg>

          {/* LEFT LENS: Power Symbol "Eye" */}
          <div className="absolute left-[38px] top-[32px] w-[95px] h-[70px] rounded-[30px] overflow-hidden flex items-center justify-center">
            {/* Glass Glare Highlight */}
            <div
              ref={leftGlareRef}
              className="absolute w-12 h-20 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -rotate-45 rounded-full blur-[1px] pointer-events-none z-20"
            />

            {/* Power Eye Icon (Left Pupil) */}
            <div
              ref={leftEyeRef}
              className="relative z-10 flex items-center justify-center p-3 rounded-full bg-accent-primary/10 border border-accent-primary/40 shadow-[0_0_20px_rgba(47,168,255,0.6)] text-accent-cyan"
            >
              <Power className="w-8 h-8 drop-shadow-[0_0_12px_#2FA8FF] stroke-[2.5]" />
            </div>
          </div>

          {/* RIGHT LENS: Coding Symbol "Eye" */}
          <div className="absolute right-[38px] top-[32px] w-[95px] h-[70px] rounded-[30px] overflow-hidden flex items-center justify-center">
            {/* Glass Glare Highlight */}
            <div
              ref={rightGlareRef}
              className="absolute w-12 h-20 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -rotate-45 rounded-full blur-[1px] pointer-events-none z-20"
            />

            {/* Code Eye Icon (Right Pupil) */}
            <div
              ref={rightEyeRef}
              className="relative z-10 flex items-center justify-center p-3 rounded-full bg-accent-primary/10 border border-accent-primary/40 shadow-[0_0_20px_rgba(47,168,255,0.6)] text-accent-cyan"
            >
              <Code2 className="w-8 h-8 drop-shadow-[0_0_12px_#2FA8FF] stroke-[2.5]" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
