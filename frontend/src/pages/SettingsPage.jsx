import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Camera, Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const SettingsPage = () => {
  const { userProfile, setUserProfile } = useAppContext();
  const [formData, setFormData] = useState({
    name: userProfile.name,
    email: userProfile.email,
  });
  const [avatarPreview, setAvatarPreview] = useState(userProfile.avatar);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserProfile({
      ...formData,
      avatar: avatarPreview
    });
    toast.success("Profile saved successfully!");
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">Profile Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">Manage your personal information and avatar.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8 transition-colors"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <img 
                  src={avatarPreview} 
                  alt="Profile Avatar" 
                  className="w-24 h-24 rounded-full border-4 border-slate-50 dark:border-slate-800 object-cover bg-slate-100 dark:bg-slate-800 transition-colors"
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors shadow-sm"
                >
                  <Camera size={16} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white transition-colors">Profile Picture</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">JPEG, PNG or GIF. Max 2MB.</p>
              </div>
            </div>

            <hr className="border-slate-100 dark:border-slate-800 transition-colors" />

            {/* Inputs Section */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 transition-colors">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 transition-colors">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors" 
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-900 transition-colors shadow-sm"
              >
                <Save size={18} /> Save Changes
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
