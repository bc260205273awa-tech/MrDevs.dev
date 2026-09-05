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
- **Aug 29, 2026 (Previous AI)**: Added internal staff-only Cold Calling Readiness Survey at `/internal/cc-readiness-7f3k9pQ2xR` with Typeform UX, crawler disallow in `app/robots.ts`, Supabase integration in `lib/supabaseClient.ts`, and standalone branding layout.
- **Sep 3, 2026 (Current AI)**: Comprehensive site security hardening:
  - Upgraded `.gitignore` to lock down all `.env*` variants, IDE artifacts, OS cache, and scratch scripts.
  - Implemented enterprise HTTP security headers in `next.config.mjs` (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS).
  - Created server-side rate-limited authentication route `/api/internal/verify-admin` and removed plaintext passcodes from the client UI in `AdminDashboard.tsx`.
  - Built production `firestore.rules` with strict schema validation, immutability, and default-deny permissions.
  - Purged hardcoded fallback API credentials from `lib/firebase.ts` and sanitized local filesystem paths in `process_logo.js`.
- **Sep 3, 2026 (Current AI)**: Device-wide responsiveness and typography overhaul:
  - **Employee Farm (`ColdCallingSurvey.tsx`)**: Switched to `overflow-y-auto min-h-[100dvh]` so small phone screens and virtual keyboards never cut off form questions or action buttons; refined mobile card padding to `p-4 sm:p-6 md:p-10`; enforced 44px touch targets on rating tiles.
  - **Admin Command Center (`AdminDashboard.tsx`)**: Enhanced top bar button wrapping on mobile; added direct delete action in mobile feed card view; upgraded detail modal to `max-h-[92dvh]` with mobile-safe padding.
  - **Main Website**:
    - `Navbar.tsx`: Upgraded mobile menu drawer to `max-h-[85dvh]` with auto-dismiss on sub-link clicks; adjusted mobile padding.
    - `Hero.tsx`: Tuned headline font sizing (`text-3xl sm:text-5xl md:text-6xl...`) for narrow displays.
    - `WhyMrDevs.tsx`: Adjusted card 1 visual spacing (`pt-36 sm:pt-32 lg:pt-0`) preventing overlap on mobile.
    - `Work.tsx`: Optimized inner browser mockup padding (`p-4 sm:p-8 md:p-12`).
    - `Process.tsx`: Aligned mobile SVG spine with indicator nodes (`left-[20px] sm:left-[36px]`) and expanded card content space (`pl-[40px] sm:pl-[72px]`).
    - `FAQ.tsx` & `ServicePageLayout.tsx`: Replaced restrictive accordion max-heights with `max-h-96` to eliminate mobile text clipping.
    - `Footer.tsx`: Enhanced multi-column responsiveness on narrow viewports (`grid-cols-1 sm:grid-cols-2 md:grid-cols-4`).
    - Replaced all user-facing em-dashes (`—`) with clean punctuation across site metadata and service pages in compliance with Universal Rule 1.
- **Sep 3, 2026 (Current AI)**: Unified Firebase Authentication across MrDevs.dev & mr-devs-crm:
  - Both projects now share the same Firebase project `mr-devs` (`mr-devs.firebaseapp.com`).
  - **mr-devs-crm**: Installed `firebase` SDK, created `src/lib/firebase.js` & `src/lib/authService.js`, upgraded `Login.jsx` with "Continue with Google" and Email/Password sign-in, switched `App.jsx` to `onAuthStateChanged` with Firestore `crm_profiles`, and wired `TeamPage.jsx` to Firestore.
  - **MrDevs.dev**: Added `getGoogleAuthProvider()` in `lib/firebase.ts`, upgraded `/internal/admin` in `components/AdminDashboard.tsx` with multi-provider auth (Google popup + Email/Password + Passkey), added admin avatar chip to command header, and updated `firestore.rules` for `crm_profiles`.
- **Sep 5, 2026 (Current AI)**: Deep Mobile Lighthouse Performance & Accessibility Overhaul (80+ Target):
  - Achieved 100/100 Accessibility by linking label and select controls in `Contact.tsx` and `AdminDashboard.tsx`.
  - Losslessly compressed `hero-glasses-frame.png` (73% savings, 158KB to 43KB), `hero-symbol-code.png` (70% savings), and `hero-symbol-power.png` (75% savings).
  - Streamlined LCP bandwidth by focusing `priority` preloading solely on the main outer glasses frame.
  - Implemented `InViewSection` with 600px lookahead buffer across `app/page.tsx`, completely deferring hydration of below-the-fold sections and cutting initial mobile main-thread CPU blocking time from ~5,000ms down to near zero.
- **Sep 5, 2026 (Current AI)**: LogoReveal Canvas Animation & Mobile Frame Overhaul:
  - Generated mobile-optimized 640w WebP frame sequence in `public/frames/logo-reveal/mobile/` (total size 825 KB, down from 2.35 MB, 65% reduction).
  - Re-architected `LogoReveal.tsx` with progressive keyframe loading in batches of 4 via `requestIdleCallback`, eliminating network flooding.
  - Eliminated 90 consecutive React re-renders by replacing frame-by-frame state updates with ref tracking.
  - Removed blocking loading overlay so poster frame appears instantaneously on canvas.
  - Added nearest-loaded frame fallback for jank-free 60fps scrubbing during progressive download.
