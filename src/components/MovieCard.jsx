import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

import { Star, Heart, Play, Calendar, ShieldCheck } from 'lucide-react'; 
import "./MovieCard.css";

const MovieCard = ({ movie, index }) => {

    // --- 3D TILT LOGIC ---
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    
    // Stiffness aur damping ko customize kiya taake tilt silky smooth ho
    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 25 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 25 });
    
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

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

    const onFavClick = (e) => {
        e.preventDefault();
        e.stopPropagation(); 
        favorite ? removeFav(movie.id) : addFav(movie);
    };

    return (
        <motion.div 
            className='movie-card-wrapper'
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
            viewport={{ once: true }}
        >
            <motion.div 
                className='movie-card-premium'
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                whileHover={{ y: -5 }}
            >

                {/* PREMIUM BADGE */}
                {movie.vote_average > 7.5 && (
                    <div className="premium-badge" style={{ transform: "translateZ(40px)" }}>
                        <ShieldCheck size={12} />
                        <span>TOP RATED</span>
                    </div>
                )}

                <div className="card-media-layer">
                    <img 
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/placeholder.jpg"} 
                        alt={movie.title} 
                        className="poster-image"
                        loading="lazy"
                    />
                    <div className="cinematic-overlay-gradient" />

                    {/* Play Hover Overlay */}
                    <div className="play-trigger-overlay" style={{ transform: "translateZ(60px) translate(-50%, -50%)" }}>
                        <div className="glass-play-circle">
                            <Play fill="white" size={24} />
                        </div>
                    </div>

                    {/* Bottom Info Panel */}
                    <div className="glass-info-panel" style={{ transform: "translateZ(85px)" }}>
                        <h3 className="card-title">{movie.title || movie.name}</h3>
                        <div className="card-meta-row">
                            <div className="meta-tag">
                                <Calendar size={12} />
                                <span>{(movie.release_date || movie.first_air_date)?.split("-")[0] || "N/A"}</span>
                            </div>
                            <div className="meta-tag rating-tag">
                                <Star size={12} fill="#FFD700" color="#FFD700" />
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