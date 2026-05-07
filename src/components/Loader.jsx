import React from 'react';
import { motion } from 'framer-motion';
import './Loader.css';

const Loader = () => {
  const word1 = "MOVIE";
  const word2 = "MANIA";

  // International Studio Easing
  const eliteTransition = { duration: 2.5, ease: [0.16, 1, 0.3, 1] };

  return (
    <motion.div 
      className="trending-loader"
      exit={{ 
        opacity: 0, 
        scale: 1.2, 
        filter: "blur(40px)",
        transition: { duration: 0.8 } 
      }}
    >
      <div className="visual-container">
        <motion.h1 
          className="brand-text"
          initial={{ letterSpacing: "-3rem", opacity: 0, filter: "blur(20px)" }}
          animate={{ letterSpacing: "1.5rem", opacity: 1, filter: "blur(0px)" }}
          transition={eliteTransition}
        >
          {word1.split("").map((char, i) => (
            <motion.span 
              key={i}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.05, ...eliteTransition }}
            >
              {char}
            </motion.span>
          ))}
          
          <motion.span 
            className="glitch-span"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, ...eliteTransition }}
          >
            {word2}
          </motion.span>
        </motion.h1>
      </div>

      <div className="loading-system">
        <div className="progress-shimmer" />
        <motion.p 
          className="status-code"
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Processing_Cinema_Core
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Loader;