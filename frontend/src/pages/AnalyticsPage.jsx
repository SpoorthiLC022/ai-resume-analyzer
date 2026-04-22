import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart as BarChartIcon, TrendingUp, Target, Activity, FileText } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

const AnalyticsPage = () => {
  const { history } = useAppContext();

  const stats = useMemo(() => {
    if (!history || history.length === 0) return null;
    
    const totalAnalyses = history.length;
    const avgScore = Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / totalAnalyses);
    const highestScore = Math.max(...history.map(h => h.score));
    
    return { totalAnalyses, avgScore, highestScore };
  }, [history]);

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl transition-colors">
            <BarChartIcon size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">Performance Analytics</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">Review your macro-level progress and ATS score trends.</p>
          </div>
        </div>

        {stats ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
                <div className="p-4 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-full">
                  <Activity size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Average ATS Score</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.avgScore}%</p>
                </div>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Analyzed</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalAnalyses}</p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Peak Performance</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.highestScore}%</p>
                </div>
              </motion.div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors min-h-[400px]">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2"><Target size={18} className="text-primary-500" /> Score Improvement Trend</h3>
              
              {/* Very straightforward custom SVG chart rendering the history trend */}
              <div className="relative w-full h-[300px] flex items-end justify-between px-4 sm:px-12 pt-10 border-b border-l border-slate-200 dark:border-slate-700">
                {/* Y Axis labels */}
                <div className="absolute left-[-24px] top-0 bottom-0 flex flex-col justify-between text-xs text-slate-400 pb-6 h-[300px]">
                  <span>100</span>
                  <span>75</span>
                  <span>50</span>
                  <span>25</span>
                  <span>0</span>
                </div>

                {history.slice().reverse().map((h, i) => {
                  const heightPercentage = Math.max(10, h.score); // min 10% height for visibility
                  return (
                    <div key={h.id} className="relative flex flex-col items-center flex-1 mx-1 group">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercentage}%` }}
                        transition={{ duration: 0.7, delay: i * 0.1 }}
                        className="w-full max-w-[40px] bg-primary-500/80 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500 rounded-t-sm"
                      ></motion.div>
                      
                      {/* Tooltip */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10">
                        {h.score}% - {h.filename.substring(0, 10)}
                      </div>
                      
                      <div className="absolute -bottom-6 w-16 text-center text-[10px] text-slate-400 rotate-45 transform origin-left truncate">
                        {new Date(h.date).toLocaleDateString()}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center transition-colors">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full mb-4 transition-colors">
              <BarChartIcon size={32} className="text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors">Insufficient Data</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md transition-colors">You need to analyze at least one resume to view statistical trends and performance analytics.</p>
            <Link 
              to="/upload"
              className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
            >
              Go to Upload
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
