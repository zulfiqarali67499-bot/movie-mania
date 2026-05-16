import React, { useEffect, useState, useCallback, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Search, X, Star, TrendingUp, Award, Heart, Plus, Video, 
  PlayCircle, ChevronLeft, Clock, Flame, ShieldCheck
} from 'lucide-react';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Parallax } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import "./Home.css";
import { useMovieContext } from '../context/MovieContext';
import MovieCard from '../components/MovieCard';
import { 
  moviePopular, movieSearch, movieTrending, 
  movieTopRated, movieUpcoming, movieNowPlaying, getMovieDetails 
} from "../services/api";

// --- Sub-Component: Movie Item ---
const MovieItem = ({ m, isFav, onFavToggle, onOpen }) => (
  <div className="movie-tile-premium" onClick={() => onOpen(m)}>
    <MovieCard movie={m} />
    <button 
      className="watchlist-btn-overlay" 
      onClick={(e) => {
        e.stopPropagation();
        onFavToggle(m);
      }}
    >
      <Heart 
        size={18} 
        fill={isFav(m.id) ? "#e50914" : "none"} 
        color={isFav(m.id) ? "#e50914" : "white"} 
      />
    </button>
    <div className="tile-overlay-simple">
      <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
        <PlayCircle size={50} fill="white" color="black" />
      </motion.div>
    </div>
  </div>
);

const Home = () => {
  const { isFav, removeFav, addFav } = useMovieContext();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [data, setData] = useState({
    trending: [], topRated: [], popular: [], upcoming: [], nowPlaying: []
  });

  const [activeMovie, setActiveMovie] = useState(null);
  const [movieExtraInfo, setMovieExtraInfo] = useState(null);
  const [player, setPlayer] = useState({ isPlaying: false, isTrailer: false, server: 1 });
  const playerSectionRef = useRef(null);

  // --- NEW: Watch History Saver ---
  const saveToWatchHistory = (movie) => {
    const movieData = {
      id: movie.id,
      title: movie.title || movie.name,
      poster_path: movie.poster_path,
      watchedAt: new Date().toISOString()
    };
    const history = JSON.parse(localStorage.getItem('mm_history') || "[]");
    // Purani entries filter karein taake duplicate na ho aur latest upar aaye
    const updatedHistory = [movieData, ...history.filter(m => m.id !== movie.id)].slice(0, 15);
    localStorage.setItem('mm_history', JSON.stringify(updatedHistory));
  };

  useLayoutEffect(() => {
    if ((player.isPlaying || player.isTrailer) && playerSectionRef.current) {
      setTimeout(() => {
        playerSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [player.isPlaying, player.isTrailer]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        movieTrending(), movieTopRated(), moviePopular(), movieUpcoming(), movieNowPlaying()
      ]);
      
      setData({
        trending: results[0].status === 'fulfilled' ? results[0].value : [],
        topRated: results[1].status === 'fulfilled' ? results[1].value : [],
        popular: results[2].status === 'fulfilled' ? results[2].value : [],
        upcoming: results[3].status === 'fulfilled' ? results[3].value : [],
        nowPlaying: results[4].status === 'fulfilled' ? results[4].value : [],
      });
    } catch (err) {
      console.error("Critical Fetch Error", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAllData(); }, [fetchAllData]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!search.trim()) return;
    setLoading(true);
    setIsSearching(true);
    try {
      const res = await movieSearch(search);
      setSearchResults(res || []);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const openMovieDetails = async (movie) => {
    setActiveMovie(movie);
    setMovieExtraInfo(null);
    setPlayer({ isPlaying: false, isTrailer: false, server: 1 });
    
    // Save to History when movie modal opens
    saveToWatchHistory(movie);

    try {
      const details = await getMovieDetails(movie.id);
      setMovieExtraInfo(details);
    } catch (err) { console.error(err); }
  };

  const getPlayerURL = () => {
    if (player.isTrailer) {
      const trailer = movieExtraInfo?.videos?.results?.find(v => v.type === "Trailer") || movieExtraInfo?.videos?.results?.[0];
      return trailer ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0` : "";
    }
    const servers = {
      1: `https://vidsrc.me/embed/movie?tmdb=${activeMovie?.id}`,
      2: `https://vidsrc.xyz/embed/movie/${activeMovie?.id}`,
      3: `https://vidsrc.pm/embed/movie/${activeMovie?.id}`
    };
    return servers[player.server];
  };

  const renderSection = (title, movies, Icon, isGrid = false) => (
    <motion.div 
      className="section-wrapper"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="section-header">
        <div className="title-left">
          {Icon && <Icon className="accent-icon" size={22} color="#e50914" />}
          <h2>{title}</h2>
        </div>
      </div>
      {isGrid ? (
        <div className="static-movie-grid">
          {movies.map(m => (
            <MovieItem 
              key={m.id} 
              m={m} 
              isFav={isFav} 
              onFavToggle={(movie) => isFav(movie.id) ? removeFav(movie.id) : addFav(movie)} 
              onOpen={openMovieDetails} 
            />
          ))}
        </div>
      ) : (
        <Swiper 
          modules={[Pagination]} 
          spaceBetween={20} 
          slidesPerView={2.2} 
          breakpoints={{ 1024: { slidesPerView: 5.5 }, 768: { slidesPerView: 3.5 } }}
        >
          {movies.map(m => (
            <SwiperSlide key={m.id}>
              <MovieItem 
                m={m} 
                isFav={isFav} 
                onFavToggle={(movie) => isFav(movie.id) ? removeFav(movie.id) : addFav(movie)} 
                onOpen={openMovieDetails} 
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </motion.div>
  );

  return (
    <div className="app-canvas">
      <div className="search-overlay-container">
        <form className="search-pill big-search" onSubmit={handleSearch}>
          <Search size={22} color="#e50914" />
          <input 
            placeholder="Search movies, actors, genres..." 
            value={search} 
            onChange={(e) => { setSearch(e.target.value); if(!e.target.value) setIsSearching(false); }} 
          />
          {search && <X size={20} className="search-clear-icon" onClick={() => { setSearch(""); setIsSearching(false); }} />}
        </form>
      </div>

      {!isSearching && (
        <section className="hero-banner">
          <Swiper 
            modules={[Autoplay, EffectFade, Pagination, Parallax]} 
            effect="fade" 
            parallax={true}
            autoplay={{ delay: 8000 }} 
            pagination={{ clickable: true }}
          >
            {data.trending.slice(0, 6).map(m => (
              <SwiperSlide key={m.id}>
                <div className="hero-slide" style={{backgroundImage: `url(https://image.tmdb.org/t/p/original${m.backdrop_path})`}}>
                  <div className="hero-vignette" />
                  <div className="hero-content" data-swiper-parallax="-300">
                    <motion.h1 initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>{m.title || m.name}</motion.h1>
                    <p>{m.overview?.slice(0, 160)}...</p>
                    <div className="hero-btns">
                      <button className="play-main-btn" onClick={() => openMovieDetails(m)}>
                        <Play size={20} fill="black"/> Play
                      </button>
                      <button className="secondary-btn" onClick={() => isFav(m.id) ? removeFav(m.id) : addFav(m)}>
                        <Plus size={20}/> Watchlist
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}

      <main className="main-content">
        {loading && <div className="loader-box"><div className="spinner"></div><p>LOADING CINEMA</p></div>}
        
        {isSearching ? (
          renderSection(`Results for "${search}"`, searchResults, Search, true)
        ) : (
          <>
            {renderSection("Trending Now", data.trending, TrendingUp)}
            {renderSection("Popular on MovieMania", data.popular, Flame)}
            {renderSection("Recently Added", data.nowPlaying, Clock)}
            {renderSection("Global Top Rated", data.topRated, Award, true)}
          </>
        )}
      </main>

      <AnimatePresence>
        {activeMovie && (
          <motion.div className="ultra-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div 
              className={`modal-container ${player.isPlaying || player.isTrailer ? 'player-mode' : ''}`}
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
            >
              <button className="close-modal" onClick={() => setActiveMovie(null)}><X size={28}/></button>

              {!(player.isPlaying || player.isTrailer) ? (
                <div className="scrollable-modal-content">
                  <div className="details-grid">
                    <div className="poster-box">
                      <img src={`https://image.tmdb.org/t/p/w500${activeMovie.poster_path}`} alt="poster" />
                    </div>
                    <div className="info-box">
                      <div className="badge-row">
                        <span className="rating-badge"><Star size={16} fill="gold" color="gold"/> {activeMovie.vote_average?.toFixed(1)}</span>
                        <span className="quality-tag">4K HDR</span>
                        <span className="year-tag">{(activeMovie.release_date || activeMovie.first_air_date)?.split('-')[0]}</span>
                      </div>
                      <h1>{activeMovie.title || activeMovie.name}</h1>
                      
                      {/* Genres Section */}
                      <div className="genre-pills">
                        {movieExtraInfo?.genres?.map(g => (
                          <span key={g.id} className="pill">{g.name}</span>
                        ))}
                      </div>

                      <p className="synopsis">{activeMovie.overview}</p>
                      
                      {/* Cast Section */}
                      {movieExtraInfo?.credits?.cast && (
                        <div className="cast-mini-list">
                          <h3>Top Cast</h3>
                          <div className="cast-scroll">
                            {movieExtraInfo.credits.cast.slice(0, 8).map(person => (
                              <div key={person.id} className="cast-card">
                                <img src={person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : 'https://via.placeholder.com/100'} alt="" />
                                <span>{person.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

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
                      <ChevronLeft /> Back to Details
                    </button>
                    {!player.isTrailer && (
                      <div className="server-switcher">
                        {[1, 2, 3].map(s => (
                          <button key={s} className={player.server === s ? 's-btn active' : 's-btn'} onClick={() => setPlayer(p => ({...p, server: s}))}>Server {s}</button>
                        ))}
                      </div>
                    )}
                  </div>
                  <iframe 
                    src={getPlayerURL()} 
                    className="full-player-frame" 
                    allowFullScreen 
                    scrolling="no"
                    sandbox="allow-forms allow-scripts allow-pointer-lock allow-same-origin allow-top-navigation"
                  />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;