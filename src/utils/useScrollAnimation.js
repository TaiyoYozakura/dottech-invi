import { useEffect, useState, useRef } from 'react';

export const useScrollAnimation = (maxRuns = 2) => {
  const [isVisible, setIsVisible] = useState(false);
  const [runCount, setRunCount] = useState(0);
  const ref = useRef(null);
  const wasVisible = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const nowVisible = entry.isIntersecting;
        
        if (runCount < maxRuns) {
          setIsVisible(nowVisible);
          
          if (nowVisible && !wasVisible.current) {
            setRunCount(prev => prev + 1);
          }
        }
        
        wasVisible.current = nowVisible;
      },
      { threshold: 0.2, rootMargin: '0px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [runCount, maxRuns]);

  return [ref, isVisible, runCount < maxRuns];
};
