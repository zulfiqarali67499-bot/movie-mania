import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Home from './pages/Home'
import Favorite from './pages/Favorite'
import Loader from './components/Loader'
import Footer from './components/Footer'

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app-wrapper" style={{ background: '#05080d', overflowX: 'hidden' }}>
      
      {/* 1. Loader with Exit Animation */}
      <AnimatePresence mode="wait">
        {loading && <Loader key="loader" />}
      </AnimatePresence>

      {/* 2. Main Layout with Fade-in Effect */}
      {!loading && (
        <motion.div 
          className="main-layout" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }} // Loader ke slide up hone ke thori der baad aaye
          style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
        >
          <Navbar />
          
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/favorite" element={<Favorite />} />
            </Routes>
          </main>

          <Footer />
        </motion.div>
      )}
    </div>
  )
}

export default App