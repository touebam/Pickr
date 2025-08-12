import './MovieList.css';
import MovieCard from "./MovieCard/MovieCard";
import { useEffect, useRef } from "react";

function MovieList({ movies, genres, fetchDetailsWithCache, onEndReached }) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const movieListContainer=document.querySelector('.app-layout__right') ;
      if (entries[0].isIntersecting && movieListContainer.scrollTop > 0) {
        onEndReached && onEndReached(); 
      }
    });

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [onEndReached]);

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
      <div ref={sentinelRef} style={{ height: "1px" }}></div>
    </div>
  );
};

export default MovieList;

