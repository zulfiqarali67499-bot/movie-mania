import React, { memo, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Star, Play, Calendar, ShieldCheck, ImageOff } from 'lucide-react'; 
import "./MovieCard.css";

const MovieCard = memo(({ movie, index }) => {
    const [imgError, setImgError] = useState(false);

    // --- 3D TILT PHYSICS ---
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    
    // Stiffness aur Damping se makhhan jaisa smooth feel aata hai
    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
    
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

    return (
        <motion.div 
            className='movie-card-wrapper'
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: (index % 4) * 0.1, ease: [0.19, 1, 0.22, 1] }}
            viewport={{ once: true, margin: "-20px" }}
        >
            <motion.div 
                className='movie-card-premium'
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                whileHover={{ y: -10 }}
            >
                {/* PRESTIGE BADGE */}
                {movie.vote_average > 7.5 && (
                    <div className="premium-badge" style={{ transform: "translateZ(40px)" }}>
                        <ShieldCheck size={14} />
                        <span>PREMIUM</span>
                    </div>
                )}

                <div className="card-media-layer">
                    {!imgError ? (
                        <img 
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                            alt={movie.title} 
                            className="poster-image"
                            loading="lazy"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="fallback-image">
                            <ImageOff size={40} color="gray" />
                        </div>
                    )}
                    
                    <div className="cinematic-overlay-gradient" />

                    {/* 3D Play Button Overlay */}
                    <div className="play-trigger-overlay" style={{ transform: "translateZ(60px) translate(-50%, -50%)" }}>
                        <motion.div 
                            className="glass-play-circle"
                            whileHover={{ scale: 1.15, backgroundColor: "rgba(229, 9, 20, 0.9)" }}
                        >
                            <Play fill="white" size={22} color="white" />
                        </motion.div>
                    </div>

                    {/* Info Panel with Depth */}
                    <div className="glass-info-panel" style={{ transform: "translateZ(80px)" }}>
                        <h3 className="card-title">{movie.title || movie.name}</h3>
                        <div className="card-meta-row">
                            <div className="meta-tag">
                                <Calendar size={12} />
                                <span>{(movie.release_date || movie.first_air_date)?.split("-")[0] || "N/A"}</span>
                            </div>
                            <div className="meta-tag rating-tag">
                                <Star size={12} fill="#fbbf24" color="#fbbf24" />
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