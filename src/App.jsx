import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import { Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
import Favorite from './pages/Favorite'
import Loader from './components/Loader'

const App = () => {
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    const timer =setTimeout(()=>{
      setLoading(false);
    },2000)
    return ()=> clearTimeout(timer);
  },[])
  return (
    <div>
      {loading?<Loader/>:
     ( 
     <><Navbar/>
      <div>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/favorite" element={<Favorite/>}/>
        </Routes>
      </div>
      </>)}
    </div>
  )
}

export default App
