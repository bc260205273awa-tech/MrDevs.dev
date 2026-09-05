"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FRAME_COUNT = 90;

export default function LogoReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(FRAME_COUNT).fill(null));
  const hasStartedLoading = useRef(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Check prefers-reduced-motion on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setIsReducedMotion(mediaQuery.matches);
    }
  }, []);

  // Progressive batch frame preloader
  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const basePath = isMobile ? "/frames/logo-reveal/mobile" : "/frames/logo-reveal";

    // 1. Immediately load initial poster frame (frame-0001.webp)
    const posterImg = new Image();
    posterImg.src = `${basePath}/frame-0001.webp`;
    posterImg.onload = () => {
      imagesRef.current[0] = posterImg;
      setIsReady(true);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStartedLoading.current) {
          hasStartedLoading.current = true;

          // Priority queue: Keyframes first (every 2nd frame), then the rest
          const keyframeIndices: number[] = [];
          const secondaryIndices: number[] = [];

          for (let i = 1; i <= FRAME_COUNT; i++) {
            if (i % 2 === 1) keyframeIndices.push(i);
            else secondaryIndices.push(i);
          }

          const loadQueue = [...keyframeIndices, ...secondaryIndices];
          let currentIndex = 0;
          const BATCH_SIZE = 4;

          const loadNextBatch = () => {
            if (currentIndex >= loadQueue.length) {
              setTimeout(() => ScrollTrigger.refresh(), 100);
              return;
            }

            const batch = loadQueue.slice(currentIndex, currentIndex + BATCH_SIZE);
            currentIndex += BATCH_SIZE;

            let batchRemaining = batch.length;
            batch.forEach((frameNum) => {
              const idx = frameNum - 1;
              if (imagesRef.current[idx]) {
                batchRemaining--;
                if (batchRemaining === 0) loadNextBatch();
                return;
              }

              const img = new Image();
              img.src = `${basePath}/frame-${frameNum.toString().padStart(4, "0")}.webp`;
              img.onload = img.onerror = () => {
                imagesRef.current[idx] = img;
                batchRemaining--;
                if (batchRemaining === 0) {
                  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
                    (window as any).requestIdleCallback(loadNextBatch, { timeout: 200 });
                  } else {
                    setTimeout(loadNextBatch, 30);
                  }
                }
              };
            });
          };

          loadNextBatch();
        }
      },
      { rootMargin: "400px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useGSAP(() => {
    if (!canvasRef.current || !containerRef.current || !sectionRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
    const frameState = { frame: isReducedMotion ? 45 : 1 };
    
    // Draw frame using nearest loaded image fallback
    const renderFrame = (index: number) => {
      const safeIndex = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(index) - 1));
      let img = imagesRef.current[safeIndex];

      // Fallback to nearest loaded frame for zero-jank scrub
      if (!img) {
        for (let offset = 1; offset < FRAME_COUNT; offset++) {
          if (safeIndex - offset >= 0 && imagesRef.current[safeIndex - offset]) {
            img = imagesRef.current[safeIndex - offset];
            break;
          }
          if (safeIndex + offset < FRAME_COUNT && imagesRef.current[safeIndex + offset]) {
            img = imagesRef.current[safeIndex + offset];
            break;
          }
        }
      }

      if (!img || !img.complete || !img.naturalWidth) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      
      const imgAspect = img.width / img.height;
      const canvasAspect = width / height;
      
      let drawWidth = width;
      let drawHeight = height;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasAspect > imgAspect) {
        drawHeight = width / imgAspect;
        offsetY = (height - drawHeight) / 2;
      } else {
        drawWidth = height * imgAspect;
        offsetX = (width - drawWidth) / 2;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      ctx.setTransform(1, 0, 0, 1, 0, 0); 
      ctx.scale(dpr, dpr);
      
      renderFrame(frameState.frame);
    };

    window.addEventListener("resize", resizeCanvas, { passive: true });
    resizeCanvas();

    if (isReducedMotion) {
      renderFrame(45);
      return () => window.removeEventListener("resize", resizeCanvas);
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: containerRef.current,
        start: "top top",
        end: "+=2000",
        scrub: 0.8,
      }
    });

    tl.to(frameState, {
      frame: FRAME_COUNT,
      ease: "none",
      onUpdate: () => renderFrame(frameState.frame)
    });

    return () => window.removeEventListener("resize", resizeCanvas);
  }, { scope: sectionRef, dependencies: [isReducedMotion, isReady] });

  return (
    <section ref={sectionRef} className="relative bg-[#0a0f1a]">
      <div ref={containerRef} className="h-screen w-full overflow-hidden relative flex items-center justify-center">
        <canvas 
          ref={canvasRef} 
          className={`absolute inset-0 z-0 transition-opacity duration-700 ${isReady ? "opacity-100" : "opacity-0"}`}
        />
      </div>
    </section>
  );
}
