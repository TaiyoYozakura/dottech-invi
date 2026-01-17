import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../utils/useScrollAnimation';

const DepartmentSection = ({ deptName, deptId }) => {
  const [deptRef, isVisible] = useScrollAnimation(2);

  return (
    <section className="dept-section" ref={deptRef}>
      <div className="section-bg">
        <div className="grid-3d"></div>
      </div>

      <div className="section-content">
        <div className="data-header">
          <span className="data-label">// RECIPIENT_IDENTIFIED</span>
          <div className="header-line"></div>
        </div>

        <div className="dept-container">
          <motion.div 
            className="dept-frame"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="frame-corner tl"></div>
            <div className="frame-corner tr"></div>
            <div className="frame-corner bl"></div>
            <div className="frame-corner br"></div>

            <h2 className="dept-name">
              <span className="dept-text">{deptName}</span>
            </h2>

            <div className="dept-id-badge">
              <span className="badge-label">DEPT_ID:</span>
              <span className="badge-value">{deptId}</span>
            </div>
          </motion.div>

          <div className="holo-lines">
            <div className="holo-line"></div>
            <div className="holo-line"></div>
            <div className="holo-line"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DepartmentSection;