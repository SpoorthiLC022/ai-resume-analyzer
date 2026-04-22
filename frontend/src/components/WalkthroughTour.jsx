import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const WalkthroughTour = () => {
  const { hasSeenTour, setHasSeenTour } = useAppContext();
  const [step, setStep] = useState(0);

  // If they've seen it or are on mobile initially, skip
  if (hasSeenTour) return null;

  const steps = [
    {
      title: "Welcome to ResumeAI",
      content: "Let's take a quick tour of your new professional dashboard.",
      position: "fixed inset-0 m-auto" // Center
    },
    {
      title: "Upload & Analyze",
      content: "Start here by uploading your resume to get instant ATS scores and feedback.",
      position: "absolute top-20 right-10" // Near the Analyze Nav link
    },
    {
      title: "Job Tracker",
      content: "Manage your active job applications dynamically using the Kanban board on the Jobs page.",
      position: "absolute top-20 right-40" // Near Jobs Nav link
    },
    {
      title: "Actionable Insights",
      content: "Make sure to leverage the Quick Fix actions on the dashboard to artificially boost your generated keywords.",
      position: "fixed bottom-20 right-20" // Generic corner
    }
  ];

  const handleNext = () => {
    if (step === steps.length - 1) {
      setHasSeenTour(true);
    } else {
      setStep(s => s + 1);
    }
  };

  const handleSkip = () => {
    setHasSeenTour(true);
  };

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] pointer-events-auto" onClick={handleSkip} />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className={`pointer-events-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl w-full max-w-sm overflow-hidden flex flex-col ${currentStep.position !== 'fixed inset-0 m-auto' ? currentStep.position : 'm-auto'}`}
        >
          <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white truncate pr-4">{currentStep.title}</h3>
            <button onClick={handleSkip} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={16}/></button>
          </div>
          <div className="p-4 flex-1">
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{currentStep.content}</p>
          </div>
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-4 bg-primary-600' : 'w-1.5 bg-slate-300 dark:bg-slate-600'}`} />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={handleSkip} className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Skip</button>
              <button 
                onClick={handleNext} 
                className="flex items-center gap-1 px-4 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
              >
                {step === steps.length - 1 ? <><Check size={14}/> Finish</> : <>Next <ChevronRight size={14}/></>}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default WalkthroughTour;
