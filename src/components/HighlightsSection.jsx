import React from 'react';
import { motion } from 'framer-motion';
import { useGSAPAnimation } from '../hooks/useGSAP';

const HighlightsSection = ({ highlights }) => {
  const highlightsRef = useGSAPAnimation();

  const icons = ['🧠', '🔓', '📈', '⚡', '🔍', '🎮', '💻', '🚀'];

  const boxVariants = {
    hidden: { y: 120, scale: 0.7, opacity: 0 },
    visible: (i) => ({
      y: 0,
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  return (
    <section className="highlights-section" ref={highlightsRef}>
      <div className="section-content">
        <motion.h3 
          className="section-title"
          initial={{ scale: 0.6, y: 50, opacity: 0 }}
          whileInView={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="glitch" data-text="TECH ARENAS • EVENTS">
            TECH ARENAS • EVENTS
          </span>
          <div className="title-underline"></div>
        </motion.h3>

        <div className="highlights-container">
          {highlights.map((highlight, index) => (
            <motion.div
              key={index}
              className="highlight-box"
              variants={boxVariants}
              initial="hidden"
              whileInView="visible"
              custom={index}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10, 
                scale: 1.05,
                borderColor: 'var(--neon-pink)',
                backgroundColor: 'rgba(0, 243, 255, 0.15)'
              }}
            >
              <div className="box-icon">{icons[index % icons.length]}</div>
              <span className="box-text">{highlight.toUpperCase().replace(/ /g, '_')}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HighlightsSection;