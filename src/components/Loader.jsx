import React from 'react';
import { motion } from 'framer-motion';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-content">
        {/* Cinematic Spinner */}
        <div className="spinner-viewport">
          <motion.div 
            className="main-ring"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          />
          <motion.div 
            className="inner-pulse"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </div>
        
        {/* Branding Section */}
        <div className="text-section">
          <motion.h2 
            className="brand-name"
            initial={{ letterSpacing: "10px", opacity: 0 }}
            animate={{ letterSpacing: "2px", opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            MOVIE<span>MANIA</span>
          </motion.h2>

          <div className="loading-track">
            <motion.div 
              className="loading-fill"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <motion.p 
            className="status-subtitle"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Preparing Your Feature Presentation
          </motion.p>
        </div>
      </div>
      
      {/* Background Ambient Glow */}
      <div className="ambient-light"></div>
    </div>
  );
};

export default Loader;