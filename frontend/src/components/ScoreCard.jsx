import React from 'react';
import { motion } from 'framer-motion';

const ScoreCard = ({ score = 0, label = "ATS Score", subtitle = "Based on industry standards" }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 70) return "#22c55e"; // green-500
    if (s >= 50) return "#eab308"; // yellow-500
    return "#ef4444"; // red-500
  };

  const getSubtleColor = (s) => {
    if (s >= 70) return "#dcfce7"; // green-100
    if (s >= 50) return "#fef08a"; // yellow-200
    return "#fee2e2"; // red-100
  };

  const color = getColor(score);
  const subtleColor = getSubtleColor(score);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-md transition-all h-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-slate-50 dark:from-slate-800 to-transparent -mr-10 -mt-10 rounded-full opacity-50 transition-colors"></div>
      
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-6 transition-colors">{label}</h3>
      
      <div className="relative flex items-center justify-center mb-6">
        {/* Background Circle */}
        <svg className="transform -rotate-90 w-40 h-40">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-slate-100"
          />
          {/* Progress Circle */}
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            cx="80"
            cy="80"
            r={radius}
            stroke={color}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Score Number inside */}
        <div className="absolute flex flex-col items-center justify-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-4xl font-bold text-slate-900 dark:text-white transition-colors"
          >
            {score}
          </motion.span>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">/ 100</span>
        </div>
      </div>
      
      <div 
        className="px-4 py-2 rounded-full text-sm font-medium dark:bg-opacity-20 transition-colors"
        style={{ backgroundColor: subtleColor, color: color }}
      >
        {score >= 80 ? 'Excellent Match' : score >= 60 ? 'Good Potential' : 'Needs Improvement'}
      </div>
      
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 text-center transition-colors">{subtitle}</p>
    </div>
  );
};

export default ScoreCard;
