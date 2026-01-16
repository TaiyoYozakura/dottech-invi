import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const statuses = [
    'INITIALIZING NEURAL LINK...',
    'SCANNING QUANTUM SIGNATURES...',
    'DECRYPTING INVITATION DATA...',
    'ESTABLISHING HOLOGRAPHIC CONNECTION...',
    'SYNCHRONIZING CYBERNETIC PROTOCOLS...',
    'LOADING COMPLETE...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 20;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 500);
          }, 500);
          return 100;
        }
        return newProgress;
      });

      setStatusIndex(prev => {
        if (prev < statuses.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete, statuses.length]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'var(--darker-bg)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999999,
          }}
        >
          <div className="loading-content" style={{ textAlign: 'center', padding: '20px' }}>
            <motion.div
              className="loading-logo"
              style={{
                width: 'clamp(150px, 40vw, 200px)',
                height: 'clamp(150px, 40vw, 200px)',
                margin: '0 auto clamp(25px, 5vw, 40px)',
                position: 'relative'
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: '3px solid var(--neon-cyan)',
                    borderRadius: '50%',
                    borderTopColor: 'transparent',
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: index * 0.5
                  }}
                />
              ))}
              <motion.div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: 'clamp(50px, 12vw, 80px)',
                }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                ⚡
              </motion.div>
            </motion.div>

            <motion.h2
              className="loading-text glitch"
              data-text="DECRYPTING"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: 'clamp(24px, 6vw, 36px)',
                marginBottom: 'clamp(20px, 4vw, 30px)',
                letterSpacing: 'clamp(4px, 1vw, 8px)',
                color: 'var(--neon-cyan)'
              }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              DECRYPTING
            </motion.h2>

            <div
              className="loading-bar"
              style={{
                width: 'min(90%, 400px)',
                height: 'clamp(4px, 1vw, 6px)',
                background: 'rgba(0, 243, 255, 0.2)',
                borderRadius: '10px',
                overflow: 'hidden',
                margin: '0 auto clamp(15px, 3vw, 20px)',
                boxShadow: 'inset 0 0 15px rgba(0, 243, 255, 0.5)',
              }}
            >
              <motion.div
                className="loading-progress"
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-pink), var(--neon-green))',
                  boxShadow: '0 0 25px var(--neon-cyan)',
                }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <motion.p
              className="loading-status"
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                color: 'var(--neon-green)',
                fontSize: 'clamp(13px, 3vw, 16px)',
                letterSpacing: 'clamp(1px, 0.3vw, 2px)',
              }}
              key={statusIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {statuses[statusIndex]}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;