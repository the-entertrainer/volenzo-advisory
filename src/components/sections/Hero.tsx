import { motion } from 'framer-motion';
import { content } from '../../lib/content';

export function Hero() {
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

        {/* RIGHT: Grounded, premium visual with super fluid framer-motion animated figures */}
        <div className="hero-visual">
          <div className="hero-float">
            <motion.div
              className="hero-visual-inner"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Clean plane visual - grounded and professional */}
              <img 
                src="assets/plane.png" 
                alt="Commercial aircraft" 
                className="hero-plane" 
                style={{ maxWidth: '100%', height: 'auto' }}
              />

              {/* Fluid animated figures / value tags - emphasis on recovery */}
              <motion.div 
                className="scene-tag scene-tag--adm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35, duration: 0.6, ease: 'easeOut' }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              >
                <span className="tag-label">ADM challenged</span>
                <strong className="tag-val">+₹8.4L</strong>
              </motion.div>

              <motion.div 
                className="scene-tag scene-tag--ndc"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              >
                <span className="tag-label">NDC recovered</span>
                <strong className="tag-val">+₹6.1L</strong>
              </motion.div>
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

