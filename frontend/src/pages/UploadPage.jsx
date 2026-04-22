import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { useAppContext } from '../context/AppContext';
import FileUploader from '../components/FileUploader';
import Loader from '../components/Loader';

const UploadPage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { setAnalysisData, addHistoryRecord, preferences } = useAppContext();

  const handleUpload = async (file) => {
    setIsUploading(true);
    try {
      const response = await api.uploadResume(file, preferences);
      if (response.success) {
        setAnalysisData(response.data);
        addHistoryRecord(file.name || 'Uploaded_Resume', response.data);
        toast.success(response.message);
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error("Failed to analyze resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-200">
      <AnimatePresence mode="wait">
        {!isUploading ? (
          <motion.div 
            key="uploader"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-4xl flex flex-col items-center"
          >
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">
                Upload your Resume
              </h1>
              <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto transition-colors">
                Our AI will analyze your resume format, extract key skills, and provide tailored suggestions to improve your ATS score.
              </p>
            </div>
            
            <FileUploader onUpload={handleUpload} />
          </motion.div>
        ) : (
          <motion.div 
            key="loader"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center transition-colors"
          >
            <Loader text="Extracting keywords and analyzing your resume..." />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadPage;
