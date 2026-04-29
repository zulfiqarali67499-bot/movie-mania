import React from 'react';
import { motion } from "framer-motion";
import { useMovieContext } from '../context/MovieContext';
import "./MovieCard.css";

const MovieCard = ({ movie, index }) => {
    const { isFav, removeFav, addFav } = useMovieContext();
    const favorite = isFav(movie.id);

    const onFavClick = (e) => {
        e.preventDefault();
        e.stopPropagation(); // Card click event ko rokne ke liye
        if (favorite) removeFav(movie.id);
        else addFav(movie);
    };

    // Poster path check aur fallback
    const posterUrl = movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
        : "https://via.placeholder.com/500x750?text=No+Poster+Found";

    return (
        <motion.div 
            className='movie-card'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: (index % 10) * 0.05 }} // Lag-free delay
        >
            <div className="poster-container">
                <img 
                    src={posterUrl} 
                    alt={movie.title} 
                    loading="lazy"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/500x750?text=Image+Error"; }}
                />
                
                <div className="card-overlay"></div>

                <div className="favorite-action">
                    <button 
                        className={`fav-btn ${favorite ? "active" : ""}`} 
                        onClick={onFavClick}
                        aria-label="Toggle Favorite"
                    >
                        <motion.span
                            animate={{ scale: favorite ? [1, 1.4, 1] : 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {favorite ? "❤️" : "🤍"}
                        </motion.span>
                    </button>
                </div>

                <div className="movie-details">
                    <h3 title={movie.title}>{movie.title}</h3>
                    <div className="meta-info">
                        <span className="year">{movie.release_date?.split("-")[0] || "N/A"}</span>
                        <span className="rating">⭐ {movie.vote_average?.toFixed(1) || "0.0"}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default MovieCard;