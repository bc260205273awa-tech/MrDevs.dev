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
  
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const hasStartedLoading = useRef(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Check prefers-reduced-motion on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setIsReducedMotion(mediaQuery.matches);
    }
  }, []);

  // Preload frames when the section approaches the viewport
  useEffect(() => {
    // 1. Immediately load initial poster frame (frame-0045.webp) for instantaneous rendering
    const posterImg = new Image();
    posterImg.src = `/frames/logo-reveal/frame-0045.webp`;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStartedLoading.current) {
          hasStartedLoading.current = true;
          const loadedImages: HTMLImageElement[] = [];
          let loadedCount = 0;

          // Progressively load all 90 frames
          for (let i = 1; i <= FRAME_COUNT; i++) {
            const img = new Image();
            img.src = `/frames/logo-reveal/frame-${i.toString().padStart(4, '0')}.webp`;
            img.onload = () => {
              loadedCount++;
              setImagesLoaded(loadedCount);
            };
            loadedImages.push(img);
          }
          imagesRef.current = loadedImages;
        }
      },
      { rootMargin: "800px" } 
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

    // Cap devicePixelRatio at 2x to save mobile GPU memory/performance
    const dpr = Math.min(window.devicePixelRatio || 1, 2); 
    const frameState = { frame: isReducedMotion ? 45 : 1 };
    
    // Draw specific frame using object-cover logic
    const renderFrame = (index: number) => {
      const safeIndex = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(index) - 1));
      const img = imagesRef.current[safeIndex];
      if (!img) return;

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

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // If user prefers reduced motion, render static poster frame without pinning timeline
    if (isReducedMotion) {
      renderFrame(45);
      return () => window.removeEventListener("resize", resizeCanvas);
    }

    // Master pinning timeline for normal motion
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: containerRef.current,
        start: "top top",
        end: "+=2000",
        scrub: 1, // Smooth dampening for jank-free scroll scrubbing
      }
    });

    tl.to(frameState, {
      frame: FRAME_COUNT,
      ease: "none",
      onUpdate: () => renderFrame(frameState.frame)
    });

    return () => window.removeEventListener("resize", resizeCanvas);
  }, { scope: sectionRef, dependencies: [isReducedMotion] });

  const isLoading = imagesLoaded < FRAME_COUNT && !isReducedMotion;
  const loadingProgress = Math.round((imagesLoaded / FRAME_COUNT) * 100);

  return (
    <section ref={sectionRef} className="relative bg-[#0a0f1a]">
      {/* Pinned inner container maintaining zero-CLS aspect ratio */}
      <div ref={containerRef} className="h-screen w-full overflow-hidden relative flex items-center justify-center">
        
        {/* Fallback Loading State */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0f1a]">
            <div className="bg-white/5 backdrop-blur-xl border border-white/5 border-t-white/10 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col items-center gap-6">
              <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_12px_rgba(0,212,255,1)]"></span>
              <span className="text-[11px] font-bold text-accent-cyan tracking-[0.2em] uppercase select-none">
                Loading Experience ({loadingProgress}%)
              </span>
            </div>
          </div>
        )}

        {/* Scrub Canvas */}
        <canvas 
          ref={canvasRef} 
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        />
      </div>
    </section>
  );
}
