import React from 'react';
import { Link } from 'react-router-dom';
import { FileSearch, Mail, Phone, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const WelcomePage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden transition-colors">
      {/* Decorative background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200 dark:bg-primary-900/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200 dark:bg-blue-900/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-20 w-72 h-72 bg-purple-200 dark:bg-purple-900/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/20 dark:border-slate-800 transition-colors">
          <div className="flex flex-col items-center mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-primary-600/30"
            >
              <FileSearch size={32} />
            </motion.div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight text-center transition-colors">
              Welcome to <span className="text-primary-600 dark:text-primary-400">ResumeAI</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-center mt-3 text-sm transition-colors">
              Your intelligent partner for career advancement. Optimize your resume for ATS in seconds.
            </p>
          </div>

          <div className="space-y-4">
            <button className="w-full relative flex items-center justify-center gap-3 px-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-all shadow-sm">
              <svg className="w-5 h-5 absolute left-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            
            <Link to="/login" className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-slate-900 dark:bg-primary-600 hover:bg-slate-800 dark:hover:bg-primary-700 text-white font-medium rounded-xl transition-all shadow-md focus:ring-2 focus:ring-slate-900 dark:focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900">
              <Mail size={18} className="text-slate-300 dark:text-white/80" />
              Continue with Email
            </Link>

            <button className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-all shadow-sm">
              <Phone size={18} className="text-slate-500 dark:text-slate-400" />
              Continue with Phone
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 transition-colors">
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              By continuing, you agree to our{' '}
              <a href="#" className="font-medium text-primary-600 dark:text-primary-400 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="font-medium text-primary-600 dark:text-primary-400 hover:underline">Privacy Policy</a>.
            </p>
          </div>
          
          <div className="mt-6 flex justify-center">
            <Link to="/home" className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center transition-colors">
              Skip for now <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
