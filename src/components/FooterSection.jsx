import React from 'react';
import { motion } from 'framer-motion';
import { useGSAPAnimation } from '../hooks/useGSAP';

const FooterSection = () => {
  const footerRef = useGSAPAnimation();

  return (
    <section className="footer-section" ref={footerRef}>
      <div className="footer-waves"></div>
      <div className="footer-grid"></div>

      <div className="section-content">
        <motion.div 
          className="footer-text"
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
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
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
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
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
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