import { useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface PreloaderProps {
  onComplete?: () => void;
  minDuration?: number;
}

/**
 * Preloader matching the original Volenzo aesthetic (animated logo + sky bg).
 * Uses the original webp/gif from public/assets for brand consistency.
 * Fades out elegantly with GSAP.
 */
export function Preloader({ onComplete, minDuration = 2200 }: PreloaderProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = Date.now();

    const exit = () => {
      const loader = document.getElementById('preloader');
      if (!loader) {
        setVisible(false);
        onComplete?.();
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          setVisible(false);
          onComplete?.();
        },
      });

      tl.to('#preloader-logo', { scale: 1.08, duration: 0.22, ease: 'power2.out' })
        .to('#preloader-logo', { opacity: 0, duration: 0.32, ease: 'power2.in' }, '-=0.05')
        .to(loader, { yPercent: -100, duration: 0.6, ease: 'power3.inOut' }, '-=0.08');
    };

    const timer = setTimeout(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, minDuration - elapsed);
      setTimeout(exit, remaining);
    }, 120);

    // Also allow early exit if user interacts (nice touch)
    const earlyExit = () => {
      clearTimeout(timer);
      exit();
    };
    window.addEventListener('keydown', earlyExit, { once: true });
    window.addEventListener('wheel', earlyExit, { once: true, passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', earlyExit);
      window.removeEventListener('wheel', earlyExit);
    };
  }, [minDuration, onComplete]);

  if (!visible) return null;

  return (
    <div
      id="preloader"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-hidden="true"
    >
      <picture>
        <source srcSet="assets/volenzologoanimated.webp" type="image/webp" />
        <img
          id="preloader-logo"
          src="assets/volenzologoanimated.gif"
          alt="Volenzo Advisory"
          width={210}
          height={210}
          style={{ objectFit: 'contain' }}
        />
      </picture>
    </div>
  );
}
