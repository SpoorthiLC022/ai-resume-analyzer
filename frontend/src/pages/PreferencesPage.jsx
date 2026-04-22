import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, ArrowLeft, Briefcase, GraduationCap, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const PreferencesPage = () => {
  const { preferences, setPreferences, isDarkMode, toggleDarkMode } = useAppContext();
  const [formData, setFormData] = useState(preferences);
  const navigate = useNavigate();

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPreferences(formData);
    toast.success("Preferences updated successfully");
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 transition-colors duration-200">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button onClick={() => navigate(-1)} className="flex items-center text-sm font-medium text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 mb-4 transition-colors">
            <ArrowLeft size={16} className="mr-1" /> Back
          </button>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">App Preferences</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">Tell our AI what kind of roles you are targeting.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8 transition-colors"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors">
                  <Briefcase size={18} className="text-primary-500" />
                  Preferred Role
                </label>
                <select 
                  name="role"
                  value={formData.role}
                  onChange={handleSelectChange}
                  className="block w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                >
                  <option value="Frontend">Frontend Developer</option>
                  <option value="Backend">Backend Developer</option>
                  <option value="Fullstack">Fullstack Developer</option>
                  <option value="AI">AI/ML Engineer</option>
                  <option value="Data">Data Scientist</option>
                </select>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 transition-colors">AI suggestions will be tailored to keywords relevant to this domain.</p>
              </div>

              {/* Experience Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors">
                  <GraduationCap size={18} className="text-primary-500" />
                  Experience Level
                </label>
                <select 
                  name="experience"
                  value={formData.experience}
                  onChange={handleSelectChange}
                  className="block w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                >
                  <option value="Fresher">Entry Level (0-2 years)</option>
                  <option value="Intermediate">Intermediate (3-5 years)</option>
                  <option value="Advanced">Senior (5+ years)</option>
                </select>
              </div>

              {/* Focus Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors">
                  <Target size={18} className="text-primary-500" />
                  Resume Focus
                </label>
                <select 
                  name="focus"
                  value={formData.focus}
                  onChange={handleSelectChange}
                  className="block w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                >
                  <option value="ATS">ATS Optimization (Text Heavy)</option>
                  <option value="Design">Visual Design (Portfolio Focus)</option>
                  <option value="Balanced">Balanced Approach</option>
                </select>
              </div>

              <hr className="border-slate-100 dark:border-slate-800 transition-colors" />

              {/* Theme Toggle Override */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">Dark Theme</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 transition-colors">Force application to use dark mode.</p>
                </div>
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isDarkMode ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-900 transition-colors shadow-sm"
              >
                <Save size={18} /> Save Preferences
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default PreferencesPage;
