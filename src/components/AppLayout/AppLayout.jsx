import { useEffect, useState } from 'react';
import MovieForm from '../MovieForm/MovieForm';
import MovieList from '../MovieList/MovieList';
import { getGenres, searchMovies, getMovieDetails, getWatchProviders, getProviders } from '../../api/tmdb';
import './AppLayout.css';

export default function AppLayout() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [providers, setProviders] = useState([]);
  const [movieDetailsCache, setMovieDetailsCache] = useState({});

  useEffect(() => {
    async function fetchData() {
      const genresData = await getGenres();
      setGenres(genresData);
/*
      const results = await searchMovies("mission impossible");
      setMovies(results);*/

      const providersData = await getProviders();
      setProviders(providersData);
      console.log(providersData);
    }
    fetchData();
  }, []);

  // Récupérer les détails du film avec cache
  async function fetchDetailsWithCache(movieId) {
    if (movieDetailsCache[movieId]) {
      return movieDetailsCache[movieId];
    }
    const details = await getMovieDetails(movieId);
    const providers = await getWatchProviders(movieId);

    const fullDetails = { ...details, providers };
    
    setMovieDetailsCache(prev => ({ ...prev, [movieId]: fullDetails }));

    return fullDetails;
  }

  return (
    <div className="app-layout">
        <div className="app-layout__left">
            <MovieForm genres={genres} providers={providers} onSearch={setMovies}/>
        </div>
        <div className="app-layout__right">
            <MovieList movies={movies} genres={genres} fetchDetailsWithCache={fetchDetailsWithCache} />
        </div>
    </div>
  );
}
