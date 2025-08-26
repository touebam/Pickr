import './MovieCard.css';
import { useState, useEffect } from "react";
import DialogProviders from "../DialogProviders/DialogProviders";
import Rating from '@mui/material/Rating';
import EastIcon from '@mui/icons-material/East';
import { countryNames } from './countryNames';
import { Button } from "@mui/material"; 

function MovieCard({ movie, allGenres, fetchDetailsWithCache }) {
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const [details, setDetails] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [open, setOpenDialog] = useState(false);
  const [filteredProviders, setFilteredProviders] = useState([]);

  const isMobile = window.matchMedia("(hover: none)").matches;

  const handleOpen = () => {
    const filtered = Object.entries(details.providers)
      .filter(([country, data]) =>
        data.flatrate?.length > 0 || data.ads?.length > 0
      )
      .map(([country, data]) => ({
        country: countryNames[country] || country,
        countryCode: country,
        free: (data.free || []).concat(data.ads || []),
        flatrate: data.flatrate || []
      }));

    setFilteredProviders(filtered);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
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
    if (!genreIds || !allGenres?.length) return "";
    return genreIds
      .map(id => {
        const genre = allGenres.find(g => g.id === id);
        return genre ? genre.name : "";
      })
      .filter(name => name)
      .join(", ");
  };

  const handleMouseEnter = () => {
    loadDetails();
  };

  // Charger les détails au hover
  const loadDetails = async () => {
    if (!details) {
      const data = await fetchDetailsWithCache(movie.id);
      console.log(data)
      setDetails(data);
    }
  } 

  const handleClick = () => {
    loadDetails();
    setIsActive(!isActive);
  };

  return (
    <div 
      className={`movie-card ${isMobile ? "mobile" : ""} ${isActive ? "active" : ""}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
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
          <Rating
            value={movie.vote_average/2}
            precision={0.5}
            readOnly
            size="small"
            sx={{
              '& .MuiRating-iconEmpty': {
                color: '#757575ff',
              },
              '& .MuiRating-iconFilled': {
                color: '#ffc107',
              }
            }}
          />
        </div>

        <div className="hidden">
          {movie.genre_ids.length>0 && 
          (
            <div>
              <span className="detail-title">Genres :</span> 
              <span className="detail-content">{getGenreNames(movie.genre_ids, allGenres)}</span>
            </div>
          )}
          {(details && details.overview) ? 
            <div className='overview-container'>
              <span className="detail-title">Description :</span> 
              <span className="detail-content">{details.overview /* description en français */}</span>
            </div>
           : 
            (movie.overview) ?
            <div className='overview-container'>
              <span className="detail-title">Description :</span> 
              <span className="detail-content">{movie.overview /* description en anglais */}</span>
            </div>
            :
            <></>
          }
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
            <span className="detail-content">{details?.providers?.FR?.flatrate ? (
              details.providers.FR.flatrate.map((provider) => (
                <a
                  key={provider.provider_id}
                  href={`https://www.google.com/search?q=${encodeURIComponent(movie.title + " " + provider.provider_name)}`}
                  target='_blank'
                >
                  <img
                    className="provider-icon"
                    src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                    alt={provider.provider_name}
                    title={provider.provider_name}
                  />
                </a>
              ))
            ) : (
              <>Non disponible en France</>
            )}</span>
            <div className='provider-button-container'>
              <Button
                endIcon={<EastIcon />}
                variant="contained" 
                onClick={handleOpen}
              >
                Autres disponibilités
              </Button>
            </div>

            <DialogProviders 
              movie={movie} 
              filteredProviders={filteredProviders} 
              handleClose={handleClose} 
              open={open} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;