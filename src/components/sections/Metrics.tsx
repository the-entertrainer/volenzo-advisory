import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { content } from '../../lib/content';

function AnimatedNumber({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1450;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (value - start) * eased);
      setDisplay(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplay(value);
      }
    };

    requestAnimationFrame(step);
  }, [value]);

  const formatted = value >= 1000 ? display.toLocaleString('en-IN') : display;

  return (
    <span>
      {prefix}{formatted}{suffix}
    </span>
  );
}

export function Metrics() {
  return (
    <section id="metrics" className="metrics">
      <div className="container metrics-inner">
        {content.metrics.map((m, i) => (
          <motion.div 
            className="metric" 
            key={i}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <strong className="m-num">
              <AnimatedNumber 
                value={m.value} 
                suffix={m.suffix} 
                prefix={'prefix' in m ? (m as any).prefix : ''} 
              />
            </strong>
            <span className="m-label">{m.label}</span>
            <div className="m-bar-host">
              <motion.div 
                className="m-bar" 
                initial={{ width: 0 }}
                whileInView={{ width: i === 2 ? '100%' : `${Math.min(92, 55 + i * 18)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
