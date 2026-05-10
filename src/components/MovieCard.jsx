import React, { memo, useState } from 'react'; // Added memo & useState
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Star, Play, Calendar, ShieldCheck, ImageOff } from 'lucide-react'; 
import "./MovieCard.css";

const MovieCard = memo(({ movie, index }) => {
    const [imgError, setImgError] = useState(false); // Error handling for images

    // --- SILKY 3D TILT ---
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    
    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 25 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 25 });
    
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

    return (
        <motion.div 
            className='movie-card-wrapper'
            initial={{ opacity: 0, y: 30 }} // Better entry animation
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: (index % 4) * 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-50px" }}
        >
            <motion.div 
                className='movie-card-premium'
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                whileHover={{ y: -8 }}
            >
                {/* PREMIUM BADGE - Only for high rating */}
                {movie.vote_average > 7.5 && (
                    <div className="premium-badge" style={{ transform: "translateZ(50px)" }}>
                        <ShieldCheck size={12} />
                        <span>PREMIUM CHOICE</span>
                    </div>
                )}

                <div className="card-media-layer">
                    {!imgError ? (
                        <img 
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                            alt={movie.title} 
                            className="poster-image"
                            loading="lazy"
                            onError={() => setImgError(true)} // Handle broken links
                        />
                    ) : (
                        <div className="fallback-image">
                            <ImageOff size={40} opacity={0.2} />
                        </div>
                    )}
                    
                    <div className="cinematic-overlay-gradient" />

                    {/* Play Hover Overlay - TranslateZ logic for 3D effect */}
                    <div className="play-trigger-overlay" style={{ transform: "translateZ(70px) translate(-50%, -50%)" }}>
                        <motion.div 
                            className="glass-play-circle"
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(229, 9, 20, 0.9)" }}
                        >
                            <Play fill="white" size={24} color="white" />
                        </motion.div>
                    </div>

                    {/* Bottom Info Panel - Glassmorphism */}
                    <div className="glass-info-panel" style={{ transform: "translateZ(90px)" }}>
                        <h3 className="card-title" title={movie.title || movie.name}>
                            {movie.title || movie.name}
                        </h3>
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
});

export default MovieCard;