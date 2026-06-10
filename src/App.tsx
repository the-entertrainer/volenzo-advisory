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

// 3D scenes (encapsulated)
import { Leaks3D } from './components/3d/Leaks3D';
import { Services3D } from './components/3d/Services3D';

// TODO (overhaul): Full Lenis + GSAP ScrollTrigger provider.
// Current: lightweight useScrollProgress already wired into Hero3D.

function App() {
  const [activeService, setActiveService] = useState(1);

  // Basic smooth scroll for anchors (will be upgraded with Lenis)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[data-scroll], a[href^="#"]');
      if (!target) return;

      const href = (target as HTMLAnchorElement).getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      const el = document.querySelector(href);
      if (el) {
        e.preventDefault();
        const navH = 64;
        const top = (el as HTMLElement).getBoundingClientRect().top + window.scrollY - navH - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="volenzo-app">
      <Nav />

      <main>
        <Hero />

        <Marquee items={content.marquee} />

        <Metrics />

        <Problem />

        {/* 3D LEAK VISUALIZATION — scroll-synced with the three problem rows above */}
        <div className="container" style={{ paddingBottom: 48 }}>
          <Leaks3D leakProgress={[0.15, 0.08, 0.22]} />
        </div>

        <Services />

        {/* 3D SERVICES CONSTELLATION — encapsulated, click/scroll focusable */}
        <div className="container" style={{ paddingBlock: 24 }}>
          <Services3D 
            activeIndex={activeService} 
            onNodeFocus={setActiveService} 
          />
        </div>

        <Contact />
      </main>

      <Footer />
    </div>
  );
}

export default App;
