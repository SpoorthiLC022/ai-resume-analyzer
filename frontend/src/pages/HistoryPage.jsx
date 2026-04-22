import React from 'react';
import { motion } from 'framer-motion';
import { Clock, FileText, ChevronRight, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const HistoryPage = () => {
  const { history, setAnalysisData } = useAppContext();
  const navigate = useNavigate();

  const handleViewReport = (reportData) => {
    setAnalysisData(reportData);
    navigate('/dashboard');
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl transition-colors">
            <Clock size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">Analysis History</h1>
            <p className="text-slate-500 dark:text-slate-400 transition-colors">View and revisit your past resume analyses.</p>
          </div>
        </div>

        {history && history.length > 0 ? (
          <div className="space-y-4">
            {history.map((item, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm hover:shadow-md transition-all group cursor-default"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-lg group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors mt-1 sm:mt-0">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white transition-colors">{item.filename}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1 transition-colors">
                      {new Date(item.date).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto mt-2 sm:mt-0">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider mb-1 transition-colors">Score</span>
                    <span className={`font-bold text-xl px-3 py-1 rounded-full ${
                      item.score >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      item.score >= 60 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                    } transition-colors`}>
                      {item.score}
                    </span>
                  </div>

                  <button 
                    onClick={() => handleViewReport(item.data)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-lg transition-colors"
                  >
                    <BarChart size={16} /> View Report
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center transition-colors">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full mb-4 transition-colors">
              <FileText size={32} className="text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors">No history found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md transition-colors">You haven't uploaded or analyzed any resumes yet. Start by analyzing a resume from the upload page.</p>
            <button 
              onClick={() => navigate('/upload')}
              className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
            >
              Analyze Resume <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
