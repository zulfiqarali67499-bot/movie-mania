import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Agar user pehle se logged in hai toh redirect karein
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('mm_is_logged_in');
    if (isLoggedIn === 'true') {
      navigate('/profile');
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // Auth status aur user data save karein
      localStorage.setItem('mm_is_logged_in', 'true');
      
      const existingData = localStorage.getItem('mm_user_data');
      if (!existingData) {
        localStorage.setItem('mm_user_data', JSON.stringify({
          name: email.split('@')[0].toUpperCase(),
          email: email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          level: "New Member",
          watchedHours: "0"
        }));
      }
      
      navigate('/profile');
      window.location.reload(); // Navbar update karne ke liye
    }
  };

  return (
    <div className="login-wrapper">
      <motion.div 
        className="login-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-header">
          <h2>MOVIE<span>MANIA</span></h2>
          <p>Sign in to start your cinematic journey.</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <Mail size={18} className="input-icon" />
            <input 
              type="email" 
              placeholder="Email Address" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input 
              type="password" 
              placeholder="Password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-btn">
            <LogIn size={20} /> Sign In
          </button>
        </form>

        <div className="divider"><span>OR CONTINUE WITH</span></div>

        <div className="social-login">
          <button type="button" className="social-btn" onClick={handleLogin}>
            <img src="https://www.svgrepo.com/show/355037/google.svg" alt="G" width="20" /> 
            Google
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;