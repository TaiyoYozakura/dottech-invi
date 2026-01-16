import React from 'react';
import { motion } from 'framer-motion';
import { useGSAPAnimation } from '../hooks/useGSAP';

const HeroSection = ({ eventName, tagline }) => {
  const heroRef = useGSAPAnimation();

  const taglineParts = tagline.split('•').map(word => word.trim());

  return (
    <section className="hero-section" ref={heroRef}>
      <div className="hero-content">
        <div className="glitch-wrapper">
          <h1 className="hero-title glitch" data-text={eventName}>
            {eventName}
          </h1>
        </div>

        <div className="year-display">
          {['2', '0', '2', '6'].map((digit, index) => (
            <motion.div
              key={index}
              className="year-cube"
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
            >
              <span className="year-face front">{digit}</span>
              <span className="year-face back">{digit}</span>
            </motion.div>
          ))}
        </div>

        <div className="hero-subtitle">
          {taglineParts.map((word, index) => (
            <React.Fragment key={index}>
              <motion.span
                className="subtitle-word"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.2, duration: 0.6 }}
              >
                {word}
              </motion.span>
              {index < taglineParts.length - 1 && (
                <span className="subtitle-dot">•</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <div className="scroll-icon-mobile">
            <div className="swipe-hand">👆</div>
            <div className="swipe-lines">
              <div className="swipe-line"></div>
              <div className="swipe-line"></div>
              <div className="swipe-line"></div>
            </div>
          </div>
          <span className="scroll-text">SWIPE</span>
          <div className="scroll-arrow">↓</div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;