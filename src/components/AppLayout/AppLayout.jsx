import { useEffect, useState } from 'react';
import MovieForm from '../MovieForm/MovieForm';
import MovieList from '../MovieList/MovieList';
import { getGenres, searchMovies, getMovieDetails, getWatchProviders, getProviders } from '../../api/tmdb';
import './AppLayout.css';
import { getMovies } from '../../api/tmdb';

export default function AppLayout() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [providers, setProviders] = useState([]);
  const [movieDetailsCache, setMovieDetailsCache] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchCriteria, setSearchCriteria] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const genresData = await getGenres();
      setGenres(genresData);

      const providersData = await getProviders();
      setProviders(providersData);
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

  // Recherche lancée depuis bouton MovieForm
  async function handleSearch(moviesList, criteria) {
    setMovies(moviesList);
    setSearchCriteria(criteria);
    setCurrentPage(1);
    const movieListContainer=document.querySelector('.app-layout__right') ;
    movieListContainer.scrollTop=0 ;
  }

  // Recherche lancée depuis scroll MovieList
  async function handleEndReached() {
    if (!searchCriteria) return; 
    const nextPage = currentPage + 2;
    const newMovies = await getMovies(searchCriteria, nextPage );
    setMovies(prev => [...prev, ...newMovies]);
    setCurrentPage(nextPage);
  }

  return (
    <div className="app-layout">
        <div className="app-layout__left">
            <MovieForm 
              genres={genres} 
              providers={providers} 
              xonSearch={setMovies}
              onSearch={(moviesList, criteria) => handleSearch(moviesList, criteria)}
              />
        </div>
        <div className="app-layout__right">
            <MovieList 
              movies={movies} 
              genres={genres} 
              fetchDetailsWithCache={fetchDetailsWithCache}
              onEndReached={handleEndReached}
            />
        </div>
    </div>
  );
}
