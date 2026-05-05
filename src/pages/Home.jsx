import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, Search, X, Download, Volume2, VolumeX, Settings, Maximize, 
  Star, SkipForward, SkipBack, Share2, TrendingUp, Award, 
  Flame, Info, ChevronLeft, AlertCircle, Loader2, Plus, Monitor
} from 'lucide-react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import MovieCard from '../components/MovieCard';
import { moviePopular, movieSearch, movieTrending, movieTopRated } from "../services/api"; 
import "./Home.css";

const Home = () => {
  const [search, setSearch] = useState("");
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [popular, setPopular] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // --- NEW PLAYER STATES ---
  const [activeMovie, setActiveMovie] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState("4K Ultra HD");
  
  const searchRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // 1. Navbar & Scroll Lock
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    document.body.style.overflow = activeMovie ? 'hidden' : 'unset';
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeMovie]);

  // 2. Data Fetching
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [trend, top, pop] = await Promise.all([
        movieTrending(), movieTopRated(), moviePopular()
      ]);
      setTrending(trend || []);
      setTopRated(top || []);
      setPopular(pop || []);
    } catch (err) {
      setError("Failed to sync with World Cinema servers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAllData(); }, [fetchAllData]);

  // 3. Player UI Management (Auto-Hide)
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  // 4. Navigation Logic (Next/Prev)
  const handleNavigate = (direction) => {
    const currentList = trending; // Default list for navigation
    const currentIndex = currentList.findIndex(m => m.id === activeMovie.id);
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < currentList.length) {
      setActiveMovie(currentList[newIndex]);
      setIsPlaying(true);
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!search.trim()) return;
    setLoading(true);
    try {
      const data = await movieSearch(search);
      setSearchResults(data || []);
      setTimeout(() => searchRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const clearSearch = () => {
    setSearch("");
    setSearchResults([]);
  };

  const toggleFullscreen = () => {
    const elem = document.getElementById("video-container");
    if (!document.fullscreenElement) elem.requestFullscreen();
    else document.exitFullscreen();
  };

  const MovieSection = ({ title, data, icon: Icon, isGrid = false }) => {
    if (!data || data.length === 0) return null;
    return (
      <div className="section-wrapper">
        <div className="shelf-info">
          <div className="accent-bar"></div>
          <div className="section-title-flex">
              {Icon && <Icon className="title-icon" size={22} />}
              <h2>{title}</h2>
          </div>
        </div>

        {isGrid ? (
          <div className="static-movie-grid">
            {data.map((m) => (
              <motion.div key={m.id} whileHover={{ scale: 1.05 }} className="movie-tile-premium" onClick={() => setActiveMovie(m)}>
                <MovieCard movie={m} />
                <div className="tile-overlay-simple">
                  <div className="play-icon-glow"><Play fill="white" size={20}/></div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={2.2}
            loop={data.length > 6}
            autoplay={{ delay: 3500, pauseOnMouseEnter: true }}
            breakpoints={{ 640: { slidesPerView: 3.5 }, 1024: { slidesPerView: 5.2 }, 1440: { slidesPerView: 6.5 }}}
            className="movie-swiper"
          >
            {data.map((m) => (
              <SwiperSlide key={m.id}>
                <div className="movie-tile-premium" onClick={() => setActiveMovie(m)}>
                  <MovieCard movie={m} />
                  <div className="tile-overlay-simple">
                    <div className="play-icon-glow"><Play fill="white" size={20}/></div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    );
  };

  return (
    <div className="app-canvas" onMouseMove={activeMovie ? handleMouseMove : null}>
      {/* --- NAVBAR --- */}
      <nav className={`premium-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-left">
          <h1 className="brand-logo">WORLD<span>MANIA</span></h1>
          <div className="nav-links">
            <span className="active">Home</span>
            <span>Movies</span>
            <span>Series</span>
          </div>
        </div>
        <div className="nav-right">
            <div className="user-badge">PRO</div>
        </div>
      </nav>

      {/* --- HERO & SEARCH (Same as before) --- */}
      {searchResults.length === 0 && (
        <section className="hero-slider-wrapper">
          {loading ? (
            <div className="hero-skeleton-loader"><Loader2 className="animate-spin" size={40} color="#ff0000" /></div>
          ) : (
            <Swiper modules={[Autoplay, EffectFade, Pagination]} effect="fade" loop autoplay={{ delay: 6000 }} pagination={{ clickable: true }} className="hero-swiper">
              {trending.slice(0, 6).map((m) => (
                <SwiperSlide key={m.id}>
                  <div className="hero-slide-item" style={{backgroundImage: `url(https://image.tmdb.org/t/p/original${m.backdrop_path})`}}>
                    <div className="hero-vignette-master"></div>
                    <div className="hero-content-stack">
                      <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="brand-badge"><Flame size={14} fill="currentColor"/> GLOBAL TRENDING</div>
                        <h1 className="main-display-text">{m.title || m.name}</h1>
                        <div className="hero-btn-group">
                          <button className="primary-btn" onClick={() => setActiveMovie(m)}><Play size={20} fill="black" /> Play Now</button>
                          <button className="secondary-btn"><Plus size={20} /> My List</button>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </section>
      )}

      <div ref={searchRef} className={`search-container-wrap ${searchResults.length > 0 ? 'sticky-active' : ''}`}>
          <form className="central-search-form glassmorphism" onSubmit={handleSearch}>
            <div className="search-field">
              <Search className="field-icon" size={22} />
              <input placeholder="Search movies, actors, genres..." value={search} onChange={(e) => setSearch(e.target.value)} />
              {search && <X className="clear-search" onClick={clearSearch} size={18} />}
            </div>
            <button type="submit" className="search-trigger">Explore</button>
          </form>
      </div>

      <main className="content-grid-area">
        {searchResults.length > 0 ? (
            <div className="search-results-flow">
               <button className="back-link" onClick={clearSearch}><ChevronLeft size={18} /> Exit Results</button>
               <MovieSection title={`Results for "${search}"`} data={searchResults} icon={Search} isGrid={true} />
            </div>
        ) : (
            <>
                <MovieSection title="Trending Globally" data={trending} icon={TrendingUp} />
                <MovieSection title="Critically Acclaimed" data={topRated} icon={Award} isGrid={true} />
                <MovieSection title="Popular Picks" data={popular} icon={Flame} />
            </>
        )}
      </main>

      {/* --- ULTRA CINEMA MODAL --- */}
      <AnimatePresence>
        {activeMovie && (
          <motion.div className="fullscreen-player" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="player-backdrop-blur" onClick={() => setActiveMovie(null)}></div>
            <motion.div className="player-modal-content" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              
              {/* Header: Auto-hide applied */}
              <div className={`player-header-overlay ${!showControls ? 'hide-ui' : ''}`}>
                <div className="movie-meta-info">
                  <span className="live-badge"><span className="pulse-dot"></span> 4K STREAMING</span>
                  <h3 className="player-title">{activeMovie.title || activeMovie.name}</h3>
                </div>
                <div className="player-top-actions">
                  <button className="icon-btn-premium" onClick={() => alert("Starting Download...")}><Download size={20}/></button>
                  <button className="icon-btn-premium"><Share2 size={20}/></button>
                  <button className="p-close-premium" onClick={() => setActiveMovie(null)}><X size={28}/></button>
                </div>
              </div>

              {/* Video Viewport */}
              <div className="video-viewport" id="video-container">
                <iframe 
                  key={activeMovie.id}
                  src={activeMovie.first_air_date 
                    ? `https://vidsrc.to/embed/tv/${activeMovie.id}/1/1` 
                    : `https://vidsrc.to/embed/movie/${activeMovie.id}`
                  } 
                  allowFullScreen
                  title="WorldMania Player"
                ></iframe>
              </div>

              {/* Controls: Auto-hide applied */}
              <div className={`player-control-hub glassmorphism ${!showControls ? 'hide-ui' : ''}`}>
                <div className="premium-progress-container">
                    <div className="fake-progress-bar">
                        <div className="progress-filled" style={{width: '40%'}}></div>
                        <div className="progress-knob" style={{left: '40%'}}></div>
                    </div>
                </div>

                <div className="controls-flex-row">
                  <div className="ctrl-group">
                      <button className="ctrl-btn-sub" onClick={() => handleNavigate('prev')}><SkipBack size={22} fill="currentColor"/></button>
                      
                      <button className="play-btn-main" onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? <Pause size={30} fill="black"/> : <Play size={30} fill="black" style={{marginLeft: '4px'}}/>}
                      </button>

                      <button className="ctrl-btn-sub" onClick={() => handleNavigate('next')}><SkipForward size={22} fill="currentColor"/></button>
                      
                      <div className="volume-module">
                         <button onClick={() => setIsMuted(!isMuted)} className="volume-icon">
                            {isMuted || volume == 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                         </button>
                         <input 
                            type="range" 
                            className="premium-slider" 
                            min="0" max="100" 
                            value={isMuted ? 0 : volume} 
                            onChange={(e) => {setVolume(e.target.value); setIsMuted(false);}} 
                         />
                      </div>
                  </div>

                  <div className="ctrl-group">
                     <div className="quality-selector-pill">
  <Monitor size={16} className="quality-icon" />
  <select 
    className="quality-dropdown" 
    value={quality} 
    onChange={(e) => setQuality(e.target.value)}
  >
    <option value="4k">4K Ultra HD</option>
    <option value="1080">1080p FHD</option>
    <option value="720">720p HD</option>
  </select>
</div>
                      <button className="ctrl-btn-sub" onClick={toggleFullscreen}><Maximize size={22}/></button>
                  </div>
                </div>
              </div>

              <div className="player-info-shelf">
                  <div className="info-stats">
                    <span className="rating-tag"><Star size={14} fill="#FFD700" color="#FFD700"/> {activeMovie.vote_average?.toFixed(1)}</span>
                    <span className="year-tag">{new Date(activeMovie.release_date || activeMovie.first_air_date).getFullYear()}</span>
                    <span className="hd-tag">HDR</span>
                  </div>
                  <p className="player-synopsis">{activeMovie.overview}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;