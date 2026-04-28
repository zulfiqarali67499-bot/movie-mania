import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import MovieCard from '../components/MovieCard';
import { moviePopular, movieSearch } from "../services/api";
import "./Home.css";

const Home = () => {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [activeMovie, setActiveMovie] = useState(null); 

  // Keyboard ESC support
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) setActiveMovie(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const fetchMovies = async (query = "") => {
    setLoading(true);
    try {
      if (query) {
        const results = await movieSearch(query);
        setMovies(results);
      } else {
        const data = await moviePopular();
        setMovies(data);
        if (!featuredMovie && data.length > 0) {
          // Tip: Picking a random featured movie from top 5
          const randomIndex = Math.floor(Math.random() * Math.min(data.length, 5));
          setFeaturedMovie(data[randomIndex]);
        }
      }
    } catch (err) { 
      console.error("Error fetching movies:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchMovies(); }, []);

  const handleDownload = (id, title) => {
    const downloadUrl = `https://www.google.com/search?q=index+of+${encodeURIComponent(title)}+1080p+direct+link`;
    window.open(downloadUrl, "_blank");
  };

  return (
    <div className="home-container">
      
      {/* --- PREMIUM FULL SCREEN PLAYER --- */}
      <AnimatePresence>
        {activeMovie && (
          <motion.div 
            className="player-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActiveMovie(null)} 
          >
            <div className="player-container" onClick={(e) => e.stopPropagation()}>
              <button className="close-player-fab" onClick={() => setActiveMovie(null)} title="Close Player">&times;</button>

              <div className="player-header">
                <h3>{activeMovie.title}</h3>
                <span className="quality-badge">HD 1080p</span>
              </div>
              
              <div className="video-wrapper">
                <iframe 
                  src={`https://vidsrc.me/embed/movie?tmdb=${activeMovie.id}`} 
                  frameBorder="0" allowFullScreen title="Movie Player"
                ></iframe>
              </div>

              <div className="player-footer">
                <p>{activeMovie.overview}</p>
                <button className="btn-dl-now" onClick={() => handleDownload(activeMovie.id, activeMovie.title)}>
                  📥 High Speed Download
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HERO SECTION (Optimized Image Size) --- */}
      {!search && featuredMovie && !activeMovie && (
        <section className="hero-banner" style={{
          // Tip: Using w1280 instead of original for faster loading
          backgroundImage: `linear-gradient(to right, #080d17 15%, transparent 100%), url(https://image.tmdb.org/t/p/w1280${featuredMovie.backdrop_path})`
        }}>
          <div className="hero-content">
            <div className="trending-chip"><span className="pulse"></span> Now Streaming</div>
            <h1 className="hero-title">{featuredMovie.title}</h1>
            <p className="hero-description">{featuredMovie.overview}</p>
            
            <div className="hero-actions">
              <button className="btn-watch-main" onClick={() => setActiveMovie(featuredMovie)}>▶ Start Watching</button>
              <form onSubmit={(e) => { e.preventDefault(); fetchMovies(search); }} className="hero-search-bar">
                <input type="text" placeholder="Search movies..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <button type="submit">Search</button>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* --- MOVIE GRID --- */}
      <main className="content-area">
        <h2 className="section-title">
            {search ? `Results for: ${search}` : "Most Popular Movies"}
        </h2>
        <div className="title-underline"></div>
        
        <div className="movie-grid">
          {loading ? (
            [...Array(12)].map((_, i) => <div key={i} className="skeleton-card"></div>)
          ) : movies.length > 0 ? (
            movies.map((m) => (
              <div key={m.id} className="premium-card-wrapper" onClick={() => setActiveMovie(m)}>
                {/* Note: Ensure MovieCard uses loading="lazy" on its <img> tag */}
                <MovieCard movie={m} />
                
                <div className="card-overlay">
                   <div className="play-icon">▶</div>
                   <p>Click to Stream</p>
                </div>
              </div>
            ))
          ) : (
            /* --- NO RESULTS STATE --- */
            <div className="no-results">
                <h3>Oops! No movies found for "{search}"</h3>
                <p>Try searching for something else or check your spelling.</p>
                <button className="btn-watch-main" onClick={() => {setSearch(""); fetchMovies();}}>Go Back</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;