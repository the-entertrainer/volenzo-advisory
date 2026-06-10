# Volenzo Advisory — 3D Immersive Overhaul Plan
**Lead Frontend + 3D Creative Engineer mandate**
Date: 2026 (current session)

## Executive Summary
Transform the current high-quality vanilla + GSAP + 22-lib motion site into a **high-performance, cinematic, scroll-synced 3D experience** using:
- React 18 + TypeScript
- Three.js + @react-three/fiber + @react-three/drei
- GSAP (ScrollTrigger + timelines) + Lenis (already strong base)
- Performance-first patterns (demand render, instancing, minimal Canvases, shader uniforms driven by scroll progress)

**Core constraint**: Keep **all content identical** — every headline, paragraph, number (₹25L, 30 days, 1 Cr+, service descriptions, form fields, trust signals, terminal data pool semantics), tone ("Stop the Leak", "Three leaks. One bleeding agency.", alumni positioning), and visual language (sky palette, Bebas Neue + Inter, #0055FF brand, red for loss).

The current site already has sophisticated 2.5D (Atropos plane + "Bloomberg Terminal" cards with simulated DoF + particles + GSAP everything). We are replacing the **visual layer** with true professional 3D while preserving (and elevating) the data-rich, insider, aviation-ops aesthetic.

## Current State Analysis (Key Findings)
- **Tech**: Vite, single `index.html` + `main.js` (orchestrator) + `script.js` (dupe code?) + `terminal.js` (sophisticated), heavy CSS (35k), GSAP+Lenis core + 20 other libs for micro effects (atropos, vanilla-tilt, swiper, typed, countup, progressbar, rellax, aos, scrollreveal, particles, etc.).
- **Structure**: Compact 5-section SPA:
  1. Hero (strong bleed headline + typed pains + Atropos plane + floating value tags + clouds + particles + **terminal cards**)
  2. Marquee keywords
  3. Metrics (3 stat + progress bars)
  4. Problem (3 leak rows with exact ₹ ranges and descriptions)
  5. Services (3 cards in Swiper, one featured "ADM Defence")
  6. Contact (form with 4 fields + urgency copy + chips)
  7. Footer
- **Unique asset**: The `terminal.js` "Bloomberg Terminal" — 6 floating edge-peek cards (desktop) or 2x3 flipping data grid (mobile) using a rich 12-entry realistic data POOL (ADM RAISED, NDC gaps, recoverable L/yr, etc.). Uses GSAP for float, flip, number pulse, simulated depth-of-field via CSS filter + "focus plane".
- **Visual identity**: Light sky blue (#D6EEFF etc.), deep navy ink, bold display typography, clean cards, micro details, aviation + revenue recovery theme. Plane.png is the hero visual metaphor.
- **No 3D yet**: All "3D" is CSS transform + Atropos + manual perspective on 2D images/cards.
- **Strengths to preserve**: Lenis+GSAP ScrollTrigger foundation, data authenticity, urgency without hype, accessibility signals, mobile-first.

## Target Experience
- Cinematic, premium, "insider command center" feel.
- **Scroll is the primary interaction**: User's scroll depth directly drives camera position, object rotation/scale, material properties (color lerp, emissive, uniforms for "leak intensity" or "recovery reveal"), particle emission rates, focus effects.
- Encapsulated 3D scenes (easy to maintain, test, disable per-section).
- Fully responsive (3D gracefully scales; heavy effects reduced on mobile or prefers-reduced-motion).
- Performance: Target 60fps on mid hardware, low bundle impact for 3D chunks.

## Recommended Tech Stack (Additions & Pruning)
**Keep / Expand**:
- Vite
- GSAP + ScrollTrigger + Lenis (core of scroll timeline)
- Existing CSS tokens + major layout rules (ported)

**Add (core for mandate)**:
- react, react-dom, @types/react, @types/react-dom
- three, @react-three/fiber, @react-three/drei
- (optional cinematic) @react-three/postprocessing, three-stdlib, @types/three
- For form (future): keep simple or add react-hook-form if wanted, but preserve current behavior first

**Prune / Replace** (as 3D + GSAP cover their jobs):
- atropos, vanilla-tilt, rellax, aos, scrollreveal, swiper (for services), typed.js (can keep simple or GSAP split), countup (GSAP or 3D counters), progressbar.js (3D viz or simple divs), particles (replace with R3F Points), splitting/split-type (GSAP or keep for text), anime/motion (GSAP), party (keep for success or replace), vivus, rough-notation, auto-animate, micron, tsparticles.

**New package.json scripts**: same dev/build + perhaps `analyze`.

## File Structure Changes (Autonomous Architecture)
```
volenzo-advisory/
├── public/
│   ├── assets/                 # existing (plane*.webp/png, volenzologo*, keep + compress if needed)
│   └── models/                 # NEW — compressed .glb/.gltf here (DRACO recommended)
│       └── (plane-lowpoly.glb, shield.glb, data-node.glb etc. — start procedural)
├── src/
│   ├── components/
│   │   ├── 3d/                 # ★ ALL 3D SCENES ENCLOSED HERE
│   │   │   ├── CanvasConfig.tsx      # Shared perf settings, lights, camera defaults, <Canvas> wrapper
│   │   │   ├── Hero3D.tsx            # Primary cinematic scene (plane + data cards + sky + leaks)
│   │   │   ├── Leaks3D.tsx           # Problem/Metrics viz: 3 conduits, particles, recovery state
│   │   │   ├── Services3D.tsx        # Constellation / hub with 3 nodes + camera orchestration
│   │   │   └── DataCard3D.tsx        # Reusable floating holographic data card (inspired by terminal)
│   │   ├── sections/
│   │   │   ├── Hero.tsx              # 2-col layout; left copy (exact), right <Hero3D/>
│   │   │   ├── Metrics.tsx
│   │   │   ├── Problem.tsx           # 3 rows (exact copy) + synced <Leaks3D/>
│   │   │   ├── Services.tsx          # Header + <Services3D/> + side panel for active service (exact copy)
│   │   │   └── Contact.tsx           # Form (exact fields + copy) + subtle 3D accent
│   │   ├── ui/
│   │   │   ├── Nav.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Marquee.tsx
│   │   │   └── ContactForm.tsx
│   │   └── Terminal3D.tsx (optional evolution of terminal into 3D data wall)
│   ├── hooks/
│   │   ├── useScrollProgress.ts      # Master 0-1 + per-section progress from Lenis + ScrollTrigger
│   │   └── useAnimatedNumber.ts
│   ├── lib/
│   │   ├── content.ts                # ★ ALL ORIGINAL COPY EXTRACTED HERE (single source of truth)
│   │   ├── three-utils.ts            # Geometries, materials, lerp helpers, shader snippets
│   │   └── scroll.ts                 # Lenis + GSAP config
│   ├── styles/
│   │   └── global.css                # Ported :root tokens + original layout + 3D canvas overlays
│   ├── App.tsx
│   ├── main.tsx
│   └── types/index.ts
├── index.html                        # Minimal shell with <div id="root"></div> + meta
├── package.json                      # Updated deps + pruned
├── tsconfig.json
├── vite.config.ts                    # + react plugin, gltf asset handling, chunking for three
├── OVERHAUL_PLAN.md (this)
└── (archive old: main.js, script.js, terminal.js, style.css moved/ported)
```

**Modularity rule**: Every 3D scene is a self-contained React component that accepts `progress?: number` or uses the context hook. No global side effects.

## Optimal Locations to Inject 3D (Prioritized)
1. **Hero (highest impact)**:
   - Replace: Atropos plane img + blobs + tags + terminal-cards + particles + rellax clouds.
   - New: Large `<Hero3D/>` (or full-bleed background canvas + overlay copy for dramatic effect).
   - Scroll behavior: Early scroll (0-0.15) slowly orbits camera around 3D plane, adjusts "leak particle" density, moves holographic data cards (using the exact terminal POOL data) in 3D space with slight rotation/scale. Mouse parallax for premium feel (drei useCursor or pointer events).
   - Cinematic: Subtle god-ray like lighting or emissive "data streams" flowing off the wings/fuselage representing revenue.

2. **Metrics + Problem (scroll-synced narrative)**:
   - Sticky or section-height 3D visualization area next to or above the 3 exact problem rows.
   - 3D metaphor: Three vertical or angled "conduits/pipes" (cylinders + custom lathe for premium shape) leaking red particle streams + small ₹ glyphs or floating numbers.
   - As user scrolls each `<problem-row>`, a dedicated GSAP ScrollTrigger or normalized `leakProgress[0|1|2]` drives:
     - Emission rate down, particle color lerp red→brand-blue, valve geometry rotates closed.
     - A central "recovered" accumulator (growing stack of blue bars or flying particles collected).
     - Camera target or light position shifts to "highlight" the active leak.
   - Metrics numbers can be enhanced with small 3D instanced bars or a 3D "total recovered" counter that animates in sync with CountUp replacement (GSAP).

3. **Services (interactive 3D centerpiece)**:
   - Replace entire Swiper + tilt cards.
   - Central elegant 3D "advisory hub" (abstract low-poly sphere, turbine, or ledger volume).
   - Three service satellites/nodes around it (use distinct simple shapes + labels via `<Html>` or 3D Text from drei for crispness; or plane + texture).
   - Scroll into section or click/keyboard: GSAP timeline scrubs camera position + lookAt to focus the node (smooth cinematic orbit).
   - On focus: Node scale + emissive intensity up, a shader "pulse" or data ring rotates; a React panel to the side (or floating 3D billboard) displays the **exact original service copy** ("Close inventory gaps...", "Audit BSP data...", etc.).
   - Scroll depth within services can cycle or emphasize the three in sequence.

4. **Contact + Footer (subtle closer)**:
   - Light ambient 3D (network lines connecting nodes representing "agencies" to "recovery", or a stylized paper plane that reacts on form success).
   - Or keep mostly 2D and use 3D only for a small "live recovery meter" that shows a running total.

5. **Global/Ambient**:
   - Very cheap background or corner "progress orb" whose rotation or a internal "recovery level" mesh is driven by overall page scrollProgress.
   - Marquee can stay CSS or become a thin 3D text strip (drei Text + scroll offset).

**Terminal evolution**: The data POOL and flip/focus logic is too good to lose. Option A: Port the cards as 3D `<DataCard3D>` instances inside Hero3D or a dedicated terminal wall (true 3D transforms, real DoF via postprocessing or multi-pass, better lighting). Option B: Keep a 2D version as overlay on the 3D scene for data authenticity during early rollout.

## Scroll-Synced Animation Timeline Strategy (Core Requirement)
- **Master progress**: `useScrollProgress()` hook returns `{ overall: number, hero: number, problem: number, services: number, contact: number }` (0-1 normalized to section viewport).
  - Implementation: Lenis scroll listener + multiple ScrollTrigger.create({trigger: '#problem', onUpdate: self => { problemProg = self.progress }}). Use a ref object so R3F can read without re-renders.
- **In R3F components**:
  ```tsx
  const { progress } = useScrollProgress();
  useFrame((state) => {
    const p = progress.overall; // or section-specific
    group.current.rotation.y = p * Math.PI * 1.5;
    camera.position.z = THREE.MathUtils.lerp(8, 4, p);
    if (mesh.material.uniforms?.uLeak) mesh.material.uniforms.uLeak.value = 1 - p; // shader example
    // lerp any other (scale, pointLight.intensity, particle count via ref, etc.)
  });
  ```
- **Complex sequences**: Define GSAP timelines in a `useGSAPTimeline` hook or useEffect. Example:
  ```ts
  const tl = gsap.timeline({paused: true});
  tl.to(cameraTarget, {x: 2, y:1}, 0).to(plane.rotation, {y: Math.PI}, 0);
  // Then on scroll update: tl.progress(sectionProgress)
  ```
  This gives "timeline where 3D object properties are dynamically driven by scroll depth".
- **Performance guard**: Only update on actual scroll change (throttle raf). Use `frameloop="demand"` + `invalidate()` from fiber when progress changes. Avoid creating objects in useFrame.

## Asset & Loading Strategy
- **Current images**: Keep in public/assets. Use as textures (plane skin on 3D model) or fallbacks.
- **3D models**: 
  - Phase 1 (now): 100% procedural — build elegant low-poly plane (Box + Cylinder + Cone for fuselage/wings/engines/nose, beveled), conduits (Cylinder + Torus), nodes (Icosahedron + custom), data cards (rounded plane + Text).
  - Phase 2: Add real compressed .glb (recommend <50k tris total, DRACO + meshopt). Place in public/models/. Use `useGLTF` + `<primitive object={scene} />`. Preload.
  - Compression: Use glTF-Transform or Blender export settings. Add `three` GLTFLoader + draco decoder in vite (copy decoder or use CDN).
- **Suspense + Loader**: drei `<Loader />` or custom matching the original animated logo preloader.
- **Textures**: Reuse plane.png as albedo or normal if modeling allows.

## Performance & Production Notes
- Canvas props: `frameloop="demand" dpr={[1, Math.min(1.5, window.devicePixelRatio)]} gl={{antialias:true, alpha:true, preserveDrawingBuffer:false, powerPreference:"high-performance"}}`
- Lights: 1-2 Directional + Hemisphere. No heavy shadows unless baked.
- Instancing for repeated (data tags, particles).
- Custom minimal shaders only where visual win justifies (leak flow, holo fresnel on cards).
- Code-split 3D: React.lazy the heavy scene components + <Suspense>.
- Bundle: Manual chunks for three + fiber in vite.config.
- Reduced motion: Detect and render static high-quality 2D or very low-anim 3D versions.
- Mobile: Smaller canvas height, lower particle counts, simpler geometries, or disable some 3D and show enhanced CSS version.
- Testing: Stats.js or @react-three/drei <Stats />, Lighthouse, manual on low-end laptop + phone.

## Implementation Phases (Autonomous Roadmap)
1. **Foundation** (current): Update package + vite + tsconfig. Minimal React shell + ported global.css + exact content in lib/content.ts. Working Nav + sections skeleton with original copy.
2. **Hero3D MVP**: Procedural plane + basic camera + 3-6 floating DataCard3D using terminal POOL data. Wire basic overall scroll to rotation + z.
3. **Scroll system**: Robust useScrollProgress + provider. GSAP scrub examples.
4. **Leaks3D + Problem**: 3 conduits synced to the 3 rows (use Intersection or scroll progress per row).
5. **Services3D**: Hub + 3 nodes + GSAP camera focus on scroll/click + exact copy panels.
6. **Polish & remaining**: Metrics sync, Contact subtle 3D, preloader 3D, form behavior port (preserve exact), terminal evolution or integration, responsiveness, perf passes, build verification.
7. **Asset upgrade path**: Document how/where to drop real .glb and swap `<primitive>` in.
8. **Cleanup**: Remove old JS/CSS files once fully ported. Update netlify.toml if needed.

## Risks & Mitigations
- Perf on low-end: Demand loop + low dpr + procedural (no heavy models initially).
- Scroll "jank": Lenis + GSAP ticker already battle-tested; keep and extend.
- Content drift: Single source `content.ts`.
- Over-engineering 3D: Start procedural and beautiful, add complexity only where it serves the scroll narrative.

## Success Criteria
- User scrolls and literally "sees" the leaks being plugged and revenue recovered in 3D in real time.
- All original copy and numbers appear verbatim.
- Feels like a Bloomberg terminal + cinematic flight sim + premium consulting site.
- Lighthouse perf >= 90 on desktop, smooth 60fps interactions.
- Fully modular: a designer can tweak a scene in isolation.

This plan is actionable and will be executed step-by-step in the current session using the workspace tools.

Next immediate actions:
- Set up React + R3F foundation.
- Port content + styles.
- Build first encapsulated Hero3D with scroll drive.
- Iterate based on visual/functional review.
