import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ParallaxElement = () => {
  const parallaxRef = useRef(null);
  const layer1Ref = useRef(null);
  const layer2Ref = useRef(null);
  const layer3Ref = useRef(null);

  useEffect(() => {
    const element = parallaxRef.current;
    const layer1 = layer1Ref.current;
    const layer2 = layer2Ref.current;
    const layer3 = layer3Ref.current;

    if (!element || !layer1 || !layer2 || !layer3) return;

    // Different parallax speeds for each layer
    gsap.to(layer1, {
      yPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    gsap.to(layer2, {
      yPercent: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    gsap.to(layer3, {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div 
      ref={parallaxRef}
      className="parallax-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    >
      {/* Layer 1 - Fastest moving */}
      <div
        ref={layer1Ref}
        className="parallax-layer-1"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '120%',
          background: `
            radial-gradient(circle at 20% 20%, rgba(0, 243, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 0, 255, 0.08) 0%, transparent 50%)
          `,
          opacity: 0.6
        }}
      />

      {/* Layer 2 - Medium speed */}
      <div
        ref={layer2Ref}
        className="parallax-layer-2"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '110%',
          background: `
            linear-gradient(45deg, transparent 48%, rgba(0, 255, 157, 0.05) 50%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(157, 0, 255, 0.05) 50%, transparent 52%)
          `,
          backgroundSize: '100px 100px',
          opacity: 0.4
        }}
      />

      {/* Layer 3 - Slowest moving */}
      <div
        ref={layer3Ref}
        className="parallax-layer-3"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '105%',
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 98px,
              rgba(0, 243, 255, 0.02) 100px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 98px,
              rgba(255, 0, 255, 0.02) 100px
            )
          `,
          opacity: 0.3
        }}
      />
    </div>
  );
};

export default ParallaxElement;