import { MutableRefObject } from 'react';
import { content } from '../../lib/content';
import { Hero3D } from '../3d/Hero3D';
import { ScrollProgress } from '../../hooks/useScrollProgress';

interface HeroProps {
  progressRef?: MutableRefObject<ScrollProgress>;
}

export function Hero({ progressRef }: HeroProps) {
  return (
    <section id="hero" className="hero">
      <div className="hero-inner">
        {/* LEFT: Exact original copy preserved */}
        <div className="hero-copy">
          <p className="hero-badge">
            <span className="badge-dot" aria-hidden="true" />
            {content.hero.badge}
          </p>

          <h1 className="hero-h1">
            Your agency is<br />
            bleeding <em className="alarm-em">₹25L.</em>
          </h1>

          <p className="hero-sub">
            {content.hero.subPrefix}
            <span className="typed-target">losing to ADM surprises.</span>
            {/* TODO(overhaul): Add small GSAP or React cycle for the original rotating subLines from content.hero.subLines */}
          </p>

          <div className="hero-actions">
            <a href="#contact" className="btn-primary" data-scroll>
              {content.hero.ctaPrimary}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="#problem" className="btn-ghost" data-scroll>
              {content.hero.ctaSecondary}
            </a>
          </div>

          <p className="hero-trust">{content.hero.trust}</p>
        </div>

        {/* RIGHT: THE 3D SCENE — primary cinematic replacement for Atropos + terminal cards + plane */}
        <div className="hero-visual">
          <div className="hero-float">
            {/* 
              Encapsulated 3D Hero Scene — scroll-synced via progressRef (read in useFrame with zero React cost)
            */}
            <Hero3D progressRef={progressRef} />
          </div>
        </div>
      </div>

      <a href="#metrics" className="scroll-cue" data-scroll aria-label="Scroll down">
        <span className="cue-text">Scroll</span>
        <span className="cue-line" />
      </a>
    </section>
  );
}

