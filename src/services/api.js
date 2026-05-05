const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// 1. Popular Movies
export const moviePopular = async () => {
    try {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        return data.results;
    } catch (err) {
        console.error("Popular Movies Error:", err);
        throw err; 
    }
}

// 2. Search Movies
export const movieSearch = async (query) => {
    try {
        const response = await fetch(
            `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
        );
        if (!response.ok) throw new Error("Search failed");
        const data = await response.json();
        return data.results;
    } catch (err) {
        console.error("Search Error:", err);
        throw err;
    }
}

// 3. Trending Movies (Jo Home page ke slider mein chahiye)
export const movieTrending = async () => {
    try {
        const response = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
        if (!response.ok) throw new Error("Trending fetch failed");
        const data = await response.json();
        return data.results;
    } catch (err) {
        console.error("Trending Error:", err);
        throw err;
    }
}

// 4. Top Rated Movies (Jo bottom grid mein chahiye)
export const movieTopRated = async () => {
    try {
        const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
        if (!response.ok) throw new Error("Top Rated fetch failed");
        const data = await response.json();
        return data.results;
    } catch (err) {
        console.error("Top Rated Error:", err);
        throw err;
    }
}