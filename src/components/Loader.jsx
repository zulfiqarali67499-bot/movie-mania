import React from 'react';
import { motion } from 'framer-motion';
import './Loader.css';

const Loader = () => {
  // Hollywood "Out" Curve: Starts explosive, ends like silk
  const cinemaCurve = [0.19, 1, 0.22, 1];

  return (
    <motion.div 
      className="god-tier-loader"
      exit={{ 
        opacity: 0, 
        scale: 1.1, 
        filter: "blur(50px)",
        transition: { duration: 1.2, ease: cinemaCurve } 
      }}
    >
      <div className="bg-flare" />
      
      <motion.div 
        className="anamorphic-beam"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: [0, 0.8, 0.2] }}
        transition={{ duration: 2.5, ease: cinemaCurve }}
      />

      <div className="main-stage">
        <motion.h1 
          className="studio-title"
          initial={{ letterSpacing: "-4rem", opacity: 0, filter: "blur(35px)", scale: 0.8 }}
          animate={{ letterSpacing: "1.5rem", opacity: 1, filter: "blur(0px)", scale: 1 }}
          transition={{ duration: 3.5, ease: cinemaCurve }}
        >
          MOVIE
          <motion.span 
            className="accent-glow"
            animate={{ 
                textShadow: [
                    "0 0 20px rgba(229,9,20,0.5)", 
                    "0 0 60px rgba(229,9,20,0.9)", 
                    "0 0 20px rgba(229,9,20,0.5)"
                ] 
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            MANIA
          </motion.span>
        </motion.h1>
      </div>

      <div className="bottom-info">
        <motion.div 
          className="loading-bar-container"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 320, opacity: 1 }}
          transition={{ delay: 1, duration: 2 }}
        >
          <motion.div 
            className="loading-bar-fill"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
        
        <motion.p 
          className="tech-status"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
        >
          RENDERING_EXPERIENCE
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Loader;