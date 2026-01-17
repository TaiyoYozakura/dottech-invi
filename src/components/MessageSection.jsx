import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../utils/useScrollAnimation';

const MessageSection = ({ message }) => {
  const [messageRef, isVisible] = useScrollAnimation(2);
  const [animatedWords, setAnimatedWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const lines = message.split('\n');
  const lastLine = lines[lines.length - 1];
  const lastLineWords = lastLine.trim().split(' ');
  const wordsToAnimate = lastLineWords.slice(-4);
  const staticMessage = lines.slice(0, -1).join('\n') + '\n' + lastLineWords.slice(0, -4).join(' ');

  useEffect(() => {
    if (isVisible && currentWordIndex < wordsToAnimate.length) {
      const timer = setTimeout(() => {
        setAnimatedWords(prev => [...prev, wordsToAnimate[currentWordIndex]]);
        setCurrentWordIndex(prev => prev + 1);
      }, 200);
      return () => clearTimeout(timer);
    }
    if (!isVisible) {
      setAnimatedWords([]);
      setCurrentWordIndex(0);
    }
  }, [isVisible, currentWordIndex, wordsToAnimate]);

  return (
    <section className="message-section" ref={messageRef}>
      <div className="section-content">
        <motion.div 
          className="terminal-window"
          initial={{ rotateX: 45, y: 100, opacity: 0 }}
          animate={isVisible ? { rotateX: 0, y: 0, opacity: 1 } : { rotateX: 45, y: 100, opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
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
                {staticMessage}{' '}
                {animatedWords.map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {word}{' '}
                  </motion.span>
                ))}
                {currentWordIndex < wordsToAnimate.length && <span className="terminal-cursor">|</span>}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MessageSection;