import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const MailEnvelope = ({ onComplete }) => {
  const envelopeRef = useRef(null);
  const flapRef = useRef(null);
  const contentRef = useRef(null);
  const [showContent, setShowContent] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const envelope = envelopeRef.current;
    const flap = flapRef.current;
    const content = contentRef.current;
    if (!envelope || !flap || isComplete) return;

    // Initial animation - envelope appears
    const initialAnim = gsap.fromTo(envelope, 
      { scale: 0.3, opacity: 0, rotation: -10 },
      { scale: 1, opacity: 1, rotation: 0, duration: 2, ease: "back.out(1.7)" }
    );

    // Floating animation
    const floatingAnim = gsap.to(envelope, {
      y: "+=20",
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });

    // Click handler
    const handleClick = () => {
      if (isClicked || isComplete) return;
      setIsClicked(true);
      
      // Kill floating animation
      floatingAnim.kill();
      
      const tl = gsap.timeline();
      
      // Open envelope - flap rotates upward like real mail
      tl.to(flap, {
        rotationX: -180,
        transformOrigin: "top center",
        duration: 1.5,
        ease: "power2.out"
      })
      // Wait then show website and fade envelope
      .to({}, { duration: 0.8 })
      .call(() => {
        setIsComplete(true);
        if (onComplete) onComplete();
      })
      .to(envelope, {
        scale: 0,
        opacity: 0,
        duration: 0,
        ease: "power2.in"
      });
    };

    envelope.addEventListener('click', handleClick);
    
    // Auto-open after 6 seconds if not clicked
    const autoOpen = setTimeout(() => {
      if (!isClicked && !isComplete) {
        handleClick();
      }
    }, 6000);

    return () => {
      envelope.removeEventListener('click', handleClick);
      clearTimeout(autoOpen);
      initialAnim.kill();
      floatingAnim.kill();
    };
  }, [onComplete]);

  if (isComplete) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        pointerEvents: 'none'
      }}
    >
      <div
        ref={envelopeRef}
        style={{
          width: 'clamp(400px, 50vw, 600px)',
          height: 'clamp(280px, 35vw, 420px)',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f1419 100%)',
          border: '4px solid var(--neon-cyan)',
          borderRadius: '15px',
          position: 'relative',
          boxShadow: 
            '0 0 60px rgba(0, 243, 255, 0.8), ' +
            '0 0 120px rgba(0, 243, 255, 0.4), ' +
            'inset 0 0 40px rgba(0, 243, 255, 0.1)',
          overflow: 'visible',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          pointerEvents: 'auto'
        }}>
        {/* Envelope body content */}
        <div style={{
          position: 'absolute',
          top: '70%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          zIndex: 5
        }}>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 'clamp(18px, 3vw, 24px)',
            color: 'var(--neon-green)',
            textShadow: '0 0 15px var(--neon-green)',
            letterSpacing: '2px'
          }}>
            {isClicked ? 'OPENING...' : 'CLICK TO OPEN'}
          </div>
        </div>

        {/* Envelope flap */}
        <div
          ref={flapRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '50%',
            background: 'linear-gradient(135deg, #0f3460 0%, #16213e 50%, #1a1a2e 100%)',
            border: '4px solid var(--neon-cyan)',
            borderBottom: 'none',
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            transformStyle: 'preserve-3d',
            zIndex: 10,
            boxShadow: '0 0 30px rgba(0, 243, 255, 0.5)'
          }}
        >
          {/* Flap decoration */}
          <div style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60px',
            height: '60px',
            border: '3px solid var(--neon-pink)',
            borderRadius: '50%',
            background: 'rgba(255, 0, 255, 0.1)',
            boxShadow: '0 0 20px rgba(255, 0, 255, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>
            ⚡
          </div>
        </div>



        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '20px',
          height: '20px',
          background: 'var(--neon-pink)',
          borderRadius: '50%',
          boxShadow: '0 0 15px var(--neon-pink)',
          animation: 'pulse 2s infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          width: '15px',
          height: '15px',
          background: 'var(--neon-green)',
          borderRadius: '50%',
          boxShadow: '0 0 15px var(--neon-green)',
          animation: 'pulse 2s infinite 0.5s'
        }} />
      </div>
    </div>
  );
};

export default MailEnvelope;