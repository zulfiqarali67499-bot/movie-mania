const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Helper for Fetch
const fetchData = async (endpoint) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}`);
        if (!response.ok) throw new Error("API Fetch Failed");
        const data = await response.json();
        return data.results || data;
    } catch (err) {
        console.error("API Error:", err);
        return null;
    }
};

export const moviePopular = () => fetchData("/movie/popular");
export const movieTrending = () => fetchData("/trending/movie/day");
export const movieTopRated = () => fetchData("/movie/top_rated");
export const movieUpcoming = () => fetchData("/movie/upcoming");
export const movieNowPlaying = () => fetchData("/movie/now_playing");
export const movieSearch = (query) => fetchData(`/search/movie?query=${encodeURIComponent(query)}`);

export const getMovieDetails = async (id) => {
    const data = await fetchData(`/movie/${id}?append_to_response=credits,videos,similar`);
    return data ? {
        details: data,
        cast: data.credits?.cast || [],
        trailers: data.videos?.results || [],
        similar: data.similar?.results || []
    } : null;
};