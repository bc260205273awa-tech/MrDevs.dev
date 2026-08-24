import { useEffect, RefObject } from "react";
import gsap from "gsap";

/**
 * use3DTilt — Attaches GSAP-powered 3D card tilt on mousemove + elastic spring-back on mouseleave.
 * Also runs a flip-in entrance animation (rotationX from 25° → 0°) staggered across all cards.
 *
 * @param containerRef  The ref wrapping all the tiltable cards
 * @param selector      CSS selector for the card elements within the container (default: ".tilt-card")
 * @param maxTilt       Max degrees of tilt in any direction (default: 6)
 * @param perspective   CSS perspective depth in px (default: 1200)
 */
export function use3DTilt(
  containerRef: RefObject<HTMLElement | null>,
  selector: string = ".tilt-card",
  maxTilt: number = 6,
  perspective: number = 1200
) {
  useEffect(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll<HTMLElement>(selector);
    if (!cards.length) return;

    // --- Entrance: flip up from 3D ---
    gsap.fromTo(
      Array.from(cards),
      {
        opacity: 0,
        rotationX: 25,
        y: 30,
        transformOrigin: "top center",
        transformPerspective: 900,
      },
      {
        opacity: 1,
        rotationX: 0,
        y: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.1,
      }
    );

    // --- Hover: 3D tilt ---
    const handlers: { el: HTMLElement; move: (e: MouseEvent) => void; leave: () => void }[] = [];

    cards.forEach((el) => {
      const move = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        gsap.to(el, {
          rotationY: dx * maxTilt,
          rotationX: -dy * maxTilt,
          transformPerspective: perspective,
          ease: "power1.out",
          duration: 0.3,
        });
      };

      const leave = () => {
        gsap.to(el, {
          rotationY: 0,
          rotationX: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.5)",
        });
      };

      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", leave);
      handlers.push({ el, move, leave });
    });

    return () => {
      handlers.forEach(({ el, move, leave }) => {
        el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, [containerRef, selector, maxTilt, perspective]);
}
