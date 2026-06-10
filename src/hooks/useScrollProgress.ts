import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * useScrollProgress + Lenis/ScrollTrigger initializer
 *
 * This is the core of the scroll-synced 3D experience.
 * - Lenis provides buttery smooth scrolling (matching original site).
 * - GSAP ScrollTrigger creates precise per-section progress (0-1).
 * - We expose both React state (for UI) and a mutable ref (for zero-overhead reads inside R3F useFrame).
 *
 * Usage in 3D components:
 *   const { progressRef, progress } = useScrollProgress();
 *   useFrame(() => {
 *     const p = progressRef.current;
 *     plane.rotation.y = p.hero * Math.PI * 1.2;
 *     // etc.
 *   });
 */

gsap.registerPlugin(ScrollTrigger);

export interface ScrollProgress {
  overall: number;
  hero: number;
  problem: number;
  services: number;
  contact: number;
}

interface ScrollProgressAPI {
  progress: ScrollProgress;
  progressRef: React.MutableRefObject<ScrollProgress>;
  lenis: Lenis | null;
}

let lenisInstance: Lenis | null = null;

export function useScrollProgress(): ScrollProgressAPI {
  const [progress, setProgress] = useState<ScrollProgress>({
    overall: 0, hero: 0, problem: 0, services: 0, contact: 0,
  });

  const progressRef = useRef<ScrollProgress>({
    overall: 0, hero: 0, problem: 0, services: 0, contact: 0,
  });

  const reduceMotion = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const sections = ['hero', 'problem', 'services', 'contact'] as const;

    // Initialize Lenis for premium smooth scroll (unless reduced motion)
    if (!lenisInstance && !reduceMotion) {
      lenisInstance = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.0010000000000001 * (-Math.pow(2, -10 * t) + 1)),
        smoothWheel: true,
      });

      // Sync Lenis with GSAP ticker (excellent performance, from original site pattern)
      function raf(time: number) {
        lenisInstance?.raf(time);
      }
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    const updateProgress = (newP: ScrollProgress) => {
      // Update both state (for any React UI) and the ref (for R3F useFrame - no re-renders)
      progressRef.current = { ...newP };
      setProgress(newP);
    };

    // Overall progress via native + Lenis scroll event (fallback)
    const onScroll = () => {
      const scrollY = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight || 1;
      const overall = Math.min(1, Math.max(0, scrollY / docH));

      const newP: ScrollProgress = { ...progressRef.current, overall };
      updateProgress(newP);
    };

    // Create ScrollTriggers for each important section (precise 0-1 per section)
    const triggers: ScrollTrigger[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top 70%',
        end: 'bottom 30%',
        onUpdate: (self) => {
          const newP = { ...progressRef.current };
          (newP as any)[id] = self.progress;

          // Also nudge overall
          const scrollY = window.scrollY;
          const docH = document.documentElement.scrollHeight - window.innerHeight || 1;
          newP.overall = Math.min(1, Math.max(0, scrollY / docH));

          updateProgress(newP);
        },
      });
      triggers.push(trigger);
    });

    // Initial + listeners
    window.addEventListener('scroll', onScroll, { passive: true });
    // Kick once
    setTimeout(() => {
      ScrollTrigger.refresh();
      onScroll();
    }, 100);

    return () => {
      window.removeEventListener('scroll', onScroll);
      triggers.forEach(t => t.kill());
      // We keep the global lenisInstance alive for the SPA lifetime
    };
  }, [reduceMotion]);

  return {
    progress,
    progressRef,
    lenis: lenisInstance,
  };
}
