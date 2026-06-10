import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete?: () => void;
  minDuration?: number;
}

/**
 * Preloader - grounded, elegant, using the original brand animated logo.
 * Fluid exit powered by framer-motion.
 */
export function Preloader({ onComplete, minDuration = 2100 }: PreloaderProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = Date.now();

    const exit = () => {
      setVisible(false);
      // Small delay so exit animation can play
      setTimeout(() => {
        onComplete?.();
      }, 450);
    };

    const timer = setTimeout(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, minDuration - elapsed);
      setTimeout(exit, remaining);
    }, 80);

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

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
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
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }}
          aria-hidden="true"
        >
          <motion.picture
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <source srcSet="assets/volenzologoanimated.webp" type="image/webp" />
            <img
              id="preloader-logo"
              src="assets/volenzologoanimated.gif"
              alt="Volenzo Advisory"
              width={210}
              height={210}
              style={{ objectFit: 'contain' }}
            />
          </motion.picture>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
