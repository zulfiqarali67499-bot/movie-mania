import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useMovieContext } from '../context/MovieContext';
import { Star, Heart, TrendingUp, Play, Calendar, ShieldCheck } from 'lucide-react'; 
import "./MovieCard.css";

const MovieCard = ({ movie, index }) => {
    const { isFav, removeFav, addFav } = useMovieContext();
    const favorite = isFav(movie.id);

    // --- 3D TILT LOGIC ---
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 100, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 100, damping: 20 });
    
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    // --- FIXED CLICK LOGIC ---
    const onFavClick = (e) => {
        e.preventDefault();
        e.stopPropagation(); // Card click event ko yahan rokna zarori hai
        
        if (favorite) {
            removeFav(movie.id);
        } else {
            addFav(movie);
        }
    };

    return (
        <motion.div 
            className='movie-card-wrapper'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: (index % 6) * 0.1 }}
            viewport={{ once: true }}
        >
            <motion.div 
                className='movie-card-premium'
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {/* 1. FAVORITE BUTTON - Iski layer sab se upar hai */}
                <div className="fav-control-layer" style={{ transform: "translateZ(90px)" }}>
                    <motion.button 
                        className={`mania-fav-btn ${favorite ? "active" : ""}`}
                        onClick={onFavClick}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.85 }}
                    >
                        <Heart 
                            size={20} 
                            fill={favorite ? "#ff0000" : "none"} 
                            color={favorite ? "#ff0000" : "white"} 
                            strokeWidth={2.5}
                        />
                    </motion.button>
                </div>

                {/* 2. PREMIUM BADGE */}
                {movie.vote_average > 7.5 && (
                    <div className="premium-badge" style={{ transform: "translateZ(50px)" }}>
                        <ShieldCheck size={12} />
                        <span>PREMIUM</span>
                    </div>
                )}

                <div className="card-media-layer">
                    <img 
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/500x750"} 
                        alt={movie.title} 
                        className="poster-image"
                    />
                    
                    <div className="cinematic-overlay-gradient" />

                    {/* Play Hover State */}
                    <div className="play-trigger-overlay" style={{ transform: "translateZ(60px) translate(-50%, -50%)" }}>
                        <div className="glass-play-circle">
                            <Play fill="white" size={28} />
                        </div>
                    </div>

                    {/* Bottom Content Panel */}
                    <div className="glass-info-panel" style={{ transform: "translateZ(80px)" }}>
                        <h3 className="card-title">{movie.title || movie.name}</h3>
                        <div className="card-meta-row">
                            <div className="meta-tag">
                                <Calendar size={12} />
                                <span>{(movie.release_date || movie.first_air_date)?.split("-")[0]}</span>
                            </div>
                            <div className="meta-tag rating-tag">
                                <Star size={12} fill="#ffcc00" color="#ffcc00" />
                                <span>{movie.vote_average?.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default MovieCard;