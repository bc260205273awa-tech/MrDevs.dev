# AI SYSTEM DIRECTIVE & PROJECT MEMORY

> **CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
> 1. **READ THIS FIRST**: You must read and understand this file before writing or modifying any code in this repository.
> 2. **UPDATE THIS LAST**: When you complete a major task, add a new section, or change core logic, **YOU MUST UPDATE THIS FILE**. Log your changes in the Changelog and update the Architecture rules. You are part of an unbroken chain of AI assistants—pass your knowledge forward so the next AI doesn't break your work.

---

## 1. Project Story & Context
This is **MrDevs.dev**, a high-end, highly interactive agency/portfolio website built with Next.js, Tailwind CSS, and GSAP. 
The core philosophy of this site is **smoothness and responsiveness**. Every element must feel alive, but it must work perfectly on both high-end desktops (using mouse hovers) and mobile phones (using automated loops).

## 2. Universal Rules
- **No AI speak in UI**: Never use em-dashes (`—`) or overly formal "AI-sounding" text in the user-facing typography.
- **Mobile vs Desktop Separation**: If a feature relies on a mouse (like hover tilts or mouse-tracking eyes), you MUST write a fallback animation for mobile/touch devices.
- **Small Commits**: Test things locally and commit in small, verifiable steps.

## 3. Core Architecture & Custom Behaviors (DO NOT REVERT)
If you are asked to modify these components, respect these established rules:

- **HeroGlasses3D.tsx**: The eyes have a custom sequence (Left -> Right -> Up -> Down). This sequence plays **by default** on all devices on load. It only gets canceled and replaced by mouse-tracking if physical `mousemove` events are detected. Do not break this fallback.
- **HeroParticles.tsx**: Particle speed is ~2.5. We use a **seamless wrap-around** effect (if a particle goes off the right edge, it teleports to the left). Do NOT use bounce-off-wall or random-respawn logic, as it leaves the screen empty.
- **use3DTilt.ts**: This single hook powers ALL 3D cards on the site (Services, Process, Why Us, etc.). On desktop, it tracks mouse movement. On mobile, it runs an **automated wave loop** where corners tilt one by one with a staggered delay based on the card's index.
- **Process.tsx**: The scroll-triggered SVG timeline relies on a dark background guide path (`gsap-desktop-path-bg`). This ensures the bright active line "glows up from the dark." Path lengths are calculated individually for mobile and desktop.

## 4. AI Changelog
*When you make a structural change, log it here for the next AI.*

- **Aug 27, 2026 (Previous AI)**: Created `AI_MEMORY.md`. Established seamless wrap-around for particles, automated eye-tracking fallback for mobile, and fixed Process timeline scroll trigger lengths.
- **Aug 29, 2026 (Current AI)**: Added internal staff-only Cold Calling Readiness Survey at `/internal/cc-readiness-7f3k9pQ2xR` with Typeform UX, crawler disallow in `app/robots.ts`, Supabase integration in `lib/supabaseClient.ts`, and standalone branding layout.
