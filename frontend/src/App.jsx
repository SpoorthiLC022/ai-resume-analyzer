import { BrowserRouter as Router, Routes, Route, ScrollRestoration } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import PreferencesPage from './pages/PreferencesPage';
import HistoryPage from './pages/HistoryPage';
import JobsPage from './pages/JobsPage';
import AnalyticsPage from './pages/AnalyticsPage';
function App() {
  return (
    <Router>
      <Routes>
        {/* Auth & Welcome (No Navbar) */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* App Routes (With Navbar) */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<LandingPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
