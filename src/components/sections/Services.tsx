import { motion } from 'framer-motion';
import { content } from '../../lib/content';

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
  },
};

export function Services() {
  return (
    <section id="services" className="services">
      <div className="container">
        <h2 className="services-title">
          Three fixes.<br /><em>One call.</em>
        </h2>

        <motion.div 
          className="services-grid" 
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {content.services.items.map((svc, i) => (
            <motion.article 
              key={i} 
              className={`svc-card ${svc.featured ? 'svc-card--featured' : ''}`}
              variants={cardVariants}
              whileHover={{ 
                y: -4, 
                boxShadow: '0 20px 40px -15px rgba(0, 55, 180, 0.12)',
                transition: { duration: 0.2 } 
              }}
            >
              <div className="svc-head">
                <span className="svc-idx">{svc.idx}</span>
                <svg className="svc-icon-svg" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  {i === 0 && (
                    <>
                      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M16 10V16L20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </>
                  )}
                  {i === 1 && (
                    <>
                      <path d="M16 4L5 10V18C5 24 10 28.5 16 30C22 28.5 27 24 27 18V10L16 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                      <path d="M11 16L14.5 19.5L21.5 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </>
                  )}
                  {i === 2 && (
                    <>
                      <circle cx="16" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="6" cy="25" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="26" cy="25" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M13 11L8 21.5M19 11L24 21.5M12.5 25H19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </>
                  )}
                </svg>
              </div>
              <h3 className="svc-name">{svc.name}</h3>
              <p className="svc-desc">{svc.desc}</p>
              <div className="svc-footer">
                <div className="svc-bar-host"><div className="svc-bar" style={{ width: svc.featured ? '82%' : '55%' }} /></div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <p className="services-note">{content.services.note}</p>
      </div>
    </section>
  );
}
