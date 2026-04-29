import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Heart, Clapperboard, Menu, X } from 'lucide-react'; 
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    { name: "Favorites", path: "/favorite", icon: <Heart size={18} /> },
  ];

  return (
    <motion.nav className="navbar" initial={{ y: -100 }} animate={{ y: 0 }}>
      <div className="navbar-container">
        <Link to="/" className="logo-link" onClick={() => setIsOpen(false)}>
          <div className="logo">
            <Clapperboard size={24} color="var(--accent-red)" fill="var(--accent-red)" fillOpacity={0.2} />
            MOVIE<span>MANIA</span>
          </div>
        </Link>

        {/* Mobile Toggle Button */}
        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links */}
        <ul className={`nav-links ${isOpen ? "open" : ""}`}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <li key={link.path} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Link 
                  to={link.path} 
                  className={`nav-item ${isActive ? "active" : ""}`}
                  onClick={() => setIsOpen(false)}
                >
                  {React.cloneElement(link.icon, { 
                    color: isActive ? "var(--accent-red)" : "currentColor" 
                  })}
                  <span>{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.nav>
  );
};

export default Navbar;