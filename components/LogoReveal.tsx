"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// 90 frames total extracted via ffmpeg (8 seconds at 11.25fps)
const FRAME_COUNT = 90;

export default function LogoReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const hasStartedLoading = useRef(false);

  // Preload frames when the section approaches the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStartedLoading.current) {
          hasStartedLoading.current = true;
          const loadedImages: HTMLImageElement[] = [];
          let loadedCount = 0;

          // Aggressively download frames into memory
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
      // Trigger loading 1200px before the user scrolls to it
      { rootMargin: "1200px" } 
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useGSAP(() => {
    // Only initialize the canvas scrub if all frames are fully loaded
    if (imagesLoaded < FRAME_COUNT || !canvasRef.current || !containerRef.current || !sectionRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Cap devicePixelRatio at 2x to save mobile GPU memory/performance
    const dpr = Math.min(window.devicePixelRatio || 1, 2); 
    
    // Resize handler for responsive canvas
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      // Reset transform before scaling, otherwise scales compound on resize
      ctx.setTransform(1, 0, 0, 1, 0, 0); 
      ctx.scale(dpr, dpr);
      
      renderFrame(frameState.frame);
    };

    // Draw specific frame using object-cover logic
    const renderFrame = (index: number) => {
      // Math.max/min guarantees we don't request frame -1 or 90+ out of bounds
      const safeIndex = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(index) - 1));
      const img = imagesRef.current[safeIndex];
      if (!img) return;

      const parent = canvas.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();
      
      const imgAspect = img.width / img.height;
      const canvasAspect = width / height;
      
      let drawWidth = width;
      let drawHeight = height;
      let offsetX = 0;
      let offsetY = 0;

      // Emulate CSS object-cover behavior
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

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // GSAP proxy object to animate the frame index
    const frameState = { frame: 1 };

    // Master pinning timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        // Pin the inner wrapper, not the section root, per Phase 5 standard
        pin: containerRef.current,
        start: "top top",
        end: "+=2000",
        scrub: 1, // Smooth dampening
      }
    });

    // Animate from frame 1 to 90 over the pinned duration
    tl.to(frameState, {
      frame: FRAME_COUNT,
      ease: "none",
      onUpdate: () => renderFrame(frameState.frame)
    });

    return () => window.removeEventListener("resize", resizeCanvas);
  }, { dependencies: [imagesLoaded], scope: sectionRef });

  const isLoading = imagesLoaded < FRAME_COUNT;
  const loadingProgress = Math.round((imagesLoaded / FRAME_COUNT) * 100);

  return (
    <section ref={sectionRef} className="relative bg-[#0a0f1a]">
      {/* Pinned inner container */}
      <div ref={containerRef} className="h-screen w-full overflow-hidden relative flex items-center justify-center">
        
        {/* Fallback Loading State */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0f1a]">
            {/* Using the confirmed locked glass tokens */}
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
