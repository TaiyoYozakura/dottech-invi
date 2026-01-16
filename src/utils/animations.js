import { useEffect, useState } from 'react';

export const useDeviceType = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth <= 768;
      const lowEnd = navigator.hardwareConcurrency <= 4 || 
                    (navigator.deviceMemory && navigator.deviceMemory <= 4);
      
      setIsMobile(mobile);
      setIsLowEnd(lowEnd);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { isMobile, isLowEnd };
};

export const getAnimationVariants = (isMobile, isLowEnd) => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (reducedMotion || isLowEnd) {
    return {
      fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3 }
      }
    };
  }

  return {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };
};

export const getCSSAnimations = (isMobile, isLowEnd) => {
  if (isLowEnd) {
    return {
      willChange: 'auto',
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden'
    };
  }

  return {
    willChange: 'transform, opacity',
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden'
  };
};