import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
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
    <div className="app-wrapper">
      {loading ? (
        <Loader />
      ) : (
        /* Min-h-screen ensures content takes full height */
        <div className="main-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          
          {/* Main content area grows to push footer down */}
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/favorite" element={<Favorite />} />
            </Routes>
          </main>

          <Footer />
        </div>
      )}
    </div>
  )
}

export default App