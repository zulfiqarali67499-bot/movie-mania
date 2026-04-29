import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Play, Search, X, Download, ArrowLeft, Info } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { moviePopular, movieSearch } from "../services/api";
import "./Home.css";

const Home = () => {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMovie, setActiveMovie] = useState(null);

  // --- FIX: Background Scroll Lock Logic ---
  useEffect(() => {
    if (activeMovie) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    // Cleanup jab component band ho
    return () => document.body.classList.remove('modal-open');
  }, [activeMovie]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) setActiveMovie(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const fetchMovies = useCallback(async (query = "") => {
    setLoading(true);
    try {
      if (query.trim()) {
        const results = await movieSearch(query);
        setMovies(results);
      } else {
        const data = await moviePopular();
        setMovies(data);
        if (!featuredMovie && data.length > 0) {
          const randomIndex = Math.floor(Math.random() * Math.min(data.length, 5));
          setFeaturedMovie(data[randomIndex]);
        }
      }
    } catch (err) {
      console.error("Error fetching movies:", err);
    } finally {
      setLoading(false);
    }
  }, [featuredMovie]);

  useEffect(() => { fetchMovies(); }, [fetchMovies]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if(search) fetchMovies(search);
    }, 600);
    return () => clearTimeout(timer);
  }, [search, fetchMovies]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    fetchMovies(search);
  };

  const handleGoBack = () => {
    setSearch("");
    fetchMovies("");
  };

  const handleDownload = (title) => {
    const downloadUrl = `https://www.google.com/search?q=index+of+${encodeURIComponent(title)}+1080p+direct+link`;
    window.open(downloadUrl, "_blank");
  };

  return (
    <div className="home-container">
      
      <AnimatePresence>
        {activeMovie && (
          <motion.div 
            className="player-overlay"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setActiveMovie(null)} 
          >
            {/* Top Navigation Bar */}
            <div className="player-top-bar">
                 <button className="back-btn" onClick={() => setActiveMovie(null)}>
                    <ArrowLeft size={20} /> <span>Close</span>
                 </button>
                 <button className="header-dl-btn" onClick={() => handleDownload(activeMovie.title)}>
                    <Download size={18} /> <span>Download Now</span>
                 </button>
            </div>

            <div className="player-container" onClick={(e) => e.stopPropagation()}>
              <div className="player-header">
                <h3>{activeMovie.title}</h3>
                <span className="quality-badge">HD 1080p</span>
              </div>
              
              <div className="video-wrapper">
                <iframe 
                  src={`https://vidsrc.me/embed/movie?tmdb=${activeMovie.id}`} 
                  frameBorder="0" 
                  allowFullScreen 
                  title="Movie Player"
                  referrerPolicy="origin"
                ></iframe>
              </div>

              {/* High Visibility Action Bar */}
              <div className="player-action-bar">
                <button className="btn-dl-premium" onClick={() => handleDownload(activeMovie.title)}>
                  <Download size={22} /> 
                  <div className="dl-text">
                    <strong>High Speed Download</strong>
                    <span>Direct Server Link for {activeMovie.title}</span>
                  </div>
                </button>
              </div>

              <div className="player-footer">
                <div className="info-row">
                    <Info size={16} />
                    <h4>Movie Overview</h4>
                </div>
                <p>{activeMovie.overview}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      {featuredMovie && !activeMovie && (
        <section 
          className={`hero-banner ${search ? "hero-minimized" : ""}`} 
          style={{
            backgroundImage: search 
              ? 'none' 
              : `linear-gradient(to right, #080d17 15%, transparent 100%), url(https://image.tmdb.org/t/p/w1280${featuredMovie.backdrop_path})`
          }}
        >
          <div className="hero-content">
            {!search && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="trending-chip"><span className="pulse"></span> Now Streaming</div>
                <h1 className="hero-title">{featuredMovie.title}</h1>
                <p className="hero-description">{featuredMovie.overview}</p>
                <button className="btn-watch-main" onClick={() => setActiveMovie(featuredMovie)}>
                  <Play size={20} fill="currentColor" style={{ marginRight: '8px' }} /> Start Watching
                </button>
              </motion.div>
            )}
            
            <form onSubmit={handleSearchSubmit} className={`hero-search-bar ${search ? "search-active-mode" : ""}`}>
              <div className="search-input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
                <Search size={20} className="search-icon-inside" style={{ position: 'absolute', left: '15px', color: '#64748b' }} />
                <input 
                  type="search" 
                  placeholder="Search movies..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  style={{ paddingLeft: '45px' }}
                />
              </div>
              <button type="submit">Search</button>
            </form>
          </div>
        </section>
      )}

      {/* Content Grid */}
      <main className="content-area">
        <h2 className="section-title">
            {search ? `Results for: "${search}"` : "Most Popular Movies"}
        </h2>
        <div className="title-underline"></div>
        
        <div className="movie-grid">
          {loading ? (
            [...Array(12)].map((_, i) => <div key={i} className="skeleton-card"></div>)
          ) : movies.length > 0 ? (
            movies.map((m) => (
              <div key={m.id} className="premium-card-wrapper" onClick={() => setActiveMovie(m)}>
                <MovieCard movie={m} />
                <div className="card-overlay">
                   <div className="play-icon">
                     <Play size={32} fill="currentColor" />
                   </div>
                   <p>Click to Stream</p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
                <h3>Oops! No movies found.</h3>
                <button className="btn-watch-main" onClick={handleGoBack}>
                  <ArrowLeft size={18} style={{ marginRight: '8px' }} /> Go Back
                </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;