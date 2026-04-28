import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Footer.css';

const Footer = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Ultra-Smooth Animation Variants for Footer Content
  const revealVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] 
      } 
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 }
    }
  };

  // Progress Ring Variables
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (scrollProgress / 100) * circumference;

  return (
    <motion.footer 
      className="ultra-footer"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="ultra-blur-core" />
      <div className="ultra-line-top" />

      <div className="ultra-container">
        <div className="ultra-grid">
          <motion.div variants={revealVariants} className="ultra-brand">
            <h2 className="ultra-logo">MOVIE <span>MANIA</span></h2>
            <p className="ultra-text">
              The definitive platform for digital cinema. We engineer discovery experiences that transcend the ordinary.
            </p>
            <div className="ultra-socials">
              {['GitHub', 'Twitter', 'LinkedIn'].map((item) => (
                <motion.a 
                  whileHover={{ y: -5, backgroundColor: "rgba(229, 9, 20, 0.1)", borderColor: "#e50914" }}
                  whileTap={{ scale: 0.95 }}
                  key={item} href="#" className="social-pill"
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={revealVariants} className="ultra-links-group">
            <div className="link-stack">
              <h4 className="ultra-label">Navigation</h4>
              {['Prime Selection', 'New Arrivals', 'Studio Access'].map(link => (
                <a key={link} href="#" className="ultra-nav-link">{link}</a>
              ))}
            </div>
            <div className="link-stack">
              <h4 className="ultra-label">Company</h4>
              {['Press Relations', 'Privacy', 'Security'].map(link => (
                <a key={link} href="#" className="ultra-nav-link">{link}</a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={revealVariants} className="ultra-newsletter">
            <h4 className="ultra-label">Transmission</h4>
            <div className="newsletter-field">
              <input type="email" placeholder="internal@movie.mania" />
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Connect
              </motion.button>
            </div>
          </motion.div>
        </div>

        <motion.div variants={revealVariants} className="ultra-base">
          <div className="base-info">
            <span className="copyright">© 2026 INTERNAL RELEASE.</span>
            <div className="architect-tag">
              DESIGNED & ENGINEERED BY <span className="architect-name">ALI SHAIR</span>
            </div>
          </div>
        </motion.div>

        {/* --- HYPER-FLUID TOP BUTTON --- */}
        <AnimatePresence>
          {showTopBtn && (
            <motion.div 
              className="ultra-top-container"
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotate: 0,
                transition: { type: "spring", stiffness: 260, damping: 20 } 
              }}
              exit={{ opacity: 0, scale: 0, rotate: 180, transition: { duration: 0.3 } }}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
            >
              <svg className="progress-ring" width="60" height="60">
                <circle
                  className="progress-ring-circle"
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="2.5"
                  fill="transparent"
                  r={radius}
                  cx="30"
                  cy="30"
                />
                <motion.circle
                  className="progress-ring-indicator"
                  stroke="#e50914"
                  strokeWidth="2.5"
                  strokeDasharray={circumference}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ type: "tween", ease: "linear" }}
                  strokeLinecap="round"
                  fill="transparent"
                  r={radius}
                  cx="30"
                  cy="30"
                />
              </svg>
              <button className="ultra-top-btn">
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                    <path d="M12 19V5M5 12l7-7 7 7"/>
                  </svg>
                </motion.div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.footer>
  );
};

export default Footer;