import * as Utils from "../utils/utils.js";
import { transformTMDBData } from '../utils/dataTransform';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

export async function getMovieGenres() {
  try {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=fr-FR`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des genres (movie)");
    }
    const data = await response.json();
    return data.genres; 
  } catch (error) {
    console.error(error);
    return [];
  }
}
export async function getTVGenres() {
  try {
    const response = await fetch(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=fr-FR`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des genres (tv)");
    }
    const data = await response.json();
    return data.genres; 
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getTrends() {
  try {
    const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=fr-FR`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des tendances");
    }
    const data = await response.json();
    const transformedResults = transformTMDBData(data.results);
    return transformedResults; 
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function discoverMovies(searchCriteria, page = 1) {
  try {
    // Fonction pour mélanger un tableau
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };
    // Génération des paramètres 
    const baseParams = new URLSearchParams({
      api_key: API_KEY,
      language: "fr-FR",
      watch_region: "FR",
      "vote_average.gte": searchCriteria.rating[0],
      "vote_average.lte": searchCriteria.rating[1],
      sort_by: "popularity.desc",
      page: page,
    });
    if (searchCriteria.type === "movie") {
      baseParams.append("primary_release_date.gte", `${searchCriteria.releaseYear[0]}-01-01`);
      baseParams.append("primary_release_date.lte", `${searchCriteria.releaseYear[1]}-12-31`);
      baseParams.append("with_runtime.gte", searchCriteria.duration[0]);
      baseParams.append("with_runtime.lte", searchCriteria.duration[1]);
    } else if (searchCriteria.type === "tv") {
      baseParams.append("first_air_date.gte", `${searchCriteria.releaseYear[0]}-01-01`);
      baseParams.append("first_air_date.lte", `${searchCriteria.releaseYear[1]}-12-31`);
    }
    
    if (searchCriteria.genres.length > 0) {
      baseParams.append("with_genres", searchCriteria.genres.join(searchCriteria.genreOperator));
    }
    if (searchCriteria.providers.length > 0) {
      baseParams.append("with_watch_providers", searchCriteria.providers.join("|"));
    }

    const res = await fetch(`${BASE_URL}/discover/${searchCriteria.type}?${baseParams}`);
    if (!res.ok) throw new Error(`Erreur API : ${res.status}`);
    const data = await res.json();
    
    const transformedResults = transformTMDBData(data.results, searchCriteria.type);
    const shuffledResults = shuffleArray(transformedResults);
    return shuffledResults;

  } catch (error) {
    console.error("Erreur lors de la recherche:", error);
    return [];
  }
}

export async function searchMovies(searchQuery, type = "movie") {
  try {
    // Retirer les films trop méconnus 
    function filterMovies(movies) {
      return movies.filter(m =>
        m.vote_count >= 10
      );
    }

    const params = new URLSearchParams({
      api_key: API_KEY,
      language: 'fr-FR',
      query: searchQuery
    });

    // Recherche par titre
    const movieRes = await fetch(`${BASE_URL}/search/${type}?${params}`);
    if (!movieRes.ok) throw new Error(`Erreur API (movie search) : ${movieRes.status}`);
    const movieData = await movieRes.json();
    const filteredMovieData = filterMovies(movieData.results);

    // Recherche des acteurs/réalisateurs
    const personRes = await fetch(`${BASE_URL}/search/person?${params}`);
    if (!personRes.ok) throw new Error(`Erreur API (person search) : ${personRes.status}`);
    const personData = await personRes.json();

    let personMovies = [];
    if (personData.results?.length > 0) {
      const peopleParams = new URLSearchParams({
        api_key: API_KEY,
        language: 'fr-FR',
        with_people: personData.results.map(p => p.id).join('|'),
        'vote_count.gte': 10,
      });

      const peopleMoviesRes = await fetch(`${BASE_URL}/discover/${type}?${peopleParams}`);
      if (peopleMoviesRes.ok) {
        const peopleMoviesData = await peopleMoviesRes.json();
        personMovies = filterMovies(peopleMoviesData.results);
      }
    }

    // Tri des films par similarité titre/recherche 
    const scoredMovieData = filteredMovieData.map(movie => {
      const similarity = Utils.textSimilarity(movie.title, searchQuery);
      return { movie, score: similarity };
    });
    const sortedByTitle = scoredMovieData
      .sort((a, b) => b.score - a.score)
      .map(x => x.movie);

    // Fusion sans doublons
    const uniquePersonMovies = personMovies.filter(
      m => !sortedByTitle.some(sm => sm.id === m.id)
    );

    const finalMovies = [...sortedByTitle, ...uniquePersonMovies];
    const transformedResults = transformTMDBData(finalMovies, type);
    return transformedResults;

  } catch (error) {
    console.error("Erreur lors de la recherche:", error);
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
    const uniqueProviders = Utils.filterClosestProviders(matchedProviders, wantedProviders);
    
    return uniqueProviders;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getMovieDetails(movieId, type = "movie") {
  try {
    const response = await fetch(`${BASE_URL}/${type}/${movieId}?api_key=${API_KEY}&language=fr-FR`);
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

export async function getWatchProviders(movieId, type = "movie") {
  try {
    const response = await fetch(`${BASE_URL}/${type}/${movieId}/watch/providers?api_key=${API_KEY}`);
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

export async function getMovieTrailer(movieId, type = "movie") {
  try {
    const response = await fetch(`${BASE_URL}/${type}/${movieId}/videos?api_key=${API_KEY}&language=fr-FR`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des vidéos");
    }
    const data = await response.json();
    console.log(data.results.filter(video => 
      video.type === 'Trailer' && 
      video.site === 'YouTube'
    ))
    return data.results.filter(video => 
      video.type === 'Trailer' && 
      video.site === 'YouTube'
    );
  } catch (error) {
    console.error(error);
    return {};
  }
};