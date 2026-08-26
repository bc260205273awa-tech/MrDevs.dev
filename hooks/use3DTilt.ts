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
      // Mobile-only autonomous sequential corner-tilting loop
      const timelines: gsap.core.Timeline[] = [];

      cards.forEach((el, index) => {
        el.style.transformStyle = "preserve-3d";
        el.style.willChange = "transform";

        // Create individual timeline with staggered initial delay (1 second gap)
        const tl = gsap.timeline({
          repeat: -1,
          delay: index * 1.0,
        });

        const tiltX = maxTilt * 0.7; // gentle move
        const tiltY = maxTilt * 0.7;
        const moveDur = 0.6; // smooth hover speed physics
        const pauseDur = 0.8; // pause to show off the corner depth

        // Rotate corners sequentially: Top-Left -> Top-Right -> Bottom-Right -> Bottom-Left -> Center
        tl
          // 1. Top-Left
          .to(el, {
            rotationY: -tiltX,
            rotationX: tiltY,
            scale: scaleHover,
            transformPerspective: perspective,
            duration: moveDur,
            ease: "power2.out"
          })
          .to({}, { duration: pauseDur })

          // 2. Top-Right
          .to(el, {
            rotationY: tiltX,
            rotationX: tiltY,
            scale: scaleHover,
            transformPerspective: perspective,
            duration: moveDur,
            ease: "power2.out"
          })
          .to({}, { duration: pauseDur })

          // 3. Bottom-Right
          .to(el, {
            rotationY: tiltX,
            rotationX: -tiltY,
            scale: scaleHover,
            transformPerspective: perspective,
            duration: moveDur,
            ease: "power2.out"
          })
          .to({}, { duration: pauseDur })

          // 4. Bottom-Left
          .to(el, {
            rotationY: -tiltX,
            rotationX: -tiltY,
            scale: scaleHover,
            transformPerspective: perspective,
            duration: moveDur,
            ease: "power2.out"
          })
          .to({}, { duration: pauseDur })

          // 5. Back to Flat Center
          .to(el, {
            rotationY: 0,
            rotationX: 0,
            scale: 1,
            duration: moveDur,
            ease: "power2.out"
          })
          // 3 seconds pause before repeating
          .to({}, { duration: 3.0 });

        timelines.push(tl);
      });

      return () => {
        timelines.forEach((tl) => tl.kill());
      };
    }

    // --- Desktop Hover Sizing & Logic ---
    // Entrance 3D flip-in animation for desktop
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
        el.style.transition = "none";
      };

      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);

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
