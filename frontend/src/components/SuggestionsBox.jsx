import React from 'react';
import { Lightbulb, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const SuggestionsBox = ({ suggestions = [] }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-3 transition-colors">
        <div className="p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg transition-colors">
          <Lightbulb size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 transition-colors">Actionable Suggestions</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">AI-powered recommendations to improve your resume</p>
        </div>
      </div>
      
      <div className="p-2">
        {suggestions.length > 0 ? (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {suggestions.map((suggestion, index) => (
              <motion.li 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                key={index}
                className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-start gap-3 rounded-xl m-2"
              >
                <div className="mt-0.5 text-blue-500 dark:text-blue-400 shrink-0">
                  <ChevronRight size={18} />
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm transition-colors">
                  {suggestion}
                </p>
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400 italic">
            No suggestions available.
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestionsBox;
