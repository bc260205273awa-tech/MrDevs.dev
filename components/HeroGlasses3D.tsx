"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

export default function HeroGlasses3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const leftPupilRef = useRef<HTMLDivElement>(null);
  const rightPupilRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !frameRef.current) return;

    // 3D Frame Rotation & Translation Setters (X, Y, Z)
    const rotY = gsap.quickTo(frameRef.current, "rotateY", { duration: 0.45, ease: "power2.out" });
    const rotX = gsap.quickTo(frameRef.current, "rotateX", { duration: 0.45, ease: "power2.out" });
    const rotZ = gsap.quickTo(frameRef.current, "rotateZ", { duration: 0.55, ease: "power2.out" });
    const transZ = gsap.quickTo(frameRef.current, "z", { duration: 0.45, ease: "power2.out" });
    const transX = gsap.quickTo(frameRef.current, "x", { duration: 0.55, ease: "power2.out" });
    const transY = gsap.quickTo(frameRef.current, "y", { duration: 0.55, ease: "power2.out" });

    // Eye Pupil Movement (Shifts smoothly behind the metallic frame)
    const leftPupilX = leftPupilRef.current ? gsap.quickTo(leftPupilRef.current, "x", { duration: 0.28, ease: "power1.out" }) : null;
    const leftPupilY = leftPupilRef.current ? gsap.quickTo(leftPupilRef.current, "y", { duration: 0.28, ease: "power1.out" }) : null;

    const rightPupilX = rightPupilRef.current ? gsap.quickTo(rightPupilRef.current, "x", { duration: 0.28, ease: "power1.out" }) : null;
    const rightPupilY = rightPupilRef.current ? gsap.quickTo(rightPupilRef.current, "y", { duration: 0.28, ease: "power1.out" }) : null;

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

      // --- FULL 3D FRAME TILT ---
      const maxRotY = 32; // Yaw
      const maxRotX = 24; // Pitch
      const maxRotZ = 10; // Roll
      const maxTransZ = 45; // Depth toward user

      rotY(normX * maxRotY);
      rotX(-normY * maxRotX);
      rotZ(normX * normY * maxRotZ);
      transZ(Math.abs(normX * normY) * maxTransZ);
      transX(normX * 18);
      transY(normY * 14);

      // --- EYE PUPIL TRACKING ---
      const maxPupilShiftX = 8; 
      const maxPupilShiftY = 6;

      if (leftPupilX && leftPupilY) {
        leftPupilX(normX * maxPupilShiftX);
        leftPupilY(normY * maxPupilShiftY);
      }
      if (rightPupilX && rightPupilY) {
        rightPupilX(normX * maxPupilShiftX);
        rightPupilY(normY * maxPupilShiftY);
      }

      if (bgGlowX && bgGlowY) {
        bgGlowX(normX * 25);
        bgGlowY(normY * 16);
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
      if (bgGlowX && bgGlowY) {
        bgGlowX(0);
        bgGlowY(0);
      }
    };

    // Autonomous Idle Animation (for mobile/touch devices where there is no mouse)
    let idleAnimation: gsap.core.Timeline | null = null;
    
    if (window.matchMedia("(pointer: coarse)").matches) {
      const maxShiftX = 8;
      const maxShiftY = 6;
      
      // Simulate human eye wandering
      idleAnimation = gsap.timeline({ repeat: -1, delay: 1 });
      
      const createWanderStep = () => {
        // Random normalized positions (-1 to 1)
        const nx = (Math.random() - 0.5) * 2;
        const ny = (Math.random() - 0.5) * 2;
        
        // Sometimes dart quickly (saccade), sometimes drift smoothly
        const isSaccade = Math.random() > 0.6;
        const duration = isSaccade ? 0.15 + Math.random() * 0.1 : 0.8 + Math.random() * 1.5;
        const ease = isSaccade ? "power2.out" : "sine.inOut";
        const pause = isSaccade ? 0.2 + Math.random() * 0.5 : 0;
        
        idleAnimation!.to([leftPupilRef.current, rightPupilRef.current], {
          x: nx * maxShiftX,
          y: ny * maxShiftY,
          duration,
          ease,
        });
        
        // Tiny 3D head movement to match eyes
        idleAnimation!.to(frameRef.current, {
          rotateY: nx * 12,
          rotateX: -ny * 8,
          x: nx * 5,
          y: ny * 3,
          duration: duration * 1.2,
          ease,
        }, "<");
        
        idleAnimation!.to({}, { duration: pause });
      };

      // Create a sequence of 10 random eye movements that loop
      for (let i = 0; i < 10; i++) {
        createWanderStep();
        // Occasionally return to center
        if (i % 3 === 0) {
          idleAnimation.to([leftPupilRef.current, rightPupilRef.current], { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
          idleAnimation.to(frameRef.current, { rotateY: 0, rotateX: 0, x: 0, y: 0, duration: 0.4, ease: "power2.out" }, "<");
          idleAnimation.to({}, { duration: 1 + Math.random() });
        }
      }
    } else {
      // Only attach mouse listeners on devices that actually have a fine pointer
      window.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (idleAnimation) idleAnimation.kill();
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
        {/* Layer 1: Left Eye Pupil (</> Code Symbol) */}
        <div
          ref={leftPupilRef}
          className="absolute inset-0 pointer-events-none drop-shadow-[0_0_15px_rgba(47,168,255,0.85)] z-10"
        >
          <Image
            src="/hero-symbol-code.png"
            alt="Left Eye Pupil"
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* Layer 2: Right Eye Pupil (⏻ Power Symbol) */}
        <div
          ref={rightPupilRef}
          className="absolute inset-0 pointer-events-none drop-shadow-[0_0_15px_rgba(0,212,255,0.85)] z-10"
        >
          <Image
            src="/hero-symbol-power.png"
            alt="Right Eye Pupil"
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* Layer 3: Pristine Clean Metallic Glasses Frame on Top (Frame occludes pupils naturally) */}
        <div className="absolute inset-0 pointer-events-none z-20">
          <Image
            src="/hero-glasses-frame.png"
            alt="MrDevs Clean Glasses Frame"
            fill
            priority
            className="object-contain"
          />
        </div>

      </div>
    </div>
  );
}
