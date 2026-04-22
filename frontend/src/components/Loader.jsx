import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ text = "Analyzing resume..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="relative w-20 h-20 mb-6">
        {/* Outer ringing circle */}
        <motion.span
          className="absolute inset-0 rounded-full border-4 border-primary-200"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Inner spinning circle */}
        <motion.span
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 border-r-primary-600"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        {/* Center dot */}
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary-600 rounded-full" />
      </div>
      
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="text-lg font-medium text-slate-600"
      >
        {text}
      </motion.p>
    </div>
  );
};

export default Loader;
