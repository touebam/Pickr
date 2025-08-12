import './MovieCard.css';
import { useState } from "react";

function MovieCard({ movie, allGenres, fetchDetailsWithCache }) {
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const [details, setDetails] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  // Générer les étoiles en fonction de la note
  const generateStars = (rating) => {
    const normalizedRating = Math.round(rating / 2);
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= normalizedRating ? "star filled" : "star empty"}>
          ★
        </span>
      );
    }
    
    return stars;
  };

  // Formatter la durée
  const formatDuration = (minutes) => {
    if (!minutes) return "N/A";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h${m.toString().padStart(2, '0')}`;
  };

  // Récupérer les noms des genres
  const getGenreNames = (genreIds, allGenres) => {
    if (!genreIds || !allGenres.length) return "";
    return genreIds
      .map(id => {
        const genre = allGenres.find(g => g.id === id);
        return genre ? genre.name : "";
      })
      .filter(name => name)
      .join(", ");
  };

  // Charger les détails au hover
  const handleMouseEnter = async () => {
    setIsHovering(true);
    if (!details) {
      const data = await fetchDetailsWithCache(movie.id);
      setDetails(data);
    }
    console.log(details) ;
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div 
      className="movie-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="movie-poster">
          {movie.poster_path ? (
            <div className="images-container">
              <img
                src={`${imageBaseUrl}${movie.poster_path}`}
                alt={movie.title}
                className="poster-image"
              />
              <img
                src={`${imageBaseUrl}${movie.poster_path}`}
                alt={movie.title}
                className="poster-image blured"
              />
            </div>
          ) : (
            <div className="images-container">
              <div className="no-poster">
                <span className="movie-icon"></span>
              </div>
              <div className="no-poster blured"></div>
            </div>
          )}

      </div>
      <div className="movie-details">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-rating">
          {generateStars(movie.vote_average)}
        </div>

        <div className="hidden">
          {movie.genre_ids.length>0 && 
          (
            <div>
              <span className="detail-title">Genres :</span> 
              <span className="detail-content">{getGenreNames(movie.genre_ids, allGenres)}</span>
            </div>
          )}
          {movie.overview && 
          (
            <div>
              <span className="detail-title">Description :</span> 
              <span className="detail-content">{movie.overview}</span>
            </div>
          )}
          {movie.release_date && 
          (
            <div>
              <span className="detail-title">Date :</span> 
              <span className="detail-content">{new Date(movie.release_date).getFullYear()}</span>
            </div>
          )}
          {details && details.runtime>0 &&
          (
            <div>
              <span className="detail-title">Durée :</span> 
              <span className="detail-content">{formatDuration(details.runtime)}</span>
            </div>
          )}
          <div className="providers-list">
            <span className="detail-title">Streaming :</span>{" "}
            <span className="detail-content">{details?.providers?.AD?.flatrate ? (
              details.providers.AD.flatrate.map((provider) => (
                <img
                  className="provider-icon"
                  key={provider.provider_id}
                  src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                  alt={provider.provider_name}
                  title={provider.provider_name}
                />
              ))
            ) : (
              <>Non disponible en France</>
            )}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;