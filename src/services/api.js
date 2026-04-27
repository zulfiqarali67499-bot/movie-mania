const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

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