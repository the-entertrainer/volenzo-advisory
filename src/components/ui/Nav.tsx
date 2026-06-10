import { content } from '../../lib/content';

export function Nav() {
  return (
    <nav id="nav" className="nav">
      <a href="#hero" className="nav-logo-link" data-scroll>
        <picture>
          <source srcSet="assets/volenzologo.webp" type="image/webp" />
          <img src="assets/volenzologo.png" alt={content.nav.logoAlt} className="nav-logo" />
        </picture>
      </a>

      <ul className="nav-links">
        {content.nav.links.map((link) => (
          <li key={link.href}>
            <a href={link.href} data-scroll>
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <a href="#contact" className="nav-cta" data-scroll>
        {content.nav.cta}
      </a>

      {/* Mobile burger — minimal functional version. Full animated burger can be added */}
      <button
        className="nav-burger"
        id="nav-burger"
        aria-label="Open menu"
        aria-expanded="false"
        onClick={() => {
          const overlay = document.getElementById('mob-overlay');
          const burger = document.getElementById('nav-burger');
          if (overlay && burger) {
            const isOpen = overlay.classList.toggle('open');
            burger.classList.toggle('open', isOpen);
            burger.setAttribute('aria-expanded', String(isOpen));
          }
        }}
      >
        <span></span><span></span><span></span>
      </button>

      {/* Mobile overlay (simple port) */}
      <div className="mob-overlay" id="mob-overlay" aria-hidden="true">
        <button
          className="mob-close"
          id="mob-close"
          aria-label="Close menu"
          onClick={() => {
            const overlay = document.getElementById('mob-overlay');
            const burger = document.getElementById('nav-burger');
            if (overlay) overlay.classList.remove('open');
            if (burger) {
              burger.classList.remove('open');
              burger.setAttribute('aria-expanded', 'false');
            }
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <line x1="5" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <nav>
          {content.nav.links.map((link) => (
            <a key={link.href} href={link.href} data-scroll onClick={() => {
              const overlay = document.getElementById('mob-overlay');
              if (overlay) overlay.classList.remove('open');
            }}>
              {link.label}
            </a>
          ))}
          <a href="#contact" data-scroll className="mob-cta">Stop the Leak &rarr;</a>
        </nav>
      </div>
    </nav>
  );
}
