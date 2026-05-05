import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom' // 1. useLocation import kiya
import { AnimatePresence, motion } from 'framer-motion'
import Home from './pages/Home'
import Favorite from './pages/Favorite'
import Loader from './components/Loader'
import Footer from './components/Footer'

const App = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // 2. Current URL track karne ke liye

  // 3. Jab bhi route/path change hoga, ye effect chalega
  useEffect(() => {
    setLoading(true); // Loader show karein
    
    const timer = setTimeout(() => {
      setLoading(false); // 2 seconds baad loader hide karein
    }, 2000);

    return () => clearTimeout(timer);
  }, [location.pathname]); // Dependency array mein path dala hai

  return (
    <div className="app-wrapper" style={{ background: '#05080d', overflowX: 'hidden' }}>
      
      {/* Loader with Exit Animation */}
      <AnimatePresence mode="wait">
        {loading && <Loader key="loader" />}
      </AnimatePresence>

      {/* Main Layout - Isko hamesha render hone dein ya Loader ke sath sync karein */}
      {/* Taake smooth transition mile, hum opacity handle kar rahe hain */}
      <motion.div 
        className="main-layout" 
        initial={{ opacity: 0 }} 
        animate={{ opacity: loading ? 0 : 1 }} // Loading ke mutabiq hide/show
        transition={{ duration: 0.8 }}
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          pointerEvents: loading ? 'none' : 'auto' // Loading ke waqt clicks disable
        }}
      >
        <Navbar />
        
        <main style={{ flex: 1 }}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/favorite" element={<Favorite />} />
          </Routes>
        </main>

        <Footer />
      </motion.div>
    </div>
  )
}

export default App