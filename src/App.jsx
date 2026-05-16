import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Home from './pages/Home'
import Favorite from './pages/Favorite'
import Loader from './components/Loader'
import Footer from './components/Footer'
import Profile from './pages/Profile'
import Login from './pages/Login' // 1. Login page import karein

const App = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="app-wrapper" style={{ background: '#05080d', overflowX: 'hidden' }}>
      
      <AnimatePresence mode="wait">
        {loading && <Loader key="loader" />}
      </AnimatePresence>

      <motion.div 
        className="main-layout" 
        initial={{ opacity: 0 }} 
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.8 }}
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          pointerEvents: loading ? 'none' : 'auto'
        }}
      >
        <Navbar />
        
        <main style={{ flex: 1 }}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/favorite" element={<Favorite />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* 2. Login Route yahan add kar diya */}
            <Route path="/login" element={<Login />} />
            
            {/* 3. Optional: Har unknown path ko Home par bhej dega */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        <Footer />
      </motion.div>
    </div>
  )
}

export default App