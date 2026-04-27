import { createContext, useContext, useEffect, useState } from "react";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
    const [favorite, setFavorite] = useState(() => {
        const storeFav = localStorage.getItem("favorites");
        return storeFav ? JSON.parse(storeFav) : [];
    });

    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorite));
    }, [favorite]);

    const addFav = (movie) => {
        setFavorite((prev) => {
            if (prev.some(m => m.id === movie.id)) return prev;
            return [...prev, movie];
        });
    }

    const removeFav = (movieId) => {
        setFavorite((prev) => prev.filter((movie) => movie.id !== movieId));
    }

    const isFav = (movieId) => {
        return favorite.some(movie => movie.id === movieId);
    }

    const value = {
        favorite,
        isFav,
        addFav,
        removeFav
    };

    return (
        <MovieContext.Provider value={value}>
            {children}
        </MovieContext.Provider>
    );
}

export default MovieContext;