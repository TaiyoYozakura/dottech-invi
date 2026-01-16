import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGSAPAnimation } from '../hooks/useGSAP';

const MessageSection = ({ message }) => {
  const messageRef = useGSAPAnimation();
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < message.length) {
        setDisplayedText(message.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [message]);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <section className="message-section" ref={messageRef}>
      <div className="section-content">
        <motion.div 
          className="terminal-window"
          initial={{ rotateX: 45, y: 100, opacity: 0 }}
          whileInView={{ rotateX: 0, y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="terminal-header">
            <div className="terminal-controls">
              <span className="terminal-dot red"></span>
              <span className="terminal-dot yellow"></span>
              <span className="terminal-dot green"></span>
            </div>
            <span className="terminal-title">INVITATION_MESSAGE.TECH</span>
            <div className="terminal-status">
              <span className="status-indicator"></span>
              <span>ACTIVE</span>
            </div>
          </div>

          <div className="terminal-body">
            <p className="terminal-prompt">
              <span className="prompt-icon">➜</span>
              <span className="prompt-path">~/Dottech/invitation</span>
              <span className="prompt-symbol">$</span>
              <span className="prompt-cmd">.tech message.txt</span>
            </p>
            
            <div className="message-output">
              <p className="message-text">
                {displayedText}
                {showCursor && <span className="terminal-cursor">|</span>}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MessageSection;