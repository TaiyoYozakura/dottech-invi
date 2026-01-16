import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useStore } from './utils/store';
import { DatabaseService } from './utils/database';
import MailEnvelope from './components/MailEnvelope';
import HeroSection from './components/HeroSection';
import DepartmentSection from './components/DepartmentSection';
import MessageSection from './components/MessageSection';
import DetailsSection from './components/DetailsSection';
import HighlightsSection from './components/HighlightsSection';
import FooterSection from './components/FooterSection';
import ParallaxElement from './components/ParallaxElement';
import AdminPanel from './components/AdminPanel';
import './styles/global.css';

const PROFESSIONAL_INVITATION = `Dear Esteemed Participant,

We are honored to extend this exclusive invitation to you for DOTTECH 2026, the flagship technological symposium that brings together the brightest minds in innovation and engineering.

This prestigious event will showcase cutting-edge developments in artificial intelligence, robotics, quantum computing, and next-generation technologies. Join us for an immersive experience featuring expert-led workshops, competitive hackathons, industry insights, and unparalleled networking opportunities.

Your participation will contribute to shaping the future of technology and fostering collaborative innovation across disciplines. We look forward to welcoming you to this transformative gathering of visionaries and pioneers.

Mark your calendars and prepare to be part of technological excellence.

Warm Regards,
DOTTECH Organizing Committee`;

const DEFAULT_HIGHLIGHTS = ['HACK A MIN', 'UNLOCK VERSE', 'VIRTUAL STOCK MARKET', 'CODE EVOLUTION', 'QR TECH HUNT', 'LAN GAMING'];

const defaultDepartments = {
  'BSCCSIT': {
    name: 'BSc COMPUTER SCIENCE & IT',
    eventName: 'DOTTECH',
    tagline: 'CODE • INNOVATE • TRANSFORM',
    date: 'JANUARY 30-31, 2026',
    time: '07:00 AM - 6:00 PM',
    venue: 'BSc CS/IT COMPUTER LAB',
    message: PROFESSIONAL_INVITATION,
    highlights: DEFAULT_HIGHLIGHTS
  },
  'BMS': {
    name: 'BACHELOR OF MANAGEMENT STUDIES',
    eventName: 'DOTTECH',
    tagline: 'LEAD • MANAGE • SUCCEED',
    date: 'JANUARY 30-31, 2026',
    time: '07:00 AM - 6:00 PM',
    venue: 'BMS SEMINAR HALL',
    message: PROFESSIONAL_INVITATION,
    highlights: DEFAULT_HIGHLIGHTS
  },
  'BBA': {
    name: 'BACHELOR OF BUSINESS ADMINISTRATION',
    eventName: 'DOTTECH',
    tagline: 'STRATEGIZE • EXECUTE • EXCEL',
    date: 'JANUARY 30-31, 2026',
    time: '07:00 AM - 6:00 PM',
    venue: 'BBA CONFERENCE ROOM',
    message: PROFESSIONAL_INVITATION,
    highlights: DEFAULT_HIGHLIGHTS
  },
  'PUBLIC': {
    name: 'PUBLIC INVITATION',
    eventName: 'DOTTECH',
    tagline: 'INNOVATE • DOMINATE • ELEVATE',
    date: 'JANUARY 30-31, 2026',
    time: '07:00 AM - 6:00 PM',
    venue: 'MAIN AUDITORIUM NEXUS',
    message: PROFESSIONAL_INVITATION,
    highlights: DEFAULT_HIGHLIGHTS
  }
};

function App() {
  const [showLoading, setShowLoading] = useState(true);
  const { departments, setDepartments, setCurrentDept, setLoading } = useStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔥 Loading from Firebase...');
        const firebaseDepts = await DatabaseService.loadAllDepartments();
        
        if (Object.keys(firebaseDepts).length > 0) {
          console.log('✅ Loaded from Firebase:', Object.keys(firebaseDepts));
          setDepartments({ ...defaultDepartments, ...firebaseDepts });
          DatabaseService.syncWithLocalStorage({ ...defaultDepartments, ...firebaseDepts });
        } else {
          const localDepts = DatabaseService.loadFromLocalStorage();
          if (Object.keys(localDepts).length > 0) {
            setDepartments({ ...defaultDepartments, ...localDepts });
          } else {
            setDepartments(defaultDepartments);
            DatabaseService.syncWithLocalStorage(defaultDepartments);
          }
        }
      } catch (error) {
        console.error('❌ Firebase error, using defaults:', error);
        const localDepts = DatabaseService.loadFromLocalStorage();
        if (Object.keys(localDepts).length > 0) {
          setDepartments({ ...defaultDepartments, ...localDepts });
        } else {
          setDepartments(defaultDepartments);
        }
      }
      setLoading(false);
    };

    loadData();
    
    // Get department from URL
    const params = new URLSearchParams(window.location.search);
    const deptId = params.get('dept');
    setCurrentDept(deptId);
  }, [setDepartments, setCurrentDept, setLoading]);

  // Initialize Firebase when loading completes (envelope clicked)
  const handleLoadingComplete = () => {
    setShowLoading(false);
  };



  const getCurrentDepartment = () => {
    const params = new URLSearchParams(window.location.search);
    const deptId = params.get('dept');
    
    if (deptId && departments[deptId.toUpperCase()]) {
      return { dept: departments[deptId.toUpperCase()], id: deptId.toUpperCase() };
    }
    
    return { 
      dept: departments['PUBLIC'] || defaultDepartments['PUBLIC'], 
      id: 'PUBLIC' 
    };
  };

  const { dept: currentDept, id: currentDeptId } = getCurrentDepartment();
  const showDeptSection = currentDeptId !== 'PUBLIC';

  return (
    <Router>
      <div className="App">
        {/* Parallax Background */}
        <ParallaxElement />
        
        {/* Cyber Grid Background */}
        <div className="cyber-grid"></div>
        
        {/* Admin Panel */}
        <AdminPanel />
        
        {showLoading ? (
          <MailEnvelope onComplete={handleLoadingComplete} />
        ) : (
          <Routes>
            <Route 
              path="/" 
              element={
                <main>
                  <HeroSection 
                    eventName={currentDept.eventName}
                    tagline={currentDept.tagline}
                  />
                  
                  {showDeptSection && (
                    <DepartmentSection 
                      deptName={currentDept.name}
                      deptId={currentDeptId}
                    />
                  )}
                  
                  <MessageSection 
                    message={currentDept.message}
                  />
                  
                  <DetailsSection 
                    date={currentDept.date}
                    time={currentDept.time}
                    venue={currentDept.venue}
                  />
                  
                  <HighlightsSection 
                    highlights={currentDept.highlights}
                  />
                  
                  <FooterSection />
                </main>
              } 
            />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;