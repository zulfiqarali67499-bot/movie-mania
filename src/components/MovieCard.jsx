import React from 'react';
import { motion } from "framer-motion";
import { useMovieContext } from '../context/MovieContext';
import "./MovieCard.css";

const MovieCard = ({ movie, index }) => {
    const { isFav, removeFav, addFav } = useMovieContext();
    const favorite = isFav(movie.id);

    const onFavClick = (e) => {
        e.preventDefault();
        if (favorite) removeFav(movie.id);
        else addFav(movie);
    };

    return (
        <motion.div 
            className='movie-card'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -10 }} // Subtle lift on hover
        >
            <div className="poster-container">
                <img 
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/default-poster.jpg"} 
                    alt={movie.title} 
                    loading="lazy"
                />
                
                <div className="card-overlay"></div>

                <div className="favorite-action">
                    <button 
                        className={`fav-btn ${favorite ? "active" : ""}`} 
                        onClick={onFavClick}
                        aria-label="Toggle Favorite"
                    >
                        <motion.span
                            initial={false}
                            animate={{ scale: favorite ? [1, 1.5, 1] : 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {favorite ? "❤️" : "🤍"}
                        </motion.span>
                    </button>
                </div>

                <div className="movie-details">
                    <h3 title={movie.title}>{movie.title}</h3>
                    <div className="meta-info">
                        <span className="year">{movie.release_date?.split("-")[0]}</span>
                        <span className="rating">⭐ {movie.vote_average?.toFixed(1)}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default MovieCard;