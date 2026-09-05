import { useEffect, RefObject } from "react";
import gsap from "gsap";

/**
 * use3DTilt — Attaches high-performance GSAP 3D tilt with perspective, lift & elastic spring-back.
 *
 * @param containerRef  The ref wrapping all the tiltable cards/elements
 * @param selector      CSS selector for target elements (default: ".tilt-card")
 * @param maxTilt       Max degrees of tilt in X/Y (default: 16)
 * @param perspective   CSS perspective depth in px (default: 800)
 * @param scaleHover    Scale factor on hover (default: 1.025)
 */
export function use3DTilt(
  containerRef: RefObject<HTMLElement | null>,
  selector: string = ".tilt-card",
  maxTilt: number = 16,
  perspective: number = 800,
  scaleHover: number = 1.025
) {
  useEffect(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll<HTMLElement>(selector);
    if (!cards.length) return;

    // Check if the device is a touch/mobile device (no fine pointer/hover capability)
    const isMobile = typeof window !== "undefined" && (
      window.matchMedia("(pointer: coarse)").matches || 
      window.matchMedia("(hover: none)").matches
    );

    if (isMobile) {
      // Mobile: autonomous sequential corner-tilting loop ONLY when card is in view
      const timelines = new Map<HTMLElement, gsap.core.Timeline>();

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const el = entry.target as HTMLElement;
            if (entry.isIntersecting) {
              if (!timelines.has(el)) {
                el.style.transformStyle = "preserve-3d";
                el.style.willChange = "transform";

                const tl = gsap.timeline({ repeat: -1 });
                const tiltX = maxTilt * 0.7;
                const tiltY = maxTilt * 0.7;
                const moveDur = 0.6;
                const pauseDur = 0.8;

                tl.to(el, {
                  rotationY: -tiltX,
                  rotationX: tiltY,
                  scale: scaleHover,
                  transformPerspective: perspective,
                  duration: moveDur,
                  ease: "power2.out"
                })
                .to({}, { duration: pauseDur })
                .to(el, {
                  rotationY: tiltX,
                  rotationX: tiltY,
                  scale: scaleHover,
                  transformPerspective: perspective,
                  duration: moveDur,
                  ease: "power2.out"
                })
                .to({}, { duration: pauseDur })
                .to(el, {
                  rotationY: tiltX,
                  rotationX: -tiltY,
                  scale: scaleHover,
                  transformPerspective: perspective,
                  duration: moveDur,
                  ease: "power2.out"
                })
                .to({}, { duration: pauseDur })
                .to(el, {
                  rotationY: -tiltX,
                  rotationX: -tiltY,
                  scale: scaleHover,
                  transformPerspective: perspective,
                  duration: moveDur,
                  ease: "power2.out"
                })
                .to({}, { duration: pauseDur })
                .to(el, {
                  rotationY: 0,
                  rotationX: 0,
                  scale: 1,
                  duration: moveDur,
                  ease: "power2.out"
                })
                .to({}, { duration: 3.0 });

                timelines.set(el, tl);
              } else {
                timelines.get(el)?.play();
              }
            } else {
              timelines.get(el)?.pause();
            }
          });
        },
        { threshold: 0.15 }
      );

      cards.forEach((el) => observer.observe(el));

      return () => {
        observer.disconnect();
        timelines.forEach((tl) => tl.kill());
        timelines.clear();
      };
    }

    // --- Desktop Hover Sizing & Logic ---
    gsap.fromTo(
      Array.from(cards),
      {
        opacity: 0,
        rotationX: 25,
        y: 24,
        transformOrigin: "center center",
        transformPerspective: perspective,
      },
      {
        opacity: 1,
        rotationX: 0,
        y: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "opacity,y,transformOrigin",
      }
    );

    const cleanupList: (() => void)[] = [];

    cards.forEach((el) => {
      el.style.transformStyle = "preserve-3d";
      el.style.willChange = "transform";

      let initialTransition = "";
      let cachedRect: DOMRect | null = null;
      let rafId: number | null = null;

      const onEnter = () => {
        initialTransition = el.style.transition;
        el.style.transition = "none";
        cachedRect = el.getBoundingClientRect();
      };

      const onMove = (e: MouseEvent) => {
        if (!cachedRect) {
          cachedRect = el.getBoundingClientRect();
        }
        if (!cachedRect.width || !cachedRect.height) return;

        const cx = cachedRect.left + cachedRect.width / 2;
        const cy = cachedRect.top + cachedRect.height / 2;
        const dx = (e.clientX - cx) / (cachedRect.width / 2);
        const dy = (e.clientY - cy) / (cachedRect.height / 2);

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          gsap.to(el, {
            rotationY: dx * maxTilt,
            rotationX: -dy * maxTilt,
            scale: scaleHover,
            transformPerspective: perspective,
            ease: "power2.out",
            duration: 0.22,
            overwrite: "auto",
          });
        });
      };

      const onLeave = () => {
        if (rafId) cancelAnimationFrame(rafId);
        cachedRect = null;
        el.style.transition = initialTransition;
        gsap.to(el, {
          rotationY: 0,
          rotationX: 0,
          scale: 1,
          duration: 0.75,
          ease: "elastic.out(1.1, 0.4)",
          overwrite: "auto",
        });
      };

      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);

      cleanupList.push(() => {
        if (rafId) cancelAnimationFrame(rafId);
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => {
      cleanupList.forEach((fn) => fn());
    };
  }, [containerRef, selector, maxTilt, perspective, scaleHover]);
}
