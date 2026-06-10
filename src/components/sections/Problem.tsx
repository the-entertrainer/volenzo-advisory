import { motion } from 'framer-motion';
import { content } from '../../lib/content';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
};

export function Problem() {
  return (
    <section id="problem" className="problem">
      <div className="container">
        <h2 className="problem-title">
          Three leaks.<br /><em>One bleeding agency.</em>
        </h2>

        <motion.div 
          className="problem-rows" 
          id="problem-rows"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {content.problem.leaks.map((leak, index) => (
            <motion.div key={index} variants={rowVariants}>
              <div className="problem-row">
                <span className="row-idx" aria-hidden="true">{leak.idx}</span>
                <div className="row-body">
                  <strong className="row-name">{leak.name}</strong>
                  <p className="row-desc">{leak.desc}</p>
                </div>
                <div className="row-loss">
                  <motion.span 
                    className="loss-amt"
                    whileInView={{ scale: [0.96, 1.02, 1] }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  >
                    {leak.loss}
                  </motion.span>
                  <span className="loss-word">{leak.lossWord}</span>
                </div>
              </div>

              {index < content.problem.leaks.length - 1 && (
                <svg 
                  className="row-divider" 
                  viewBox="0 0 1200 2" 
                  preserveAspectRatio="none" 
                  aria-hidden="true"
                >
                  <path d="M0,1 L1200,1" stroke="rgba(0,55,180,0.12)" strokeWidth="1" fill="none" />
                </svg>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
