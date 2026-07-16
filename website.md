# LAARISH FounderOS – Website Plan & Execution Strategy

This document outlines the implementation strategy for creating the **LAARISH FounderOS** premium 3D landing page and integrating PWA distribution.

---

## Phase 1: Dependency Setup & Architecture (Current)
1. **Install Three.js**: Add `three` and `@types/three` to build the custom interactive 3D elements without bloated frameworks.
2. **Setup PWA Capabilities**: Update the PWA configuration to enable correct service worker caching for offline access.
3. **Route Re-mapping**:
   - `/`: Public ultra-luxury 3D landing page. If a user is already signed in, automatically redirect to `/dashboard`.
   - `/dashboard`: Private dashboard interface.
   - Update redirection paths in `/login`, `/signup`, `/onboarding`, and secondary screens.

---

## Phase 2: Design System & Styling
1. **Premium Fonts**: Import **Bodoni Moda** (luxury serif) for headers and **Jost** (clean, geometric sans-serif) for body text.
2. **Color Palette (Liquid Glass)**:
   - Primary Dark: `#1C1917` (Premium Charcoal/Stone)
   - Accent Gold: `#A16207` (Luxury Gold, WCAG compliant)
   - Background Light: `#FAFAF9` (Off-white luxury texture)
   - Muted/Border: `#E8ECF0` & `#D6D3D1`
3. **Key Visual Effects**:
   - Translucent glass panels (`backdrop-filter: blur(20px)`).
   - Animated glowing orbs in the background.
   - Smooth transitions for hover and interactive actions.

---

## Phase 3: Premium Image Asset Generation
Generate customized visual assets using AI image generation to represent the brand:
- **Logo**: Sleek luxury insignia for LAARISH FounderOS.
- **Founder Book Cover**: Black leather and gold embossed phygital book cover.
- **Ecosystem Graphics**: Artistic illustrations showing the convergence of AI mentors, academy, community, and funding.

---

## Phase 4: Core Landing Page Development
Create `src/app/landing/LandingPage.tsx` with:
1. **Interactive 3D WebGL Canvas**:
   - Render a floating, morphing 3D model of the **Founder Book** inside a canvas.
   - Integrate mouse-pointer physics to tilt the book dynamically and disperse particles on hover.
   - Restrict DPR to `Math.min(window.devicePixelRatio, 2)` for optimal performance.
2. **Hero Section**: Strong value proposition, luxury CTA button, and interactive startup tracker stats.
3. **Bento Grid Presentation**:
   - **The 15-Stage Journey**: Display the stages of building a startup sequentially.
   - **AI Mentors Room**: Showcase the different mentors.
   - **Startup Academy & Funding Hub**: Detailed tabs describing Karnataka ELEVATE, Startup India, BIRAC, etc.
   - **Ecosystem Toolkit**: List of AI generation modules.
4. **PWA Download Center**:
   - Capture `beforeinstallprompt` browser event.
   - Offer a one-click install button that prompts native installation.
   - Implement custom tooltip/modal instructions for iOS users (Safari "Add to Home Screen").

---

## Phase 5: Verification & Testing
1. **Lint Verification**: Ensure clean compiles.
2. **Responsive Checks**: Optimize layout for mobile, tablet, and high-DPI desktop screens.
3. **Build Check**: Validate production bundling.
