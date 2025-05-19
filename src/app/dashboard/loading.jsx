'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

function Loading() {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFBE0B', '#FB5607'];
  
  useEffect(() => {
    // Apply overflow hidden to body when component mounts
    document.body.style.overflow = 'hidden';
    
    // Cleanup function to restore overflow when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center h-screen w-screen z-50">
      <div className="relative w-48 h-48">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-0 left-0 w-full h-full rounded-full border-4"
            style={{ borderColor: colors[i % colors.length], opacity: 0.7 }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              borderWidth: ["4px", "2px", "4px"]
            }}
            transition={{
              duration: 3,
              ease: "easeInOut",
              times: [0, 0.5, 1],
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none">
            <motion.path
              d="M20 50 L40 70 L80 30"
              stroke="white"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </svg>
        </motion.div>
      </div>
      
      <motion.h2 
        className="text-white mt-10 text-2xl font-bold tracking-wider"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        PREPARING YOUR EXPERIENCE
      </motion.h2>
      
      <div className="mt-8 relative w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-600"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>
      
      <motion.p 
        className="text-gray-400 mt-6 text-center max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Transforming your resume into a stunning portfolio...
      </motion.p>
    </div>
  );
}

export default Loading;