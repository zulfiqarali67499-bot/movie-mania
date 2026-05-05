import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Heart, Zap, User, Menu, X } from 'lucide-react';
import "./Navbar.css";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Discover", path: "/", icon: <Zap size={16} /> },
    { name: "Favorites", path: "/favorite", icon: <Heart size={16} /> },
  ];

  return (
    <>
      <motion.header 
        className={`navbar-wrapper ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -100, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="nav-container">
          
          {/* Logo */}
          <Link to="/" className="nav-logo">
            MOVIE<span>MANIA</span>
          </Link>

          {/* Desktop Links */}
          <nav className="desktop-only">
            <ul className="nav-links-list">
              {navLinks.map((link) => (
                <li key={link.path} className="nav-li">
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
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className="nav-actions">
            <div className="search-wrapper">
              <Search size={16} className="search-icon" />
              <input type="text" placeholder="Search..." />
            </div>

            <button className="action-btn">
              <Bell size={20} />
              <span className="notif-dot"></span>
            </button>

            <motion.div 
              className="user-avatar"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <User size={18} color="white" />
            </motion.div>
            
            <button 
              className="mobile-toggle" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
               {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="mobile-sidebar"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="mobile-nav-content">
               {navLinks.map((link) => (
                 <Link 
                    key={link.path} 
                    to={link.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`mobile-link ${location.pathname === link.path ? 'm-active' : ''}`}
                 >
                    {link.icon} {link.name}
                 </Link>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;