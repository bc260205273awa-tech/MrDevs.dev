"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

export default function HeroGlasses3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !frameRef.current) return;

    // 3D Frame Rotation & Translation Setters (X, Y, Z)
    const rotY = gsap.quickTo(frameRef.current, "rotateY", { duration: 0.45, ease: "power2.out" });
    const rotX = gsap.quickTo(frameRef.current, "rotateX", { duration: 0.45, ease: "power2.out" });
    const rotZ = gsap.quickTo(frameRef.current, "rotateZ", { duration: 0.55, ease: "power2.out" });
    const transZ = gsap.quickTo(frameRef.current, "z", { duration: 0.45, ease: "power2.out" });
    const transX = gsap.quickTo(frameRef.current, "x", { duration: 0.55, ease: "power2.out" });
    const transY = gsap.quickTo(frameRef.current, "y", { duration: 0.55, ease: "power2.out" });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const normX = deltaX / (window.innerWidth / 2);
      const normY = deltaY / (window.innerHeight / 2);

      // 3D Frame Rotation
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
    };

    const handleMouseLeave = () => {
      rotY(0);
      rotX(0);
      rotZ(0);
      transZ(0);
      transX(0);
      transY(0);
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
      {/* 3D Container showing ONLY the base glasses layer */}
      <div
        ref={frameRef}
        className="relative z-10 flex items-center justify-center w-full max-w-[420px] sm:max-w-[490px] aspect-[598/225] drop-shadow-[0_20px_50px_rgba(47,168,255,0.45)] cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Base Glasses Frame Layer */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <Image
            src="/hero-glasses-frame.png"
            alt="Base Glasses Frame"
            fill
            priority
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
