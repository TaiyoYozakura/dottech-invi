import React from 'react';
import { motion } from 'framer-motion';
import { useGSAPAnimation } from '../hooks/useGSAP';

const DetailsSection = ({ date, time, venue }) => {
  const detailsRef = useGSAPAnimation();

  const cardVariants = {
    hidden: { x: -120, y: 80, rotateY: -30, opacity: 0 },
    visible: (i) => ({
      x: 0,
      y: 0,
      rotateY: 0,
      opacity: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: "easeOut"
      }
    })
  };

  return (
    <section className="details-section" ref={detailsRef}>
      <div className="section-content">
        <div className="details-grid">
          <motion.div 
            className="detail-card"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            custom={0}
            viewport={{ once: true }}
            whileHover={{ y: -12, scale: 1.03 }}
          >
            <div className="card-icon">📅</div>
            <div className="card-label">DATE_PROTOCOL</div>
            <div className="card-value">{date}</div>
          </motion.div>

          <motion.div 
            className="detail-card"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            custom={1}
            viewport={{ once: true }}
            whileHover={{ y: -12, scale: 1.03 }}
          >
            <div className="card-icon">⏰</div>
            <div className="card-label">TIME_SYNC</div>
            <div className="card-value">{time}</div>
          </motion.div>

          <motion.div 
            className="detail-card"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            custom={2}
            viewport={{ once: true }}
            whileHover={{ y: -12, scale: 1.03 }}
          >
            <div className="card-icon">📍</div>
            <div className="card-label">LOCATION_COORDS</div>
            <div className="card-value">{venue}</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DetailsSection;