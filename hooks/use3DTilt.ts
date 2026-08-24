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

    // Only apply on hover-capable devices
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
      return;
    }

    const cards = containerRef.current.querySelectorAll<HTMLElement>(selector);
    if (!cards.length) return;

    // Entrance 3D flip-in animation
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

      const onEnter = () => {
        initialTransition = el.style.transition;
        // Temporarily disable CSS transitions on transform to prevent lag
        el.style.transition = "none";
      };

      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2); // -1 to 1
        const dy = (e.clientY - cy) / (rect.height / 2); // -1 to 1

        gsap.to(el, {
          rotationY: dx * maxTilt,
          rotationX: -dy * maxTilt,
          scale: scaleHover,
          transformPerspective: perspective,
          ease: "power2.out",
          duration: 0.22,
          overwrite: "auto",
        });
      };

      const onLeave = () => {
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
