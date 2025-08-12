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

export async function getGenres() {
  try {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=fr-FR`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des genres");
    }
    const data = await response.json();
    return data.genres; 
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getProviders() {
  const wantedProviders = [
    "Apple TV",
    "Netflix",
    "Amazon Prime Video",
    "YouTube",
    "Crunchyroll",
    "Disney plus",
    "Canal+",
    "Molotov TV"
  ];

  try {
    const response = await fetch(`${BASE_URL}/watch/providers/movie?api_key=${API_KEY}&language=fr-FR`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des plateformes de streaming");
    }
    const data = await response.json();

    const matchedProviders = data.results.filter(provider =>
      wantedProviders.some(wp => provider.provider_name.toLowerCase().includes(wp.toLowerCase()))
    );
    const uniqueProviders = filterClosestProviders(matchedProviders, wantedProviders);
    
    return uniqueProviders;
  } catch (error) {
    console.error(error);
    return [];
  }
}

function filterClosestProviders(providers, wantedProviders) {
  const map = new Map();

  providers.forEach(provider => {
    const match = wantedProviders.find(wp => provider.provider_name.toLowerCase().includes(wp.toLowerCase()));

    if (match) {
      if (!map.has(match) || provider.provider_name.length < map.get(match).provider_name.length) {
        map.set(match, provider);
      }
    }
  });

  return Array.from(map.values());
}

export async function getMovieDetails(movieId) {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=fr-FR`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des détails du film");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getWatchProviders(movieId) {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}/watch/providers?api_key=${API_KEY}`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des plateformes");
    }
    const data = await response.json();
    return data.results || {};
  } catch (error) {
    console.error(error);
    return {};
  }
}