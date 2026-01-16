import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';
import { useStore } from '../utils/store';
import { DatabaseService } from '../utils/database';
import { testFirebaseConnection } from '../utils/firebaseTest';

const AdminPanel = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    eventName: 'DOTTECH',
    tagline: 'INNOVATE • DOMINATE • ELEVATE',
    date: 'JANUARY 30-31, 2026',
    time: '07:00 AM - 6:00 PM',
    venue: 'MAIN AUDITORIUM NEXUS',
    message: '',
    highlights: []
  });
  const [deptId, setDeptId] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [isLoadingDepts, setIsLoadingDepts] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [showFlushBtn, setShowFlushBtn] = useState(true);
  const [isFlushing, setIsFlushing] = useState(false);
  const [highlightsInput, setHighlightsInput] = useState('');

  const { departments, setDepartments, addDepartment } = useStore();

  const ADMIN_PASSWORD = 'admin123';
  const SUPER_ADMIN_PASSWORD = 'su_root-p';

  // Check for secret URL parameter on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('secret') === 'admin') {
      setShowLogin(true);
    }
  }, []);

  // Keyboard shortcut for admin panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setShowLogin(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogin = async () => {
    if (password === ADMIN_PASSWORD) {
      setShowLogin(false);
      setShowPanel(true);
      setPassword('');
      setIsSuperAdmin(false);
      
      // Load departments from Firebase when admin panel opens
      await loadDepartmentsFromFirebase();
    } else if (password === SUPER_ADMIN_PASSWORD) {
      setShowLogin(false);
      setShowPanel(true);
      setPassword('');
      setIsSuperAdmin(true);
      setShowFlushBtn(true); // Super admin can always see flush button
      
      // Load departments from Firebase when admin panel opens
      await loadDepartmentsFromFirebase();
    } else {
      alert('❌ ACCESS DENIED: INVALID CREDENTIALS');
      setPassword('');
    }
  };

  const loadDepartmentsFromFirebase = async () => {
    setIsLoadingDepts(true);
    try {
      console.log('🔥 Starting Firebase load...');
      const firebaseDepts = await DatabaseService.loadAllDepartments();
      console.log('📊 Firebase response:', firebaseDepts);
      
      const localDepts = DatabaseService.loadFromLocalStorage();
      console.log('💾 Local storage data:', localDepts);
      
      // Merge Firebase and localStorage data (Firebase takes priority)
      const mergedDepts = { ...localDepts, ...firebaseDepts };
      console.log('🔄 Merged departments:', mergedDepts);
      
      setDepartments(mergedDepts);
      DatabaseService.syncWithLocalStorage(mergedDepts);
      
      console.log('✅ Loaded departments:', Object.keys(mergedDepts));
    } catch (error) {
      console.error('❌ Failed to load from Firebase:', error);
      const localDepts = DatabaseService.loadFromLocalStorage();
      console.log('📱 Fallback to localStorage:', localDepts);
      setDepartments(localDepts);
    }
    setIsLoadingDepts(false);
  };

  const loadDepartment = (deptKey) => {
    if (departments[deptKey]) {
      const dept = departments[deptKey];
      setFormData({
        name: dept.name || '',
        eventName: dept.eventName || 'DOTTECH',
        tagline: dept.tagline || 'INNOVATE • DOMINATE • ELEVATE',
        date: dept.date || 'JANUARY 30-31, 2026',
        time: dept.time || '07:00 AM - 6:00 PM',
        venue: dept.venue || 'MAIN AUDITORIUM NEXUS',
        message: dept.message || '',
        highlights: dept.highlights || []
      });
      setDeptId(deptKey);
      setSelectedDept(deptKey);
      setHighlightsInput((dept.highlights || []).join(', '));
    }
  };

  const handleSave = async () => {
    if (!deptId || !formData.name) {
      alert('⚠️ Please fill required fields: Department ID and Name');
      return;
    }

    setIsSaving(true);
    const finalDeptId = deptId.toUpperCase();
    const dataToSave = {
      ...formData,
      deptId: finalDeptId,
      savedAt: new Date().toISOString()
    };
    
    console.log('💾 Saving data:', dataToSave);
    
    try {
      // Save to Firebase first
      const firebaseSuccess = await DatabaseService.saveDepartment(finalDeptId, dataToSave);
      
      if (firebaseSuccess) {
        console.log('✅ Firebase save successful');
        // Update local state
        addDepartment(finalDeptId, dataToSave);
        
        // Sync with localStorage as backup
        const allDepts = { ...departments, [finalDeptId]: dataToSave };
        DatabaseService.syncWithLocalStorage(allDepts);
        
        alert('✅ Department saved to Firebase successfully!');
        
        // Reload departments to update dropdown
        await loadDepartmentsFromFirebase();
      } else {
        console.log('⚠️ Firebase save failed, using localStorage');
        // Fallback to localStorage only
        addDepartment(finalDeptId, dataToSave);
        const allDepts = { ...departments, [finalDeptId]: dataToSave };
        DatabaseService.syncWithLocalStorage(allDepts);
        
        alert('⚠️ Saved locally (Firebase unavailable)');
      }
    } catch (error) {
      console.error('❌ Save error:', error);
      alert('❌ Save failed: ' + error.message);
    }
    
    setIsSaving(false);
  };

  const generateQR = () => {
    if (!deptId.trim()) {
      alert('⚠️ Please enter Department ID first');
      return;
    }

    const invitationUrl = `${window.location.origin}${window.location.pathname}?dept=${deptId.toUpperCase().trim()}`;
    
    QRCode.toDataURL(invitationUrl, {
      width: 400,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' }
    })
      .then(dataUrl => {
        setQrUrl(dataUrl);
        console.log('✅ QR Code generated for:', invitationUrl);
      })
      .catch(error => {
        console.error('❌ QR generation failed:', error);
        alert('Failed to generate QR code');
      });
  };

  const downloadQR = () => {
    if (!qrUrl) return;
    
    const link = document.createElement('a');
    link.download = `DOTTECH-${deptId}-invitation.png`;
    link.href = qrUrl;
    link.click();
  };

  const flushAllData = async () => {
    if (!confirm('🚨 FLUSH ALL DATA?\n\nThis will DELETE ALL departments from Firebase and localStorage!\n\nThis action CANNOT be undone!')) {
      return;
    }
    
    setIsFlushing(true);
    try {
      // Get all departments and delete them
      const allDepts = await DatabaseService.loadAllDepartments();
      for (const deptId of Object.keys(allDepts)) {
        await DatabaseService.deleteDepartment(deptId);
      }
      
      // Clear localStorage
      localStorage.removeItem('dottech-departments');
      
      // Clear local state
      setDepartments({});
      
      alert('✅ All data flushed successfully!');
      
      // Hide flush button for regular admin
      if (!isSuperAdmin) {
        setShowFlushBtn(false);
      }
      
      // Reset form
      setFormData({
        name: '',
        eventName: 'DOTTECH',
        tagline: 'INNOVATE • DOMINATE • ELEVATE',
        date: 'JANUARY 30-31, 2026',
        time: '07:00 AM - 6:00 PM',
        venue: 'MAIN AUDITORIUM NEXUS',
        message: '',
        highlights: []
      });
      setDeptId('');
      setSelectedDept('');
      setHighlightsInput('');
    } catch (error) {
      alert('❌ Flush failed: ' + error.message);
    }
    setIsFlushing(false);
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    const result = await testFirebaseConnection();
    if (result) {
      alert('✅ Firebase connection working!');
    } else {
      alert('❌ Firebase connection failed - check console for details');
    }
    setIsTestingConnection(false);
  };

  const deleteDept = async () => {
    if (!selectedDept) {
      alert('⚠️ No department selected');
      return;
    }

    if (confirm(`🗑️ DELETE DEPARTMENT: ${selectedDept}?\n\nThis will remove it from Firebase and local storage!\n\nThis action CANNOT be undone!`)) {
      setIsDeleting(true);
      
      try {
        // Delete from Firebase
        await DatabaseService.deleteDepartment(selectedDept);
        
        // Delete from local storage
        const allDepts = { ...departments };
        delete allDepts[selectedDept];
        DatabaseService.syncWithLocalStorage(allDepts);
        
        alert('✅ Department deleted from Firebase successfully!');
        
        // Reset form
        setFormData({
          name: '',
          eventName: 'DOTTECH',
          tagline: 'INNOVATE • DOMINATE • ELEVATE',
          date: 'JANUARY 30-31, 2026',
          time: '07:00 AM - 6:00 PM',
          venue: 'MAIN AUDITORIUM NEXUS',
          message: '',
          highlights: []
        });
        setDeptId('');
        setSelectedDept('');
        
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        alert('❌ Delete failed: ' + error);
      }
      
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            className="admin-login-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(5, 8, 22, 0.97)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 100000,
              padding: '20px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <motion.div
              className="login-box"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{
                background: 'var(--card-glass)',
                border: '3px solid var(--neon-cyan)',
                padding: 'clamp(30px, 5vw, 50px)',
                maxWidth: '500px',
                width: '90%',
                clipPath: 'polygon(25px 0, 100% 0, 100% calc(100% - 25px), calc(100% - 25px) 100%, 0 100%, 0 25px)',
                boxShadow: '0 0 80px rgba(0, 243, 255, 0.6)',
                position: 'relative',
                margin: 'auto'
              }}
            >
              <button
                onClick={() => setShowLogin(false)}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '20px',
                  fontSize: '35px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--neon-pink)',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>

              <h2 style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: 'clamp(20px, 5vw, 28px)',
                marginBottom: '30px',
                textAlign: 'center',
                color: 'var(--neon-cyan)'
              }}>
                ACCESS CONTROL
              </h2>



              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  display: 'block',
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: '13px',
                  color: 'var(--neon-green)',
                  marginBottom: '10px',
                  letterSpacing: '2px'
                }}>
                  ADMIN_PASSWORD:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="ENTER PASSWORD"
                  style={{
                    width: '100%',
                    background: 'rgba(0, 243, 255, 0.08)',
                    border: '2px solid var(--neon-cyan)',
                    color: 'var(--neon-cyan)',
                    padding: '14px',
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: '16px',
                    clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
                  }}
                />
              </div>

              <button
                onClick={handleLogin}
                disabled={isLoadingDepts}
                style={{
                  background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
                  border: 'none',
                  color: '#fff',
                  padding: '16px 35px',
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                  boxShadow: '0 5px 30px rgba(0, 243, 255, 0.5)',
                  width: '100%',
                  opacity: isLoadingDepts ? 0.7 : 1
                }}
              >
                {isLoadingDepts ? '⏳ LOADING...' : 'AUTHENTICATE'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            className="admin-panel"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              position: 'fixed',
              top: '0',
              left: '0',
              width: '100vw',
              height: '100vh',
              background: 'var(--card-glass)',
              border: '3px solid var(--neon-cyan)',
              padding: 'clamp(10px, 3vw, 20px)',
              overflowY: 'auto',
              zIndex: 100001,
              boxShadow: '0 0 100px rgba(0, 243, 255, 0.7)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Animated Background */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              zIndex: -1
            }}>
              <div style={{
                position: 'absolute',
                top: '20%',
                left: '10%',
                width: '80%',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(0, 243, 255, 0.5), transparent)',
                animation: 'pulse 3s ease-in-out infinite'
              }} />
              <div style={{
                position: 'absolute',
                top: '60%',
                left: '5%',
                width: '90%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(0, 255, 157, 0.5), transparent)',
                animation: 'pulse 4s ease-in-out infinite reverse'
              }} />
              <div style={{
                position: 'absolute',
                top: '15%',
                left: '25%',
                width: '4px',
                height: '4px',
                background: 'var(--neon-cyan)',
                borderRadius: '50%',
                animation: 'float 6s ease-in-out infinite',
                boxShadow: '0 0 10px var(--neon-cyan)'
              }} />
              <div style={{
                position: 'absolute',
                top: '70%',
                right: '30%',
                width: '3px',
                height: '3px',
                background: 'var(--neon-green)',
                borderRadius: '50%',
                animation: 'float 4s ease-in-out infinite reverse',
                boxShadow: '0 0 8px var(--neon-green)'
              }} />
            </div>
            
            <div style={{
              maxWidth: '800px',
              margin: '0 auto',
              padding: 'clamp(10px, 3vw, 20px)',
              width: '100%'
            }}>
              <button
                onClick={() => setShowPanel(false)}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '20px',
                  fontSize: '40px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--neon-pink)',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>

            <h2 style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 'clamp(20px, 5vw, 32px)',
              marginBottom: '20px',
              textAlign: 'center',
              color: 'var(--neon-cyan)'
            }}>
              🔥 FIREBASE INVITATION MANAGER
            </h2>

            <div style={{ 
              textAlign: 'center', 
              marginBottom: '30px',
              padding: '10px',
              background: 'rgba(0, 255, 157, 0.1)',
              border: '1px solid var(--neon-green)',
              borderRadius: '5px'
            }}>
              <p style={{ 
                color: 'var(--neon-green)', 
                fontSize: '14px',
                fontFamily: "'Share Tech Mono', monospace",
                marginBottom: '10px'
              }}>
                ☁️ Data synced with Firebase Database
              </p>
              <button
                onClick={testConnection}
                disabled={isTestingConnection}
                style={{
                  background: 'linear-gradient(135deg, var(--neon-green), var(--neon-blue))',
                  border: 'none',
                  color: '#fff',
                  padding: '8px 16px',
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  borderRadius: '4px',
                  opacity: isTestingConnection ? 0.7 : 1
                }}
              >
                {isTestingConnection ? '🔄 TESTING...' : '🔥 TEST CONNECTION'}
              </button>
            </div>

            {isLoadingDepts ? (
              <div style={{ 
                textAlign: 'center', 
                marginBottom: '20px',
                color: 'var(--neon-cyan)'
              }}>
                ⏳ Loading departments...
              </div>
            ) : null}

            {/* Department Selector */}
            {!isLoadingDepts && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: 'var(--neon-green)', marginBottom: '10px', fontFamily: "'Orbitron', sans-serif" }}>
                  SELECT EXISTING DEPARTMENT:
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedDept(value);
                    if (value) {
                      loadDepartment(value);
                    } else {
                      // Reset form for new department
                      setFormData({
                        name: '',
                        eventName: 'DOTTECH',
                        tagline: 'INNOVATE • DOMINATE • ELEVATE',
                        date: 'JANUARY 30-31, 2026',
                        time: '07:00 AM - 6:00 PM',
                        venue: 'MAIN AUDITORIUM NEXUS',
                        message: '',
                        highlights: []
                      });
                      setDeptId('');
                      setHighlightsInput('');
                    }
                  }}
                  style={{
                    width: '100%',
                    background: 'rgba(0, 243, 255, 0.08)',
                    border: '2px solid var(--neon-cyan)',
                    color: 'var(--neon-cyan)',
                    padding: '14px',
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: '16px'
                  }}
                >
                  <option value="">-- CREATE NEW --</option>
                  {Object.keys(departments).map(key => (
                    <option key={key} value={key}>
                      {key} - {departments[key].name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--neon-green)', marginBottom: '10px', fontFamily: "'Orbitron', sans-serif" }}>
                  DEPARTMENT_ID:
                </label>
                <input
                  type="text"
                  value={deptId}
                  onChange={(e) => setDeptId(e.target.value)}
                  placeholder="e.g., CSE, ECE, MECH"
                  style={{
                    width: '100%',
                    background: 'rgba(0, 243, 255, 0.08)',
                    border: '2px solid var(--neon-cyan)',
                    color: 'var(--neon-cyan)',
                    padding: '14px',
                    fontFamily: "'Share Tech Mono', monospace"
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--neon-green)', marginBottom: '10px', fontFamily: "'Orbitron', sans-serif" }}>
                  DEPARTMENT_NAME:
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="ENTER FULL NAME"
                  style={{
                    width: '100%',
                    background: 'rgba(0, 243, 255, 0.08)',
                    border: '2px solid var(--neon-cyan)',
                    color: 'var(--neon-cyan)',
                    padding: '14px',
                    fontFamily: "'Share Tech Mono', monospace"
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--neon-green)', marginBottom: '10px', fontFamily: "'Orbitron', sans-serif" }}>
                  EVENT_NAME:
                </label>
                <input
                  type="text"
                  value={formData.eventName}
                  onChange={(e) => setFormData({...formData, eventName: e.target.value})}
                  style={{
                    width: '100%',
                    background: 'rgba(0, 243, 255, 0.08)',
                    border: '2px solid var(--neon-cyan)',
                    color: 'var(--neon-cyan)',
                    padding: '14px',
                    fontFamily: "'Share Tech Mono', monospace"
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--neon-green)', marginBottom: '10px', fontFamily: "'Orbitron', sans-serif" }}>
                  TAGLINE:
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                  placeholder="INNOVATE • DOMINATE • ELEVATE"
                  style={{
                    width: '100%',
                    background: 'rgba(0, 243, 255, 0.08)',
                    border: '2px solid var(--neon-cyan)',
                    color: 'var(--neon-cyan)',
                    padding: '14px',
                    fontFamily: "'Share Tech Mono', monospace"
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--neon-green)', marginBottom: '10px', fontFamily: "'Orbitron', sans-serif" }}>
                  DATE:
                </label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  style={{
                    width: '100%',
                    background: 'rgba(0, 243, 255, 0.08)',
                    border: '2px solid var(--neon-cyan)',
                    color: 'var(--neon-cyan)',
                    padding: '14px',
                    fontFamily: "'Share Tech Mono', monospace"
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--neon-green)', marginBottom: '10px', fontFamily: "'Orbitron', sans-serif" }}>
                  TIME:
                </label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  style={{
                    width: '100%',
                    background: 'rgba(0, 243, 255, 0.08)',
                    border: '2px solid var(--neon-cyan)',
                    color: 'var(--neon-cyan)',
                    padding: '14px',
                    fontFamily: "'Share Tech Mono', monospace"
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--neon-green)', marginBottom: '10px', fontFamily: "'Orbitron', sans-serif" }}>
                  VENUE:
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({...formData, venue: e.target.value})}
                  style={{
                    width: '100%',
                    background: 'rgba(0, 243, 255, 0.08)',
                    border: '2px solid var(--neon-cyan)',
                    color: 'var(--neon-cyan)',
                    padding: '14px',
                    fontFamily: "'Share Tech Mono', monospace"
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--neon-green)', marginBottom: '10px', fontFamily: "'Orbitron', sans-serif" }}>
                  MESSAGE:
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={4}
                  style={{
                    width: '100%',
                    background: 'rgba(0, 243, 255, 0.08)',
                    border: '2px solid var(--neon-cyan)',
                    color: 'var(--neon-cyan)',
                    padding: '14px',
                    fontFamily: "'Share Tech Mono', monospace",
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--neon-green)', marginBottom: '10px', fontFamily: "'Orbitron', sans-serif" }}>
                  HIGHLIGHTS (comma separated):
                </label>
                <input
                  type="text"
                  value={highlightsInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    setHighlightsInput(value);
                    const highlights = value.split(',').map(h => h.trim()).filter(h => h !== '');
                    setFormData({...formData, highlights});
                  }}
                  placeholder="Hackathon, Workshop, Tech Talk"
                  style={{
                    width: '100%',
                    background: 'rgba(0, 243, 255, 0.08)',
                    border: '2px solid var(--neon-cyan)',
                    color: 'var(--neon-cyan)',
                    padding: '14px',
                    fontFamily: "'Share Tech Mono', monospace"
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  style={{
                    background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
                    border: 'none',
                    color: '#fff',
                    padding: '12px 20px',
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: 'clamp(12px, 3vw, 16px)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                    boxShadow: '0 5px 30px rgba(0, 243, 255, 0.5)',
                    opacity: isSaving ? 0.7 : 1
                  }}
                >
                  {isSaving ? '⏳ SAVING...' : '☁️ SAVE TO FIREBASE'}
                </button>

                <button
                  type="button"
                  onClick={generateQR}
                  style={{
                    background: 'linear-gradient(135deg, var(--neon-green), var(--neon-blue))',
                    border: 'none',
                    color: '#fff',
                    padding: '12px 20px',
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: 'clamp(12px, 3vw, 16px)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                    boxShadow: '0 5px 30px rgba(0, 255, 157, 0.5)'
                  }}
                >
                  📱 GENERATE QR
                </button>

                <button
                  type="button"
                  onClick={deleteDept}
                  disabled={isDeleting}
                  style={{
                    background: 'linear-gradient(135deg, var(--neon-pink), var(--neon-orange))',
                    border: 'none',
                    color: '#fff',
                    padding: '12px 20px',
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: 'clamp(12px, 3vw, 16px)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                    boxShadow: '0 5px 30px rgba(255, 0, 255, 0.5)',
                    opacity: isDeleting ? 0.7 : 1
                  }}
                >
                  {isDeleting ? '⏳ DELETING...' : '🗑️ DELETE FROM FIREBASE'}
                </button>

                {showFlushBtn && (
                  <button
                    type="button"
                    onClick={flushAllData}
                    disabled={isFlushing}
                    style={{
                      background: 'linear-gradient(135deg, #ff0000, #8b0000)',
                      border: 'none',
                      color: '#fff',
                      padding: '12px 20px',
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: 'clamp(12px, 3vw, 16px)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                      boxShadow: '0 5px 30px rgba(255, 0, 0, 0.5)',
                      opacity: isFlushing ? 0.7 : 1
                    }}
                  >
                    {isFlushing ? '⏳ FLUSHING...' : '🚨 FLUSH ALL DATA'}
                  </button>
                )}
              </div>

              {qrUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginTop: '30px',
                    padding: '20px',
                    background: 'rgba(0, 243, 255, 0.08)',
                    border: '2px solid var(--neon-green)',
                    borderRadius: '15px',
                    textAlign: 'center'
                  }}
                >
                  <h3 style={{ color: 'var(--neon-green)', marginBottom: '15px' }}>QR CODE GENERATED</h3>
                  <img src={qrUrl} alt="QR Code" style={{ maxWidth: 'min(400px, 80vw)', background: 'white', padding: '15px', borderRadius: '10px' }} />
                  <a 
                    href={`${window.location.origin}${window.location.pathname}?dept=${deptId.toUpperCase()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      color: 'var(--neon-cyan)', 
                      fontSize: 'clamp(12px, 3vw, 16px)', 
                      margin: '15px 0', 
                      display: 'block',
                      wordBreak: 'break-all',
                      textDecoration: 'underline',
                      cursor: 'pointer'
                    }}
                  >
                    {`${window.location.origin}${window.location.pathname}?dept=${deptId.toUpperCase()}`}
                  </a>
                  <button
                    onClick={downloadQR}
                    style={{
                      background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
                      border: 'none',
                      color: '#fff',
                      padding: '12px 25px',
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      marginTop: '15px',
                      borderRadius: '5px'
                    }}
                  >
                    DOWNLOAD QR
                  </button>
                </motion.div>
              )}
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminPanel;