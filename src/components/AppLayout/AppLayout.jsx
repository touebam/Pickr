import { useEffect, useState, useRef } from 'react';
import MovieForm from '../MovieForm/MovieForm';
import MovieList from '../MovieList/MovieList';
import { getTVGenres, getMovieGenres, getMovieDetails, getWatchProviders, getProviders, discoverMovies, getTrends } from '../../api/tmdb';
import './AppLayout.css';
import HeroSection from '../HeroSection/HeroSection';
import { Snackbar, Alert } from '@mui/material';

export default function AppLayout() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState({movie:[], tv:[]});
  const [trends, setTrends] = useState([]);
  const [providers, setProviders] = useState([]);
  const [movieDetailsCache, setMovieDetailsCache] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchCriteria, setSearchCriteria] = useState(null);
  const movieIds = useRef(new Set()); 
  const [openNoResultsToast, setOpenNoResultsToast] = useState(false);
  const [openEndOfListToast, setOpenEndOfListToast] = useState(false);
  const [scrollEnd, setScrollEnd] = useState(false);
  const [activeType, setActiveType] = useState(0);

  // Fermer le toast
  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenNoResultsToast(false);
    setOpenEndOfListToast(false);
  };

  useEffect(() => {
    async function fetchData() {
      const movieGenresData = await getMovieGenres();
      const tvGenresData = await getTVGenres();
      setGenres({movie:movieGenresData, tv:tvGenresData});

      const providersData = await getProviders();
      setProviders(providersData);

      const trendsData = await getTrends();
      setTrends(trendsData);
    }
    fetchData();
  }, []);

  // Récupérer les détails du film avec cache
  async function fetchDetailsWithCache(movieId) {
    if (movieDetailsCache[movieId]) {
      return movieDetailsCache[movieId];
    }
    const type = activeType === 0 ? 'movie' : 'tv';
    const details = await getMovieDetails(movieId, type);
    const providers = await getWatchProviders(movieId, type);

    const fullDetails = { ...details, providers };
    setMovieDetailsCache(prev => ({ ...prev, [movieId]: fullDetails }));
    return fullDetails;
  }

  // Recherche initiale lancée depuis MovieForm
  async function handleSearch(moviesList, criteria) {
    if (moviesList.length == 0)
      setOpenNoResultsToast(true);
    movieIds.current.clear();
    const uniqueMovies = moviesList.filter(movie => {
      if (movieIds.current.has(movie.id)) return false;
      movieIds.current.add(movie.id);
      return true;
    });

    setMovies(uniqueMovies);
    setSearchCriteria(criteria);
    setCurrentPage(1);
    setScrollEnd(false);

    const movieListContainer = document.querySelector('.app-layout__right');
    movieListContainer.scrollTop = 0;
    
    if (window.innerWidth < 850) {
      const form = document.querySelector('.movie-form');
      if (form) {
        form.classList.remove('open');
      }
    }
  }

  // Recherche lancée depuis scroll MovieList
  async function handleEndReached() {
    if (!scrollEnd) {
      const discoveryContainer = document.querySelector('.app-layout__left .discover');
      if (!searchCriteria || !discoveryContainer) return; 
      
      const nextPage = currentPage + 1;
      const newMovies = await discoverMovies(searchCriteria, nextPage);

      const uniqueNewMovies = newMovies.filter(movie => {
        if (movieIds.current.has(movie.id)) return false;
        movieIds.current.add(movie.id);
        return true;
      });
      
      setMovies(prev => [...prev, ...uniqueNewMovies]);
      setCurrentPage(nextPage);
      if (newMovies.length == 0) {
        setScrollEnd(true) ;
        setOpenEndOfListToast(true);
      }
    }
  }

  return (
    <div className="app-layout">
        <div className="app-layout__left">
            <MovieForm 
              genres={genres} 
              providers={providers}
              onSearch={(moviesList, criteria) => handleSearch(moviesList, criteria)}
              activeType={activeType}
              setActiveType={setActiveType}
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
            <HeroSection trends={trends} />
          }
        </div>
        <Snackbar
          open={openNoResultsToast}
          autoHideDuration={5000}
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseToast} 
            severity="info" 
            sx={{ width: '100%' }}
          >
            Pas de résultats pour cette recherche
          </Alert>
        </Snackbar>
        <Snackbar
          open={openEndOfListToast}
          autoHideDuration={5000}
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseToast} 
            severity="info" 
            sx={{ width: '100%' }}
          >
            Vous avez atteint la fin de la liste
          </Alert>
        </Snackbar>
    </div>
  );
}
