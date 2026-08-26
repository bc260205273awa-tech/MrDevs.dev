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
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
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

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Ambient floating movement
        p.x += p.vx;
        p.y += p.vy;

        // If particle is pushed far off screen, respawn it at a random edge
        const margin = 80;
        if (p.x < -margin || p.x > width + margin || p.y < -margin || p.y > height + margin) {
          // Pick a random edge to spawn from
          const edge = Math.floor(Math.random() * 4);
          if (edge === 0) { p.x = Math.random() * width; p.y = 0; }           // top
          else if (edge === 1) { p.x = Math.random() * width; p.y = height; } // bottom
          else if (edge === 2) { p.x = 0; p.y = Math.random() * height; }     // left
          else { p.x = width; p.y = Math.random() * height; }                 // right
          p.vx = (Math.random() - 0.5) * 1.2;
          p.vy = (Math.random() - 0.5) * 1.2;
          p.baseX = p.x;
          p.baseY = p.y;
        }

        // Soft boundary nudge for gentle ambient drift (not mouse-pushed)
        if (p.x < 0) p.vx = Math.abs(p.vx);
        if (p.x > width) p.vx = -Math.abs(p.vx);
        if (p.y < 0) p.vy = Math.abs(p.vy);
        if (p.y > height) p.vy = -Math.abs(p.vy);

        // Calculate distance to mouse cursor
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;

        // Particle reaction range
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = forceDirectionX * force * p.density * 0.6;
          const directionY = forceDirectionY * force * p.density * 0.6;

          // Repel gently away from cursor
          p.x -= directionX;
          p.y -= directionY;

          // Increase brightness / glow near mouse
          const glowAlpha = Math.min(p.alpha + force * 0.5, 1);
          ctx.shadowBlur = 12 * force;
          ctx.shadowColor = "#2FA8FF";

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size + force * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${glowAlpha})`;
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          // Normal ambient state
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${p.alpha})`;
          ctx.fill();
        }

      }

      // Draw subtle glowing dust connections everywhere
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Connect particles if within 90px of each other
          if (dist < 90) {
            let lineAlpha = (1 - dist / 90) * 0.12; // Baseline faint alpha everywhere

            const mouseDistA = Math.sqrt(
              Math.pow(mouse.x - particles[a].x, 2) + Math.pow(mouse.y - particles[a].y, 2)
            );
            
            // Boost brightness if near mouse
            if (mouseDistA < mouse.radius) {
              const force = (1 - mouseDistA / mouse.radius);
              lineAlpha += force * 0.25;
            }

            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.strokeStyle = `rgba(47, 168, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
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
