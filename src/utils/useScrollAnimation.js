import { useEffect, useState, useRef } from 'react';

export const useScrollAnimation = (maxRuns = 2) => {
  const [isVisible, setIsVisible] = useState(false);
  const [runCount, setRunCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (runCount < maxRuns) {
          setIsVisible(entry.isIntersecting);
          if (entry.isIntersecting) {
            setRunCount(prev => prev + 1);
          }
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [runCount, maxRuns]);

  return [ref, isVisible, runCount < maxRuns];
};
