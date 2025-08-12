import { useEffect, useState } from "react";
import { searchMovies, getGenres, getMovieDetails, getWatchProviders } from "./api/tmdb";
import MovieCard from "./components/MovieCard/MovieCard";
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [movieDetailsCache, setMovieDetailsCache] = useState({});

  useEffect(() => {
    async function fetchData() {
      const genresData = await getGenres();
      setGenres(genresData);

      const results = await searchMovies("human centipede");
      setMovies(results);
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
    <div>
      <h1>Test affichage films</h1>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        width: "100%"
      }}>
        {movies.map((movie) => (
          <MovieCard 
            key={movie.id} 
            movie={movie} 
            allGenres={genres}
            fetchDetailsWithCache={fetchDetailsWithCache}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
