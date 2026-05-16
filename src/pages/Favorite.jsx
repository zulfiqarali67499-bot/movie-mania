import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Play, ChevronLeft, Heart, Video, PlayCircle, Library } from 'lucide-react';
import { Link } from "react-router-dom";
import { useMovieContext } from '../context/MovieContext';
import MovieCard from '../components/MovieCard';
import { getMovieDetails } from "../services/api";
import "./Favorite.css";

const Favorite = () => {
  const { watchlist, isFav, removeFav, addFav } = useMovieContext();
  
  // States for Video Player
  const [activeMovie, setActiveMovie] = useState(null);
  const [movieExtraInfo, setMovieExtraInfo] = useState(null);
  const [player, setPlayer] = useState({
    isPlaying: false,
    isTrailer: false,
    server: 1
  });

  const playerSectionRef = useRef(null);

  // Fetch movie details for modal (Trailers, Cast, etc.)
  const openMovieDetails = async (movie) => {
    setActiveMovie(movie);
    setMovieExtraInfo(null);
    setPlayer({ isPlaying: false, isTrailer: false, server: 1 });
    try {
      const details = await getMovieDetails(movie.id);
      setMovieExtraInfo(details);
    } catch (err) {
      console.error("Cinematic Data Sync Error:", err);
    }
  };

  const handleFavToggle = (e, movie) => {
    e.preventDefault();
    e.stopPropagation();
    isFav(movie.id) ? removeFav(movie.id) : addFav(movie);
  };

  const getPlayerURL = () => {
    if (player.isTrailer) {
      const videos = movieExtraInfo?.videos?.results || [];
      const trailer = videos.find(v => v.type === "Trailer") || videos[0];
      return trailer ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1` : "";
    }
    const id = activeMovie?.id;
    const servers = {
      1: `https://vidsrc.me/embed/movie?tmdb=${id}`,
      2: `https://vidsrc.xyz/embed/movie/${id}`,
      3: `https://vidsrc.pm/embed/movie/${id}`
    };
    return servers[player.server];
  };

  return (
    <div className="favorite-page">
      {/* --- PREMIUM HEADER SECTION --- */}
      <div className="favorite-header-main">
        <div className="header-text-info">
           <motion.h2 
             className="premium-title"
             initial={{ x: -20, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
           >
             My <span>Collection</span>
           </motion.h2>
           <div className="collection-stats">
              <Library size={16} color="#e50914" />
              <span>{watchlist.length} Movies Saved</span>
           </div>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      { watchlist.length > 0 ? (
        <motion.div layout className="static-movie-grid">
          <AnimatePresence mode='popLayout'>
            { watchlist.map((m) => (
              <motion.div 
                key={m.id} 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="movie-tile-premium" 
                onClick={() => openMovieDetails(m)}
              >
                <MovieCard movie={m} />
                <button className="watchlist-btn-overlay" onClick={(e) => handleFavToggle(e, m)}>
                  <Heart size={18} fill={isFav(m.id) ? "#e50914" : "none"} color={isFav(m.id) ? "#e50914" : "white"} />
                </button>
                <div className="tile-overlay-simple">
                  <PlayCircle size={44} fill="white" color="black" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* --- ANIMATED EMPTY STATE --- */
        <motion.div 
          className="empty-state-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="empty-box-glass">
            <div className="animated-heart-wrapper">
              <Heart size={80} className="floating-heart" fill="rgba(229, 9, 20, 0.2)" color="#e50914" />
              <div className="heart-pulse-ring"></div>
            </div>
            <h3 className="empty-heading">Your Library is Empty</h3>
            <p className="empty-subtext">Start adding movies to build your personal cinema hall.</p>
            <Link to="/" className="explore-btn-premium">
              <Play size={18} fill="currentColor" />
              <span>Explore Discovery</span>
            </Link>
          </div>
        </motion.div>
      )}

      {/* --- CINEMATIC PLAYER MODAL --- */}
      <AnimatePresence>
        {activeMovie && (
          <motion.div className="ultra-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className={`modal-container ${player.isPlaying || player.isTrailer ? 'player-mode' : 'glass-card'}`}>
              <button className="close-modal" onClick={() => setActiveMovie(null)}><X size={28}/></button>

              {!(player.isPlaying || player.isTrailer) ? (
                <div className="details-view scrollable-modal-content">
                  <div className="details-grid">
                    <div className="poster-box">
                      <img src={`https://image.tmdb.org/t/p/w500${activeMovie.poster_path}`} alt="poster" />
                    </div>
                    <div className="info-box">
                      <div className="badge-row">
                        <span className="rating-badge"><Star size={16} fill="gold" color="gold"/> {activeMovie.vote_average?.toFixed(1)}</span>
                        <span className="quality-tag">4K ULTRA HD</span>
                      </div>
                      <h1>{activeMovie.title}</h1>
                      <p className="synopsis">{activeMovie.overview}</p>
                      <div className="action-row-main">
                        <button className="play-main-btn" onClick={() => setPlayer(p => ({...p, isPlaying: true}))}>
                          <Play size={20} fill="black" /> Play Now
                        </button>
                        <button className="trailer-btn" onClick={() => setPlayer(p => ({...p, isTrailer: true}))}>
                          <Video size={20} /> Trailer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="player-wrapper" ref={playerSectionRef}>
                  <div className="player-header-overlay">
                    <button className="pc-back" onClick={() => setPlayer(p => ({...p, isPlaying: false, isTrailer: false}))}>
                      <ChevronLeft /> Back
                    </button>
                    <span className="pc-title">{activeMovie.title}</span>
                    {!player.isTrailer && (
                      <div className="server-switcher">
                        {[1, 2, 3].map(s => (
                          <button key={s} className={player.server === s ? 's-btn active' : 's-btn'} onClick={() => setPlayer(p => ({...p, server: s}))}>Server {s}</button>
                        ))}
                      </div>
                    )}
                  </div>
                  <iframe src={getPlayerURL()} allowFullScreen className="full-player-frame" title="CinemaEngine" allow="autoplay; encrypted-media"></iframe>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Favorite;