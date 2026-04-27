import React from 'react';
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMovieContext } from "../context/MovieContext";
import MovieCard from '../components/MovieCard';
import "./Favorite.css";

const Favorite = () => {
  const { favorite = [] } = useMovieContext();

  return (
    <div className="favorite-page">
      <AnimatePresence mode="wait">
        {favorite.length > 0 ? (
          <motion.div 
            key="list"
            className="favorite-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="header-flex">
              <h2 className="page-title">My <span>Favorites</span></h2>
              <span className="count-badge">{favorite.length} Movies</span>
            </div>
            
            <div className='movie-grid'>
              {favorite.map((m, index) => (
                <MovieCard movie={m} key={m.id} index={index} />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="empty"
            className='empty-favorite'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="empty-card">
              <motion.div 
                className="icon"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                ❤️
              </motion.div>
              <h2>Your library is empty</h2>
              <p>Looks like you haven't discovered your favorites yet. Start your cinematic journey now!</p>
              <Link to="/" className="back-home-btn">Explore Library</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Favorite;