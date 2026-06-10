import { useEffect, useState } from 'react';
import { content } from './lib/content';

// Sections
import { Hero } from './components/sections/Hero';
import { Marquee } from './components/ui/Marquee';
import { Metrics } from './components/sections/Metrics';
import { Problem } from './components/sections/Problem';
import { Services } from './components/sections/Services';
import { Contact } from './components/sections/Contact';
import { Footer } from './components/ui/Footer';
import { Nav } from './components/ui/Nav';
import { Preloader } from './components/ui/Preloader';

// 3D scenes (encapsulated)
import { Leaks3D } from './components/3d/Leaks3D';
import { Services3D } from './components/3d/Services3D';

// Real scroll-synced 3D progress (Lenis + GSAP ScrollTrigger)
import { useScrollProgress } from './hooks/useScrollProgress';

function App() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [activeService, setActiveService] = useState(1);

  // Master scroll progress API (ref for R3F + state for UI)
  const { progress, progressRef, lenis } = useScrollProgress();

  // Smooth anchor scrolling powered by Lenis (much better than native)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[data-scroll], a[href^="#"]');
      if (!target) return;

      const href = (target as HTMLAnchorElement).getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      const el = document.querySelector(href);
      if (el && lenis) {
        e.preventDefault();
        lenis.scrollTo(el as HTMLElement, {
          offset: -64,
          duration: 1.2,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
        });
      } else if (el) {
        // Fallback
        e.preventDefault();
        const top = (el as HTMLElement).getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [lenis]);

  // Dynamic leak progress driven by actual problem section scroll (0 = fully leaking, 1 = recovered)
  const problemP = progress.problem || 0;
  const leakProgress: [number, number, number] = [
    Math.max(0, Math.min(1, 1 - problemP * 2.2)), // ADM
    Math.max(0, Math.min(1, 1 - (problemP - 0.1) * 2.4)), // NDC
    Math.max(0, Math.min(1, 1 - (problemP - 0.25) * 2.6)), // GDS
  ];

  // Services section progress can influence the constellation
  const servicesP = progress.services || 0;

  return (
    <div className="volenzo-app">
      {showPreloader && (
        <Preloader onComplete={() => setShowPreloader(false)} minDuration={2100} />
      )}

      <Nav />

      <main>
        <Hero progressRef={progressRef} />

        <Marquee items={content.marquee} />

        <Metrics />

        <Problem />

        {/* 3D LEAK VISUALIZATION — now truly scroll-synced with the three problem rows */}
        <div className="container" style={{ paddingBottom: 48 }}>
          <Leaks3D leakProgress={leakProgress} scrollProgress={problemP} />
        </div>

        <Services />

        {/* 3D SERVICES CONSTELLATION — scroll + click driven */}
        <div className="container" style={{ paddingBlock: 24 }}>
          <Services3D 
            activeIndex={activeService} 
            onNodeFocus={setActiveService} 
            scrollProgress={servicesP}
          />
        </div>

        <Contact />
      </main>

      <Footer />
    </div>
  );
}

export default App;
