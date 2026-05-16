import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Mail, Camera, LogOut, ShieldCheck, 
  Heart, Play, Award, Save, CheckCircle, Clock
} from 'lucide-react';
import { useMovieContext } from '../context/MovieContext'; 
import "./Profile.css";

const Profile = () => {
  const { watchlist } = useMovieContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('settings');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [watchHistory, setWatchHistory] = useState([]); // Real history state
  const fileInputRef = useRef(null);

  useEffect(() => {
    // 1. Auth Check
    const isLoggedIn = localStorage.getItem('mm_is_logged_in');
    if (!isLoggedIn) {
      navigate('/login');
    }

    // 2. Load Real Watch History from LocalStorage
    const savedHistory = JSON.parse(localStorage.getItem('mm_history') || "[]");
    setWatchHistory(savedHistory);
  }, [navigate]);

  const [userData, setUserData] = useState(() => {
    const savedData = localStorage.getItem('mm_user_data');
    return savedData ? JSON.parse(savedData) : {
      name: "Guest User",
      email: "guest@moviemania.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
    };
  });

  const handleLogout = () => {
    localStorage.removeItem('mm_is_logged_in');
    navigate('/');
    window.location.reload(); 
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('mm_user_data', JSON.stringify(userData));
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="profile-container">
      {showSuccess && (
        <motion.div className="success-toast" initial={{y: -50, x: "-50%"}} animate={{y: 20, x: "-50%"}}>
          <CheckCircle size={20} /> Changes Saved!
        </motion.div>
      )}

      {/* Header Section */}
      <div className="profile-header">
        <div className="avatar-wrapper">
          <img src={userData.avatar} alt="Avatar" className="avatar-main" />
          <button className="edit-avatar-btn" onClick={() => fileInputRef.current.click()}><Camera size={18} /></button>
          <input type="file" ref={fileInputRef} onChange={(e) => {
            const reader = new FileReader();
            reader.onload = () => setUserData({...userData, avatar: reader.result});
            reader.readAsDataURL(e.target.files[0]);
          }} style={{display:'none'}} />
        </div>
        <div className="user-meta">
          <h1>{userData.name}</h1>
          <p>{userData.email}</p>
          <div className="user-badge"><ShieldCheck size={14} /> Gold Member</div>
        </div>
        <button className="logout-btn-top" onClick={handleLogout}>
          <LogOut size={18} /> Sign Out
        </button>
      </div>

      {/* Stats Cards - Ab ye real data dikhayenge */}
      <div className="stats-grid">
        <div className="stat-card">
          <Heart size={24} color="#e50914" />
          <h3>{watchlist?.length || 0}</h3>
          <p>Watchlist</p>
        </div>
        <div className="stat-card">
          <Play size={24} color="#e50914" />
          <h3>{watchHistory.length}</h3>
          <p>Movies Watched</p>
        </div>
        <div className="stat-card">
          <Award size={24} color="#e50914" />
          <h3>12</h3>
          <p>Badges</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs-nav">
        <div className={`tab-link ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>Settings</div>
        <div className={`tab-link ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>Recently Watched</div>
      </div>

      <div className="settings-panel">
        {activeTab === 'settings' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="setting-group">
              <label><User size={14} /> Full Name</label>
              <input type="text" className="setting-input" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} />
            </div>
            <div className="setting-group">
              <label><Mail size={14} /> Email Address</label>
              <input type="email" className="setting-input" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} />
            </div>
            <button className="save-profile-btn" onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? "Saving..." : "Update Profile"}
            </button>
          </motion.div>
        ) : (
          <motion.div className="history-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {watchHistory.length > 0 ? (
              watchHistory.map((movie, index) => (
                <div key={index} className="history-item">
                  <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title} />
                  <div className="history-info">
                    <h4>{movie.title}</h4>
                    <p><Clock size={12} /> Watched Just Now</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">You haven't watched any movies yet.</p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Profile;