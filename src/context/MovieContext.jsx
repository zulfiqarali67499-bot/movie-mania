import { createContext, useContext, useEffect, useState } from "react";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
    // 1. Initial State: "favorites" key se hi data uthayenge (taake purana data delete na ho)
    const [watchlist, setWatchlist] = useState(() => {
        const storeFav = localStorage.getItem("favorites");
        return storeFav ? JSON.parse(storeFav) : [];
    });

    // 2. Watchlist update hote hi LocalStorage mein save karo
    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(watchlist));
    }, [watchlist]);

    // 3. Add to Watchlist
    const addFav = (movie) => {
        setWatchlist((prev) => {
            if (prev.some(m => m.id === movie.id)) return prev;
            return [movie, ...prev]; // New movie top par aaye
        });
    }

    // 4. Remove from Watchlist
    const removeFav = (movieId) => {
        setWatchlist((prev) => prev.filter((movie) => movie.id !== movieId));
    }

    // 5. Check if is Favorite
    const isFav = (movieId) => {
        return watchlist.some(movie => movie.id === movieId);
    }

    // Yahan humne "watchlist" export kiya hai taake Profile.jsx isse access kar sake
    const value = {
        watchlist, // Pehle yahan 'favorite' tha, isse 'watchlist' kar diya
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