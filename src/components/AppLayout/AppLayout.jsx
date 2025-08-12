import { useEffect, useState, useRef } from 'react';
import MovieForm from '../MovieForm/MovieForm';
import MovieList from '../MovieList/MovieList';
import { getGenres, searchMovies, getMovieDetails, getWatchProviders, getProviders, getMovies } from '../../api/tmdb';
import './AppLayout.css';

export default function AppLayout() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [providers, setProviders] = useState([]);
  const [movieDetailsCache, setMovieDetailsCache] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchCriteria, setSearchCriteria] = useState(null);
  const movieIds = useRef(new Set()); 

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

  // Recherche initiale lancée depuis MovieForm
  async function handleSearch(moviesList, criteria) {
    movieIds.current.clear();
    const uniqueMovies = moviesList.filter(movie => {
      if (movieIds.current.has(movie.id)) return false;
      movieIds.current.add(movie.id);
      return true;
    });

    setMovies(uniqueMovies);
    setSearchCriteria(criteria);
    setCurrentPage(1);

    const movieListContainer=document.querySelector('.app-layout__right') ;
    movieListContainer.scrollTop=0 ;
  }

  // Recherche lancée depuis scroll MovieList
  async function handleEndReached() {
    if (!searchCriteria) return; 
    const nextPage = currentPage + 1;
    const newMovies = await getMovies(searchCriteria, nextPage );

    const uniqueNewMovies = newMovies.filter(movie => {
      if (movieIds.current.has(movie.id)) return false;
      movieIds.current.add(movie.id);
      return true;
    });

    setMovies(prev => [...prev, ...uniqueNewMovies]);
    setCurrentPage(nextPage);
  }

  return (
    <div className="app-layout">
        <div className="app-layout__left">
            <MovieForm 
              genres={genres} 
              providers={providers}
              onSearch={(moviesList, criteria) => handleSearch(moviesList, criteria)}
              />
        </div>
        <div className="app-layout__right">
            {movies?.length>0 ? 
            <MovieList 
              movies={movies} 
              genres={genres} 
              fetchDetailsWithCache={fetchDetailsWithCache}
              onEndReached={handleEndReached}
            />
            :
            <div>Accueil</div>
            }
            
        </div>
    </div>
  );
}
