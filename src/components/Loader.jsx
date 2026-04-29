import React from 'react';
import { motion } from 'framer-motion';
import './Loader.css';

const Loader = () => {
  return (
    <motion.div 
      className="loader-overlay"
      // Pehle screen par rahega, phir exit hote waqt upar jaye ga
      initial={{ y: 0 }}
      exit={{ y: "-100%" }} 
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} // Custom cubic-bezier for premium feel
    >
      <div className="loader-content">
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
      <div className="ambient-light"></div>
    </motion.div>
  );
};

export default Loader;