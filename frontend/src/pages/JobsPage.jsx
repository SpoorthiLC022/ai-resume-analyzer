import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Building, MapPin, Plus, MoreVertical, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const STATUS_COLUMNS = ['Applied', 'Interview', 'Offer', 'Rejected'];

const JobsPage = () => {
  const { jobs, setJobs } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newJob, setNewJob] = useState({ company: '', role: '', location: '', status: 'Applied' });

  const handleAddJob = (e) => {
    e.preventDefault();
    setJobs([{ id: crypto.randomUUID(), ...newJob, date: new Date().toISOString() }, ...jobs]);
    setNewJob({ company: '', role: '', location: '', status: 'Applied' });
    setIsModalOpen(false);
  };

  const updateJobStatus = (id, newStatus) => {
    setJobs(jobs.map(job => job.id === id ? { ...job, status: newStatus } : job));
  };

  const deleteJob = (id) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">Job Tracker</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">Manage your pipeline and track application statuses.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Plus size={16} /> Add Application
          </button>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
          {STATUS_COLUMNS.map(column => (
            <div key={column} className="bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 h-full min-h-[500px]">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-semibold text-slate-700 dark:text-slate-300 transition-colors uppercase text-sm tracking-wider">{column}</h3>
                <span className="bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold px-2 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                  {jobs.filter(j => j.status === column).length}
                </span>
              </div>
              
              <div className="space-y-3">
                <AnimatePresence>
                  {jobs.filter(job => job.status === column).map((job) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={job.id}
                      className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow group relative"
                    >
                      <button onClick={() => deleteJob(job.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={14} />
                      </button>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors pr-4">{job.role}</h4>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5 mb-1"><Building size={14} /> {job.company}</p>
                      {job.location && <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-3"><MapPin size={12} /> {job.location}</p>}
                      
                      <select 
                        value={job.status} 
                        onChange={(e) => updateJobStatus(job.id, e.target.value)}
                        className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-slate-700 dark:text-slate-300 outline-none focus:border-primary-500 transition-colors cursor-pointer"
                      >
                        {STATUS_COLUMNS.map(s => <option key={s} value={s}>Move to {s}</option>)}
                      </select>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {jobs.filter(job => job.status === column).length === 0 && (
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center text-sm text-slate-400 dark:text-slate-500">
                    Drop here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Job Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-center items-center p-4"
              >
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  onClick={e => e.stopPropagation()}
                  className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add Application</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X size={20}/></button>
                  </div>
                  <form onSubmit={handleAddJob} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company</label>
                      <input required type="text" value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white focus:ring-2 focus:ring-primary-500" placeholder="Google" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                      <input required type="text" value={newJob.role} onChange={e => setNewJob({...newJob, role: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white focus:ring-2 focus:ring-primary-500" placeholder="Frontend Engineer" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                      <select value={newJob.status} onChange={e => setNewJob({...newJob, status: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white focus:ring-2 focus:ring-primary-500">
                        {STATUS_COLUMNS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="pt-4">
                      <button type="submit" className="w-full py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">Save Application</button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default JobsPage;
