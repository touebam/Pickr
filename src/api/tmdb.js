// src/api/tmdb.js
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

export async function searchMovies(query) {
  try {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error("Erreur lors de l'appel à l'API TMDb");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Erreur API:", error);
    return [];
  }
}
