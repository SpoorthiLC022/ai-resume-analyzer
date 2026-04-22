import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileSearch, User, LogOut, Moon, Sun, Settings, Bell, FileText, ChevronDown, WifiOff, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { isDarkMode, toggleDarkMode, userProfile, notifications, markNotificationRead, markAllNotificationsRead, history, setAnalysisData, analysisData, isOffline } = useAppContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const resumeRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
      if (resumeRef.current && !resumeRef.current.contains(event.target)) {
        setResumeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    console.log("User logged out");
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <>
    {isOffline && (
      <div className="w-full bg-red-500 text-white py-1.5 px-4 flex justify-center items-center text-sm font-medium z-50">
        <WifiOff size={16} className="mr-2" /> You are currently offline. Displaying cached data.
      </div>
    )}
    <nav className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/home" className="flex items-center gap-2 group">
            <div className="bg-primary-600 p-2 rounded-lg text-white group-hover:bg-primary-700 transition-colors">
              <FileSearch size={24} />
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight transition-colors">
              Resume<span className="text-primary-600">AI</span>
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 mr-2 text-sm font-medium text-slate-600 dark:text-slate-300">
              <Link to="/home" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</Link>
              <Link to="/upload" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Analyze</Link>
              <Link to="/jobs" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Jobs</Link>
              <Link to="/analytics" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Analytics</Link>
              <Link to="/history" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">History</Link>
            </div>

            {/* Resume Switcher */}
            {history.length > 0 && (
              <div className="relative hidden lg:block" ref={resumeRef}>
                <button 
                  onClick={() => setResumeOpen(!resumeOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  <FileText size={16} className="text-primary-500" />
                  <span className="max-w-[100px] truncate">{analysisData ? history.find(h => h.id === analysisData?.id)?.filename || history[0].filename : 'Select Resume'}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>
                <AnimatePresence>
                  {resumeOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden max-h-64 overflow-y-auto"
                    >
                      <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/50">
                        Switch Active Resume
                      </div>
                      <div className="py-1">
                        {history.map(item => (
                          <button 
                            key={item.id}
                            onClick={() => { setAnalysisData(item.data); setResumeOpen(false); navigate('/dashboard'); }}
                            className="flex w-full items-center justify-between px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm text-slate-700 dark:text-slate-300 text-left"
                          >
                            <span className="truncate pr-4">{item.filename}</span>
                            <span className="text-xs font-medium text-primary-600 dark:text-primary-400">{item.score}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            <button 
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <Bell size={20} />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white dark:border-slate-900">
                    {unreadNotifs}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
                  >
                    <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <h3 className="font-semibold text-slate-800 dark:text-slate-200">Notifications</h3>
                      <button onClick={markAllNotificationsRead} className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400">Mark all as read</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(n => (
                          <div key={n.id} className={`p-4 border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${!n.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`} onClick={() => markNotificationRead(n.id)}>
                            <p className="text-sm text-slate-700 dark:text-slate-300">{n.text}</p>
                            <p className="text-xs text-slate-400 mt-1">{new Date(n.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-sm text-slate-500">No new notifications</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
              >
                <img 
                  src={userProfile.avatar} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700" 
                />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{userProfile.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{userProfile.email}</p>
                    </div>
                    
                    <div className="py-1 text-sm text-slate-700 dark:text-slate-300">
                      <Link to="/settings" onClick={() => setDropdownOpen(false)} className="flex w-full items-center gap-2 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <User size={16} /> Profile Settings
                      </Link>
                      <Link to="/preferences" onClick={() => setDropdownOpen(false)} className="flex w-full items-center gap-2 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <Settings size={16} /> Preferences
                      </Link>
                    </div>
                    
                    <div className="border-t border-slate-100 dark:border-slate-800 py-1">
                      <button 
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors text-sm"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </nav>
    </>
  );
};

export default Navbar;
