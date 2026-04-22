import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle2, X } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const FileUploader = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  const handleRemove = (e) => {
    e.stopPropagation();
    setFile(null);
  };

  const handleAnalyze = (e) => {
    e.stopPropagation();
    if (file && onUpload) {
      onUpload(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        {...getRootProps()} 
        className={twMerge(
          clsx(
            "relative overflow-hidden group cursor-pointer border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ease-in-out",
            isDragActive ? "border-primary-500 bg-primary-50" : "border-slate-300 hover:border-primary-400 hover:bg-slate-50",
            isDragReject && "border-red-500 bg-red-50",
            file && "border-green-500 bg-green-50/30"
          )
        )}
      >
        <input {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div 
              key="upload-prompt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="p-4 bg-primary-100 text-primary-600 rounded-full group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                <UploadCloud size={40} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  {isDragActive ? "Drop resume here..." : "Drag & drop your resume"}
                </h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                  Supports PDF and DOCX formats up to 5MB.
                </p>
              </div>
              <button 
                type="button" 
                className="mt-4 px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 hover:text-primary-600 transition-colors shadow-sm"
              >
                Browse Files
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="file-preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center gap-6"
            >
              <div className="relative">
                <div className="p-5 bg-green-100 text-green-600 rounded-2xl shadow-sm border border-green-200">
                  <FileText size={48} />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-0.5">
                  <CheckCircle2 size={24} className="text-green-500" fill="white" />
                </div>
              </div>
              
              <div className="space-y-1">
                <h4 className="font-medium text-slate-900 truncate max-w-xs">{file.name}</h4>
                <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              
              <div className="flex gap-3 mt-2 w-full max-w-xs">
                <button 
                  onClick={handleRemove}
                  className="flex-1 px-4 py-2 bg-white border border-rose-200 text-rose-600 font-medium rounded-lg hover:bg-rose-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                >
                  <span className="flex items-center justify-center gap-2">
                    <X size={16} /> Remove
                  </span>
                </button>
                <button 
                  onClick={handleAnalyze}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Analyze
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FileUploader;
