import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, Zap, User, Menu, X } from 'lucide-react';
import "./Navbar.css";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Discover", path: "/", icon: <Zap size={18} /> },
    { name: "Favorites", path: "/favorite", icon: <Heart size={18} /> },
  ];

  return (
    <>
      {/* Mobile Toggle Button - Placed outside for z-index safety */}
      <button 
        className="mobile-toggle-btn" 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={32} strokeWidth={2.5} /> : <Menu size={32} />}
      </button>

      <motion.header 
        className={`navbar-wrapper ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -100, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="nav-logo" onClick={() => setIsMobileMenuOpen(false)}>
            MOVIE<span>MANIA</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="desktop-only">
            <ul className="nav-links-list">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className={`nav-link-item ${location.pathname === link.path ? 'active' : ''}`}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                    {location.pathname === link.path && (
                      <motion.div 
                        layoutId="nav-pill"
                        className="nav-active-pill"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop Actions */}
          <div className="desktop-only">
            <div className="search-wrapper">
              <Search size={18} color="#94a3b8" />
              <input type="text" placeholder="Search..." />
            </div>
            <div className="user-avatar">
              <User size={20} color="white" />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              className="sidebar-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div 
              className="mobile-sidebar"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="sidebar-links">
                {/* Mobile Search */}
                <div className="search-wrapper" style={{ width: '100%', marginBottom: '30px', background: 'rgba(255,255,255,0.05)' }}>
                  <Search size={18} color="#94a3b8" />
                  <input type="text" placeholder="Search movies..." style={{width: '100%'}}/>
                </div>

                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Link 
                      to={link.path} 
                      className={`mobile-link ${location.pathname === link.path ? 'm-active' : ''}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.icon} {link.name}
                    </Link>
                  </motion.div>
                ))}
                
                {/* Mobile Profile Link */}
                <Link to="/profile" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                  <User size={18} /> Profile
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;