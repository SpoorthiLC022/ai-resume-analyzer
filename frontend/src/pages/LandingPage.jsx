import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Target, Zap } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center border-b border-transparent">
        {/* Decorative background blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary-300 dark:bg-primary-900/40 rounded-[100%] blur-[120px] opacity-20 -z-10 pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium text-sm mb-8 transition-colors">
            <Sparkles size={16} />
            <span>AI-Powered Insights for 2026</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-6 transition-colors">
            Land your dream job with an <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400">optimized resume</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto transition-colors">
            Our AI Resume Analyzer scans your resume against industry standards, identifies missing keywords, and provides actionable suggestions to beat the ATS.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/upload" 
              className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] flex items-center justify-center gap-2 text-lg"
            >
              Analyze Resume Now <ArrowRight size={20} />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 font-medium rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center text-lg">
              View Sample Report
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-slate-900 py-24 border-t border-slate-100 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">How it works</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-2xl mx-auto transition-colors">Get actionable feedback in seconds to improve your interview chances.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 transition-colors"
            >
              <div className="w-14 h-14 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
                <Target size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 transition-colors">ATS Scoring</h3>
              <p className="text-slate-600 dark:text-slate-400 transition-colors">See exactly how top applicant tracking systems read and score your resume format and content.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 transition-colors"
            >
              <div className="w-14 h-14 bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 rounded-xl flex items-center justify-center mb-6">
                <Sparkles size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 transition-colors">Keyword Analysis</h3>
              <p className="text-slate-600 dark:text-slate-400 transition-colors">Find out which critical industry keywords you're missing compared to successful candidates.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 transition-colors"
            >
              <div className="w-14 h-14 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 rounded-xl flex items-center justify-center mb-6">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 transition-colors">Actionable Suggestions</h3>
              <p className="text-slate-600 dark:text-slate-400 transition-colors">Get specific, line-by-line recommendations from our AI to rephrase bullet points for maximum impact.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
