"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  size: number;
  density: number;
  alpha: number;
  color: string;
}

export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 180, // Interaction radius around cursor
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    // Color palette for glowing dust particles
    const colors = [
      "rgba(47, 168, 255, ",   // Accent Cyan
      "rgba(55, 138, 221, ",   // Secondary Blue
      "rgba(133, 183, 235, ",  // Light Cyan Glow
      "rgba(255, 255, 255, ",  // Soft White Highlight
    ];

    let particles: Particle[] = [];
    const particleCount = Math.min(Math.floor((width * height) / 12000), 110);

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 2.5 + 0.8;
        const x = Math.random() * width;
        const y = Math.random() * height;
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 2.5,
          vy: (Math.random() - 0.5) * 2.5,
          baseX: x,
          baseY: y,
          size,
          density: Math.random() * 20 + 5,
          alpha: Math.random() * 0.6 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    initParticles();

    let isVisible = true;

    // Render loop
    const render = () => {
      if (!isVisible) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Ambient floating movement (exact speed preserved)
        p.x += p.vx;
        p.y += p.vy;

        // Wrap seamlessly
        const margin = 50;
        if (p.x < -margin) p.x = width + margin;
        if (p.x > width + margin) p.x = -margin;
        if (p.y < -margin) p.y = height + margin;
        if (p.y > height + margin) p.y = -margin;

        // Calculate distance to mouse cursor
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        
        // Fast bounding box check before sqrt
        if (Math.abs(dx) < mouse.radius && Math.abs(dy) < mouse.radius) {
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const directionX = forceDirectionX * force * p.density * 0.6;
            const directionY = forceDirectionY * force * p.density * 0.6;

            // Repel gently away from cursor
            p.x -= directionX;
            p.y -= directionY;

            // Performant GPU hardware glow (replaces CPU-heavy shadowBlur)
            const glowAlpha = Math.min(p.alpha + force * 0.5, 1);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size + force * 4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(47, 168, 255, ${force * 0.35})`;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size + force * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `${p.color}${glowAlpha})`;
            ctx.fill();
            continue;
          }
        }

        // Normal ambient state
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();
      }

      // Draw subtle glowing dust connections (optimized bounding-box distance check)
      const maxDist = 90;
      const maxDistSq = 8100; // 90 * 90

      for (let a = 0; a < particles.length; a++) {
        const pa = particles[a];
        for (let b = a + 1; b < particles.length; b++) {
          const pb = particles[b];
          const dx = pa.x - pb.x;
          if (dx > maxDist || dx < -maxDist) continue;
          const dy = pa.y - pb.y;
          if (dy > maxDist || dy < -maxDist) continue;

          const distSq = dx * dx + dy * dy;
          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            let lineAlpha = (1 - dist / maxDist) * 0.12;

            const mdx = mouse.x - pa.x;
            const mdy = mouse.y - pa.y;
            if (Math.abs(mdx) < mouse.radius && Math.abs(mdy) < mouse.radius) {
              const mouseDistA = Math.sqrt(mdx * mdx + mdy * mdy);
              if (mouseDistA < mouse.radius) {
                const force = (1 - mouseDistA / mouse.radius);
                lineAlpha += force * 0.25;
              }
            }

            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.strokeStyle = `rgba(47, 168, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Pause rendering when offscreen or tab is backgrounded
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        if (!isVisible) {
          isVisible = true;
          animationFrameId = requestAnimationFrame(render);
        }
      } else {
        isVisible = false;
        cancelAnimationFrame(animationFrameId);
      }
    });

    observer.observe(canvas);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isVisible = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        isVisible = true;
        animationFrameId = requestAnimationFrame(render);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Defer initial render until hydration settles
    animationFrameId = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none w-full h-full"
    />
  );
}
