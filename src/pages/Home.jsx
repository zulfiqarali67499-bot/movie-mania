import React, { useEffect, useState, useCallback, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";

// Lucide Icons
import { 
  Play, Search, X, Star, TrendingUp, Award, Heart, Plus, Video, 
  PlayCircle, Settings, Globe, Download, SkipBack, SkipForward, 
  Maximize, Pause, ChevronLeft, Clock, Flame
} from 'lucide-react';

// Swiper Components and Styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// CSS Styling
import "./Home.css";

// Context & Custom Components
import { useMovieContext } from '../context/MovieContext';
import MovieCard from '../components/MovieCard';

// Hooks & Services - Sare imports yahan consolidated hain
import { 
  moviePopular, 
  movieSearch, 
  movieTrending, 
  movieTopRated, 
  movieUpcoming, 
  movieNowPlaying, 
  getMovieDetails 
} from "../services/api";

// --- Helper Component: Movie Item ---
const MovieItem = ({ m, isFav, onFavToggle, onOpen }) => (
  <div className="movie-tile-premium" onClick={() => onOpen(m)}>
    <MovieCard movie={m} />
    <button 
      className="watchlist-btn-overlay" 
      onClick={(e) => onFavToggle(e, m)}
    >
      <Heart 
        size={18} 
        fill={isFav(m.id) ? "#e50914" : "none"} 
        color={isFav(m.id) ? "#e50914" : "white"} 
      />
    </button>
    <div className="tile-overlay-simple">
      <PlayCircle size={44} fill="white" color="black" />
    </div>
  </div>
);

const Home = () => {
  const { isFav, removeFav, addFav } = useMovieContext();
  
  // --- States ---
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  
  // Data state jahan saari categories save hongi
  const [data, setData] = useState({
    trending: [], 
    topRated: [], 
    popular: [], 
    upcoming: [], 
    nowPlaying: []
  });

  // Modal & Player States
  const [activeMovie, setActiveMovie] = useState(null);
  const [movieExtraInfo, setMovieExtraInfo] = useState(null);
  const [player, setPlayer] = useState({
    isPlaying: false,
    isTrailer: false,
    paused: false,
    server: 1
  });

  const iframeRef = useRef(null);
  const playerSectionRef = useRef(null);

  // --- Scroll Logic ---
  useLayoutEffect(() => {
    if ((player.isPlaying || player.isTrailer) && playerSectionRef.current) {
      const timeout = setTimeout(() => {
        const yOffset = -100;
        const element = playerSectionRef.current;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [player.isPlaying, player.isTrailer]);

  // --- Data Fetching ---
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      // Promise.all use karke saare API calls ek sath execute honge
      const [trend, top, pop, up, now] = await Promise.all([
        movieTrending(), 
        movieTopRated(), 
        moviePopular(), 
        movieUpcoming(), 
        movieNowPlaying()
      ]);

      setData({ 
        trending: trend || [], 
        topRated: top || [], 
        popular: pop || [], 
        upcoming: up || [], 
        nowPlaying: now || [] 
      });
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAllData(); }, [fetchAllData]);

  // --- Handlers ---
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!search.trim()) return;
    setLoading(true);
    setIsSearching(true);
    try {
      const res = await movieSearch(search);
      setSearchResults(res || []);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error("Search Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearch("");
    setSearchResults([]);
    setIsSearching(false);
  };

  const openMovieDetails = async (movie) => {
    setActiveMovie(movie);
    setMovieExtraInfo(null);
    setPlayer({ isPlaying: false, isTrailer: false, paused: false, server: 1 });
    try {
      const details = await getMovieDetails(movie.id);
      setMovieExtraInfo(details);
    } catch (err) {
      console.error("Details Load Error:", err);
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
      return trailer ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&enablejsapi=1` : "";
    }
    const id = activeMovie?.id;
    const servers = {
      1: `https://vidsrc.me/embed/movie?tmdb=${id}`,
      2: `https://vidsrc.xyz/embed/movie/${id}`,
      3: `https://vidsrc.pm/embed/movie/${id}`
    };
    return servers[player.server];
  };

  const togglePlayPause = () => {
    setPlayer(prev => ({ ...prev, paused: !prev.paused }));
  };

  // --- Sub-Section Renderer ---
  const renderSection = (title, movies, Icon, isGrid = false) => (
    <div className="section-wrapper glass-container">
      <div className="section-header">
        <div className="title-left">
          {Icon && <Icon className="accent-icon" size={24} color="#e50914" />}
          <h2>{title}</h2>
        </div>
      </div>
      {isGrid ? (
        <div className="static-movie-grid">
          {movies.map(m => (
            <MovieItem key={m.id} m={m} isFav={isFav} onFavToggle={handleFavToggle} onOpen={openMovieDetails} />
          ))}
        </div>
      ) : (
        <Swiper 
          modules={[Pagination]} 
          spaceBetween={20} 
          slidesPerView={2.2} 
          breakpoints={{ 
            1024: { slidesPerView: 5.5 }, 
            768: { slidesPerView: 3.5 } 
          }}
        >
          {movies.map(m => (
            <SwiperSlide key={m.id}>
              <MovieItem m={m} isFav={isFav} onFavToggle={handleFavToggle} onOpen={openMovieDetails} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );

  return (
    <div className="app-canvas">
      {/* Search Header */}
      <div className="search-overlay-container">
        <form className="search-pill glassmorphism big-search" onSubmit={handleSearch}>
          <Search size={22} color="#e50914" />
          <input 
            placeholder="Search for movies..." 
            value={search} 
            onChange={(e) => { setSearch(e.target.value); if(!e.target.value) clearSearch(); }} 
          />
          {search && <X size={20} className="search-clear-icon" onClick={clearSearch} />}
        </form>
      </div>

      {/* Hero Section */}
      {!isSearching && (
        <section className="hero-banner">
          <Swiper 
            modules={[Autoplay, EffectFade, Pagination]} 
            effect="fade" 
            autoplay={{ delay: 6000 }} 
            pagination={{ clickable: true }}
          >
            {data.trending.slice(0, 5).map(m => (
              <SwiperSlide key={m.id}>
                <div className="hero-slide" style={{backgroundImage: `url(https://image.tmdb.org/t/p/original${m.backdrop_path})`}}>
                  <div className="hero-vignette" />
                  <div className="hero-content">
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      {m.title || m.name}
                    </motion.h1>
                    <div className="hero-btns">
                      <button className="primary-btn" onClick={() => openMovieDetails(m)}>
                        <Play size={20} fill="black"/> Watch Now
                      </button>
                      <button className="secondary-btn" onClick={(e) => handleFavToggle(e, m)}>
                        <Plus size={20}/> {isFav(m.id) ? "Saved" : "Watchlist"}
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}

      {/* Main Content */}
      <main className="main-content">
        {loading && <div className="loader-box">SYNCING CINEMA...</div>}
        
        {isSearching ? (
          renderSection(`Results for "${search}"`, searchResults, Search, true)
        ) : (
          <>
            {renderSection("Trending Now", data.trending, TrendingUp)}
            {renderSection("Popular Choice", data.popular, Flame)}
            {renderSection("New Releases", data.nowPlaying, Clock)}
            {renderSection("Top Rated", data.topRated, Award, true)}
          </>
        )}
      </main>

      {/* Immersive Modal */}
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
                        <span className="rating-badge">
                          <Star size={16} fill="gold" color="gold"/> {activeMovie.vote_average?.toFixed(1)}
                        </span>
                        <span className="quality-tag">4K ULTRA HD</span>
                      </div>
                      <h1>{activeMovie.title || activeMovie.name}</h1>
                      <p className="synopsis">{activeMovie.overview}</p>
                      <div className="cast-row">
                        {movieExtraInfo?.credits?.cast?.slice(0, 4).map(c => (
                          <div key={c.id} className="cast-chip">
                            <img src={c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : 'https://via.placeholder.com/40'} alt={c.name} />
                            <span>{c.name}</span>
                          </div>
                        ))}
                      </div>
                      <div className="action-row-main">
                        <button className="play-main-btn" onClick={() => setPlayer(p => ({...p, isPlaying: true}))}>
                          <Play size={20} fill="black" /> Play Now
                        </button>
                        <button className="trailer-btn" onClick={() => setPlayer(p => ({...p, isTrailer: true}))}>
                          <Video size={20} /> Trailer
                        </button>
                        <button className="fav-modal-btn" onClick={(e) => handleFavToggle(e, activeMovie)}>
                           <Heart size={20} fill={isFav(activeMovie.id) ? "#e50914" : "none"} color={isFav(activeMovie.id) ? "#e50914" : "white"} />
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Related Section inside modal */}
                  {renderSection("More Like This", data.popular.slice(0, 10))}
                </div>
              ) : (
                <div className="player-wrapper" ref={playerSectionRef}>
                  <div className="player-header-overlay">
                    <button className="pc-back" onClick={() => setPlayer(p => ({...p, isPlaying: false, isTrailer: false}))}>
                      <ChevronLeft /> Back
                    </button>
                    <span className="pc-title">{activeMovie.title} {player.isTrailer && "(Trailer)"}</span>
                    {!player.isTrailer && (
                      <div className="server-switcher">
                        {[1, 2, 3].map(s => (
                          <button key={s} className={player.server === s ? 's-btn active' : 's-btn'} onClick={() => setPlayer(p => ({...p, server: s}))}>S{s}</button>
                        ))}
                      </div>
                    )}
                  </div>
                  <iframe 
                    key={`${activeMovie.id}-${player.server}-${player.isTrailer}`} 
                    src={getPlayerURL()} 
                    allowFullScreen 
                    className="full-player-frame" 
                    title="Player" 
                    allow="autoplay; encrypted-media; fullscreen"
                  ></iframe>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;