import { useEffect, useState } from 'react';
import Lenis from 'lenis';
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

function App() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  // Super fluid smooth scroll with Lenis (kept for premium grounded feel)
  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 * (-Math.pow(2, -10 * t) + 1)),
      smoothWheel: true,
    });

    setLenis(lenisInstance);

    function raf(time: number) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenisInstance.destroy();
    };
  }, []);

  // Smooth anchor navigation
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
          offset: -70,
          duration: 1.1,
        });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [lenis]);

  return (
    <div className="volenzo-app">
      {showPreloader && (
        <Preloader onComplete={() => setShowPreloader(false)} />
      )}

      <Nav />

      <main>
        <Hero />

        <Marquee items={content.marquee} />

        <Metrics />

        <Problem />

        <Services />

        <Contact />
      </main>

      <Footer />
    </div>
  );
}

export default App;
