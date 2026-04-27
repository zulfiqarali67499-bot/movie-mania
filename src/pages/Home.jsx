import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import MovieCard from '../components/MovieCard';
import { moviePopular, movieSearch } from "../services/api";
import "./Home.css";

const Home = () => {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPopular = async () => {
    setLoading(true);
    try {
      const data = await moviePopular();
      setMovies(data);
      // Banner ke liye pehli trending movie select ki
      setFeaturedMovie(data[0]); 
    } catch (err) {
      setError("Failed to load movies...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopular();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      fetchPopular();
      return;
    }
    setLoading(true);
    try {
      const results = await movieSearch(search);
      setMovies(results);
      setError(null);
    } catch (err) {
      setError("Search failed...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      {/* Dynamic Hero Section */}
      <AnimatePresence>
        {!search && featuredMovie && (
          <motion.section 
            className="hero-banner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(8, 13, 23, 0.2), #080d17), 
              url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`
            }}
          >
            <div className="hero-content">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {featuredMovie.title}
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {featuredMovie.overview.slice(0, 160)}...
              </motion.p>
              
              <div className="form-section">
                <form onSubmit={handleSearch} className="search-form">
                  <input 
                    type="text" 
                    placeholder='Search for movies, genres...' 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                  />
                  <button type="submit" className="search-btn" disabled={loading}>
                    {loading ? <div className="spinner"></div> : "Search"}
                  </button>
                </form>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Agar Search kar rahe hon toh sirf Form dikhayein */}
      {search && (
        <div className="simple-search-area">
           <form onSubmit={handleSearch} className="search-form">
                <input 
                  type="text" 
                  placeholder='Search for movies...' 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                />
                <button type="submit" className="search-btn">Search</button>
            </form>
        </div>
      )}

      <div className="content-area">
        <h2 className="section-title">
          {search ? `Results for "${search}"` : "Trending Now"}
        </h2>

        {error && <div className="error-msg">{error}</div>}

        <div className='movie-grid'>
          {loading ? (
              [...Array(8)].map((_, i) => <div key={i} className="skeleton-card"></div>)
          ) : (
            <AnimatePresence>
              {movies.map((m, index) => (
                <MovieCard movie={m} key={m.id} index={index} />
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;