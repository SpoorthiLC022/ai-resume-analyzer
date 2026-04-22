import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Load initial state from LocalStorage or use defaults
  const loadStoredData = (key, defaultData) => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultData;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultData;
    }
  };

  const [analysisData, setAnalysisData] = useState(() => loadStoredData('analysisData', null));
  const [isDarkMode, setIsDarkMode] = useState(() => loadStoredData('isDarkMode', false));
  const [userProfile, setUserProfile] = useState(() => loadStoredData('userProfile', {
    name: "Alex Doe",
    email: "alex.doe@example.com",
    avatar: "https://ui-avatars.com/api/?name=Alex+Doe&background=aa3bff&color=fff"
  }));
  const [preferences, setPreferences] = useState(() => loadStoredData('preferences', {
    role: "Fullstack",
    experience: "Intermediate",
    focus: "Balanced"
  }));
  const [history, setHistory] = useState(() => loadStoredData('history', []));
  const [jobs, setJobs] = useState(() => loadStoredData('jobs', []));
  const [notifications, setNotifications] = useState(() => loadStoredData('notifications', [
    { id: '1', text: 'Welcome to ResumeAI! Get started by uploading your first resume.', read: false, time: new Date().toISOString() }
  ]));
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [hasSeenTour, setHasSeenTour] = useState(() => loadStoredData('hasSeenTour', false));

  // Sync to local storage whenever state variables change
  useEffect(() => {
    window.localStorage.setItem('analysisData', JSON.stringify(analysisData));
  }, [analysisData]);

  useEffect(() => {
    window.localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    window.localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    window.localStorage.setItem('preferences', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    window.localStorage.setItem('history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    window.localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    window.localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    window.localStorage.setItem('hasSeenTour', JSON.stringify(hasSeenTour));
  }, [hasSeenTour]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  }

  const addHistoryRecord = (filename, data) => {
    const newRecord = {
      id: crypto.randomUUID(),
      filename: filename,
      score: data.score,
      date: new Date().toISOString(),
      data: data
    };
    setHistory(prev => [newRecord, ...prev]);
    addNotification(`Analysis complete for ${filename}`);
  };

  const addNotification = (text) => {
    const newNotif = { id: crypto.randomUUID(), text, read: false, time: new Date().toISOString() };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const value = {
    analysisData,
    setAnalysisData,
    isDarkMode,
    setIsDarkMode,
    toggleDarkMode,
    userProfile,
    setUserProfile,
    preferences,
    setPreferences,
    history,
    addHistoryRecord,
    jobs,
    setJobs,
    notifications,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    isOffline,
    hasSeenTour,
    setHasSeenTour
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
