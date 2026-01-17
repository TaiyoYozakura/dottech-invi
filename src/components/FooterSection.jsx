import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../utils/useScrollAnimation';

const FooterSection = () => {
  const [footerRef, isVisible] = useScrollAnimation();

  return (
    <section className="footer-section" ref={footerRef}>
      <div className="footer-waves"></div>
      <div className="footer-grid"></div>

      <div className="section-content">
        <motion.div 
          className="footer-text"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5 }}
        >
          <div className="footer-highlight">
            YOUR PRESENCE WILL SHAPE THE FUTURE
          </div>
          <div className="footer-normal">
            JOIN US AT THE INNOVATION FRONTIER
          </div>
        </motion.div>

        <motion.div 
          className="footer-binary"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div 
            className="binary-block"
            whileHover={{ y: -10, scale: 1.08, boxShadow: '0 20px 60px rgba(0, 243, 255, 0.8)' }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            DOTTECH
          </motion.div>
        </motion.div>

        <motion.div 
          className="footer-signature"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="signature-line"></div>
          <span>DOTTECH_PROTOCOL_2026</span>
          <div className="signature-line"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default FooterSection;