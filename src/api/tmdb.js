import * as Utils from "../utils/utils.js";
import { transformTMDBData } from '../utils/dataTransform';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const MAX_CACHE_AGE = 4 * 24 * 60 * 60 * 1000;

export async function getTrends() {
  try {
    const cachedTrends = localStorage.getItem("trendsData");
    const lastUpdate = parseInt(localStorage.getItem("trendsLastUpdate"), 10);
    
    const now = new Date().getTime();

    if (cachedTrends && lastUpdate && now - lastUpdate < MAX_CACHE_AGE) {
      return JSON.parse(cachedTrends);
    } else {
      console.count('appel')
      const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=fr-FR`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des tendances");
      }
      const data = await response.json();
      const transformedResults = transformTMDBData(data.results);
      
      localStorage.setItem("trendsData", JSON.stringify(transformedResults));
      localStorage.setItem("trendsLastUpdate", now.toString());

      return transformedResults; 
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

function getDiscoverKey({ genres, duration, rating, providers, releaseYear, type }, page) {
  const genresKey = genres.sort().join("-");
  const durationKey = `${duration[0]}-${duration[1]}`;
  const ratingKey = `${rating[0]}-${rating[1]}`;
  const providersKey = providers.sort().join("-");
  const yearKey = `${releaseYear[0]}-${releaseYear[1]}`;

  return `discover_${genresKey}_${type == "movie" ? durationKey : ''}_${ratingKey}_${providersKey}_${yearKey}_${page}`;
}

export async function discoverMovies(searchCriteria, page = 1) {
  try {
    const key = getDiscoverKey(searchCriteria, page);
    const cachedRaw = localStorage.getItem(key);

    const now = new Date().getTime();
    
    if (cachedRaw) {
      const cachedObj = JSON.parse(cachedRaw);

      if (cachedObj.lastUpdate && now - cachedObj.lastUpdate < MAX_CACHE_AGE) {
        return Utils.shuffleArray(cachedObj.results);
      }
    }

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

    console.count('appel')
    const res = await fetch(`${BASE_URL}/discover/${searchCriteria.type}?${baseParams}`);
    if (!res.ok) throw new Error(`Erreur API : ${res.status}`);
    const data = await res.json();
    
    const transformedResults = transformTMDBData(data.results, searchCriteria.type);

    localStorage.setItem(key, JSON.stringify({
      results: transformedResults,
      lastUpdate: now.toString()
    }));

    return Utils.shuffleArray(transformedResults);
  
  } catch (error) {
    console.error("Erreur lors de la recherche:", error);
    return [];
  }
}

export function cleanOldCache() {
  const now = Date.now();

  Object.keys(localStorage).forEach(key => {
    if (key.startsWith("movie") || key.startsWith("tv_") || key.startsWith("discover_") || key.startsWith("search_")) {
      try {
        const cachedObj = JSON.parse(localStorage.getItem(key));

        if (cachedObj?.lastUpdate && now - cachedObj.lastUpdate > MAX_CACHE_AGE) {
          localStorage.removeItem(key);
          console.log(`Cache supprimé : ${key}`);
        }
      } catch (e) {
        localStorage.removeItem(key);
        console.warn(`Cache invalide supprimé : ${key}`);
      }
    }
  });
}
/*
export async function getSimilarMovies(movieId, type = "movie") {
  try {
    console.count('appel')
    const response = await fetch(
      `${BASE_URL}/${type}/${movieId}/similar?api_key=${API_KEY}&language=fr-FR`
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des films similaires");
    }

    const data = await response.json();
    const transformedResults = transformTMDBData(data.results, type);
    return transformedResults; 
  } catch (error) {
    console.error(error);
    return [];
  }
}*/

export async function searchMovies(searchQuery, type = "movie") {
  try {
    const key = `${type}_${searchQuery.toLowerCase()}`;
    const cachedRaw = localStorage.getItem(key);
    
    const now = new Date().getTime();
    
    if (cachedRaw) {
      const cachedObj = JSON.parse(cachedRaw);

      if (cachedObj.lastUpdate && now - cachedObj.lastUpdate < MAX_CACHE_AGE) {
        return cachedObj.results;
      }
    }

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

    console.count('appel')
    // Recherche par titre
    const movieRes = await fetch(`${BASE_URL}/search/${type}?${params}`);
    if (!movieRes.ok) throw new Error(`Erreur API (movie search) : ${movieRes.status}`);
    const movieData = await movieRes.json();
    const filteredMovieData = filterMovies(movieData.results);

    console.count('appel')
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

    console.count('appel')
      const peopleMoviesRes = await fetch(`${BASE_URL}/discover/${type}?${peopleParams}`);
      if (peopleMoviesRes.ok) {
        const peopleMoviesData = await peopleMoviesRes.json();
        personMovies = filterMovies(peopleMoviesData.results);
      }
    }

    // Tri des films par similarité titre/recherche 
    const scoredMovieData = filteredMovieData.map(movie => {
      const similarity = Utils.textSimilarity(type === "movie" ? movie.title : movie.name, searchQuery);
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
    localStorage.setItem(key, JSON.stringify(transformedResults));
    return transformedResults;

  } catch (error) {
    console.error("Erreur lors de la recherche:", error);
    return [];
  }
}

export async function getMovieDatas(movieId, type = "movie") {
  const storageKey = `${type}_${movieId}`;
  const cachedData = localStorage.getItem(storageKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  try {
    console.count("appel");
    // Détails
    const detailsResp = await fetch(`${BASE_URL}/${type}/${movieId}?api_key=${API_KEY}&language=fr-FR`);
    const detailsData = detailsResp.ok ? await detailsResp.json() : {};
    const details = {
      runtime: detailsData.runtime,
      overview: detailsData.overview
    };


    console.count("appel");
    // Plateformes
    const providersResp = await fetch(`${BASE_URL}/${type}/${movieId}/watch/providers?api_key=${API_KEY}`);
    const providersRaw = providersResp.ok ? (await providersResp.json()).results || {} : {};
    const providers = {};

    Object.entries(providersRaw).forEach(([countryCode, countryData]) => {
      const { flatrate, free } = countryData;
      if ((flatrate && flatrate.length) || (free && free.length)) {
        providers[countryCode] = {};
        if (flatrate && flatrate.length) providers[countryCode].flatrate = flatrate;
        if (free && free.length) providers[countryCode].free = free;
      }
    });

    console.count("appel");
    // Trailers
    const trailerResp = await fetch(`${BASE_URL}/${type}/${movieId}/videos?api_key=${API_KEY}&language=fr-FR`);
    const trailerRaw = trailerResp.ok ? (await trailerResp.json()).results : [];
    const trailers = trailerRaw
      .filter(video => video.type === "Trailer" && video.site === "YouTube")
      .map(video => ({
        id: video.id,
        key: video.key,
        name: video.name,
        published_at: video.published_at
      }));

    const combinedData = { details, providers, trailers };
    localStorage.setItem(storageKey, JSON.stringify(combinedData));
    return combinedData;
  } catch (error) {
    console.error(error);
    return {
      details: {},
      providers: {},
      trailers: []
    };
  }
}