import './MovieList.css';
import MovieCard from "../MovieCard/MovieCard";

function MovieList({ movies, genres, fetchDetailsWithCache }) {
  return (
    <div className="movie-list">
        {movies.map((movie) => (
            <MovieCard 
                key={movie.id} 
                movie={movie} 
                allGenres={genres}
                fetchDetailsWithCache={fetchDetailsWithCache}
            />
        ))}
    </div>
  );
};

export default MovieList;
