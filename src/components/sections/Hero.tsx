import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { content } from '../../lib/content';

export function Hero() {
  // Fluid cycling subheadline — better than original Typed.js (smooth, no extra deps)
  const [subIndex, setSubIndex] = useState(0);
  const subLines = content.hero.subLines || ["losing to ADM surprises."];

  useEffect(() => {
    const interval = setInterval(() => {
      setSubIndex((prev) => (prev + 1) % subLines.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [subLines.length]);

  // Grounded mouse-driven tilt for the visual (premium interactive figure without 3D libs)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Small grounded "data insights" figures from original terminal concept (fluid, not 3D)
  const insightData = content.terminalDataPool.slice(0, 3);

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
            <motion.span 
              key={subIndex} 
              className="typed-target"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {subLines[subIndex]}
            </motion.span>
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

        {/* RIGHT: Grounded premium visual — retains original plane + floating recovery figures + data insight concept */}
        <div className="hero-visual">
          <div 
            className="hero-float"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              className="hero-visual-inner"
              style={{ 
                rotateX, 
                rotateY,
                transformStyle: 'preserve-3d' as any 
              }}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Main plane figure - clean and professional */}
              <img 
                src="assets/plane.png" 
                alt="Commercial aircraft" 
                className="hero-plane" 
              />

              {/* Key animated recovery figures (original concept, now with fluid framer emphasis) */}
              <motion.div 
                className="scene-tag scene-tag--adm"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                whileHover={{ scale: 1.04, y: -2 }}
              >
                <span className="tag-label">ADM challenged</span>
                <strong className="tag-val">+₹8.4L</strong>
              </motion.div>

              <motion.div 
                className="scene-tag scene-tag--ndc"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                whileHover={{ scale: 1.04, y: -2 }}
              >
                <span className="tag-label">NDC recovered</span>
                <strong className="tag-val">+₹6.1L</strong>
              </motion.div>

              {/* Grounded data insights — retains original "terminal" / insider data concept with super fluid figures */}
              <div className="hero-insights">
                {insightData.map((item, idx) => {
                  const val = Math.round(item.range[0] + (item.range[1] - item.range[0]) * 0.6);
                  return (
                    <motion.div 
                      key={idx}
                      className="insight-pill"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 0.85, y: 0 }}
                      transition={{ delay: 0.7 + idx * 0.08 }}
                      whileHover={{ opacity: 1, scale: 1.02, transition: { duration: 0.15 } }}
                    >
                      <span className="insight-label">{item.label}</span>
                      <strong className="insight-val">{item.prefix}{val}{item.suffix}</strong>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
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

