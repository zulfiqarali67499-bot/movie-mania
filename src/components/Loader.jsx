import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Loader.css';
// import clientLogo from '../assets/client-logo.svg'; // If using an image/svg

const Loader = () => {
  const [progress, setProgress] = useState(0);

  // 100% Loading Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, 20); // Slightly faster for smoother feel
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      className="god-mode-loader"
      exit={{ opacity: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
    >
      <div className="main-stage">
        {/* 1. ROTATING CINEMATIC CIRCLE CONTAINER */}
        <div className="circle-container">
          <motion.div 
            className="rotating-ring"
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            {/* Minimalist gradient on the ring itself */}
            <div className="ring-gradient"></div>
          </motion.div>

          {/* New LOGO SLOT: Stays static in the center */}
          <div className="logo-slot">
            {/* Option A: Your actual logo (Image or SVG) */}
            {/* <img src={clientLogo} alt="Client Logo" className="actual-logo" /> */}
            
            {/* Option B: Text-based Logo Placeholder (MM) */}
            <span className="logo-text-placeholder">M</span>
          </div>
        </div>

        {/* 2. SHINE TITLE EFFECT */}
        <div className="title-wrapper">
          <h1 className="shine-title">
            MOVIE MANIA
          </h1>
        </div>

        {/* 3. PERCENTAGE INDICATOR & PROGRESS BAR */}
        <div className="loading-meta">
          <motion.div 
            className="percentage-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {progress}% <span>LOADING</span>
          </motion.div>
          
          <div className="progress-track">
            <motion.div 
              className="progress-bar" 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              // Uses easeOut for natural decelerating feel as it gets full
              transition={{ ease: [0.16, 1, 0.3, 1] }} 
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Loader;