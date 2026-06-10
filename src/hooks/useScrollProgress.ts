import { useEffect, useRef, useState } from 'react';

/**
 * useScrollProgress
 * 
 * Master hook for scroll-synced 3D.
 * Returns normalized 0-1 progress for the whole page + key sections.
 * 
 * Current implementation: lightweight Intersection + scroll listener (good enough for start).
 * Production version (per plan): 
 *   - Lenis + GSAP ScrollTrigger for buttery performance
 *   - Multiple ScrollTrigger.create per section
 *   - A shared ref object (not state) so R3F useFrame can read without causing React re-renders
 *   - GSAP timeline.progress( sectionProgress ) for complex scrubbed sequences
 */

export interface ScrollProgress {
  overall: number;
  hero: number;
  problem: number;
  services: number;
  contact: number;
}

export function useScrollProgress(): ScrollProgress {
  const [progress, setProgress] = useState<ScrollProgress>({
    overall: 0, hero: 0, problem: 0, services: 0, contact: 0,
  });

  const ticking = useRef(false);

  useEffect(() => {
    const sections = ['hero', 'problem', 'services', 'contact'] as const;

    const compute = () => {
      const scrollY = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const overall = docH > 0 ? Math.min(1, Math.max(0, scrollY / docH)) : 0;

      const newP: ScrollProgress = { overall, hero: 0, problem: 0, services: 0, contact: 0 };

      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;

        // Simple normalized "in view" progress for the section
        const start = rect.top + scrollY - vh * 0.6;
        const end = rect.bottom + scrollY - vh * 0.4;
        const sectionH = end - start;
        let p = sectionH > 0 ? (scrollY - start) / sectionH : 0;
        p = Math.min(1, Math.max(0, p));

        (newP as any)[id] = p;
      });

      setProgress(newP);
    };

    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          compute();
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    compute(); // initial

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return progress;
}
