import React from 'react';
import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

const SkillsList = ({ title, skills = [], type = "found" }) => {
  const isFound = type === "found";
  
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col h-full transition-colors">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${isFound ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'} transition-colors`}>
          {isFound ? <Check size={20} /> : <X size={20} />}
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 transition-colors">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">
            {isFound ? "Keywords present in your resume" : "Important keywords missing"}
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-auto">
        {skills.map((skill, index) => (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            key={index}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              isFound 
                ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800/50 dark:text-green-400' 
                : 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400'
            }`}
          >
            {skill}
          </motion.span>
        ))}
        {skills.length === 0 && (
          <p className="text-sm text-slate-400 dark:text-slate-500 italic">No skills to display.</p>
        )}
      </div>
    </div>
  );
};

export default SkillsList;
