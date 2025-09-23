import './MovieCard.css';
import { useState, useEffect, useRef } from "react";
import DialogProviders from "../DialogProviders/DialogProviders";
import Rating from '@mui/material/Rating';
import EastIcon from '@mui/icons-material/East';
import { Button, IconButton, Tooltip, Skeleton } from "@mui/material"; 
import { LiveTv, Block, FavoriteBorder, Send, Search } from '@mui/icons-material';
import DialogTrailer from '../DialogTrailer/DialogTrailer';
//import { getSimilarMovies } from '../../api/tmdb';
import { useTranslation, Trans } from "react-i18next";

function MovieCard({ movie, allGenres, fetchDetailsWithCache, onSearch, countryCode }) {
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const [details, setDetails] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [openDialogProvider, setOpenDialogProvider] = useState(false);
  const [openDialogTrailer, setOpenDialogTrailer] = useState(false);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const { t } = useTranslation("common");
  const { t: tCountry } = useTranslation("countries");

  const isMobile = (window.innerWidth <= 850);
  
  if (!countryCode)
    countryCode = 'FR';
  const country = tCountry(countryCode, { returnObjects: true });
  const countryName = country.name;
  const prepCountry = country.prep;
  
  const handleOpen = (type = "provider") => {
    if (type === "provider")
    {
      const filtered = Object.entries(details.providers)
        .filter(([country, data]) =>
          data.flatrate?.length > 0 || data.ads?.length > 0
        )
        .map(([country, data]) => ({
          country: tCountry(country, { returnObjects: true }).name || country,
          countryCode: country,
          free: (data.free || []).concat(data.ads || []),
          flatrate: data.flatrate || []
        }));
      
      setFilteredProviders(filtered);
      setOpenDialogProvider(true);
    }
    else
      setOpenDialogTrailer(true);
  };

  const handleClose = () => {
    setOpenDialogProvider(false);
    setOpenDialogTrailer(false);
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
    if (!genreIds || !allGenres || !allGenres.movie?.length || !allGenres.tv?.length) return "";
    return genreIds
      .map(id => {
        return allGenres[movie.type === "movie" ? 'movie' : 'tv'].find(g => g.id === id).name || "";
      })
      .filter(name => name)
      .join(", ");
  };

  const hoverDelay = 500;
  const hoverTimer = useRef(null);
  
  const handleMouseEnter = () => {
    hoverTimer.current = setTimeout(() => {
      loadDetails();
    }, hoverDelay);
  };
  const handleMouseLeave = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };
  // Charger les détails au hover
  const loadDetails = async () => {
    if (!details) {
      const data = await fetchDetailsWithCache(movie.id);
      setDetails(data);
    }
  };

  const handleClick = (event) => {
    if (event.target.closest('.movie-card'))
    {
      loadDetails();
      setIsActive(!isActive);
    }
  };

  /*const handleSimilarClick = async (event) => {
    const movies = await getSimilarMovies(movie.id, movie.type);
    onSearch(movies, movie.id);
  }*/
  const handleTrailerClick = (event) => {
    handleOpen('trailer') ;
  };
  
  let blockedMovies = localStorage.getItem("blockedMovies");
  blockedMovies = blockedMovies ? JSON.parse(blockedMovies) : [];
  const handleBlockClick = (event) => {
    if (blockedMovies.includes(movie.id)) {
      blockedMovies = blockedMovies.filter((id) => id !== movie.id);
    } else {
      blockedMovies.push(movie.id);
    }

    localStorage.setItem("blockedMovies", JSON.stringify(blockedMovies));
  };

  const isBlocked = blockedMovies.includes(movie.id);
  return (
    <div 
      className={`movie-card ${isMobile ? "mobile" : ""} ${isActive ? "active" : ""} ${isBlocked ? "blocked" : ""}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="movie-poster">
          {movie.poster_path ? (
            <div className="images-container">
              {!loaded && (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="100%"
                  animation="wave"
                  sx={{ bgcolor: "var(--color-gray-800)", borderRadius: "var(--radius-md)" }}
                />
              )}

              <img
                src={`${imageBaseUrl}${movie.poster_path}`}
                alt={movie.title}
                className="poster-image"
                style={{ display: loaded ? "block" : "none" }}
                onLoad={() => setLoaded(true)}
              />
              <img
                src={`${imageBaseUrl}${movie.poster_path}`}
                alt={movie.title}
                className="poster-image blured"
                style={{ display: loaded ? "block" : "none" }}
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
          <div className='card-buttons'>
            <Tooltip 
              title={t("movie.buttons.trailer")}
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [0, -10],
                      },
                    },
                  ],
                },
              }}
            >
              <IconButton 
                className="card-button"
                onClick={handleTrailerClick}
              >
                <LiveTv />
              </IconButton>
            </Tooltip>
            <Tooltip 
              title={t("movie.buttons.block")}
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [0, -10],
                      },
                    },
                  ],
                },
              }}
            >
              <IconButton 
                className="card-button"
                onClick={handleBlockClick}
              >
                <Block />
              </IconButton>
            </Tooltip>
            {/*<IconButton 
              className="card-button"
              title={`${movie.type === "movie" ? "Films" : "Séries"} similaires`}
              onClick={handleSimilarClick}
            >
              <Search />
            </IconButton>
            <IconButton 
              className="card-button"
              title='Ajouter aux favoris'
            >
              <FavoriteBorder />
            </IconButton>
            <IconButton 
              className="card-button"
              title='Partager'
            >
              <Send />
            </IconButton>*/}
          </div>
      </div>
      <div className="movie-details">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-rating">
          <Rating
            value={movie.rating/2}
            precision={0.5}
            readOnly
            size="small"
          />
        </div>

        <div className="hidden">
          {movie.genre_ids.length>0 && 
          (
            <div>
              <span className="detail-title">{t("movie.titles.genres")}</span> 
              <span className="detail-content">{getGenreNames(movie.genre_ids, allGenres)}</span>
            </div>
          )}
          {(details && details.overview) ? 
            <div className='overview-container'>
              <span className="detail-title">{t("movie.titles.description")}</span> 
              <span className="detail-content">{details.overview /* description en français */}</span>
            </div>
           : 
            (movie.overview) ?
            <div className='overview-container'>
              <span className="detail-title">{t("movie.titles.description")}</span> 
              <span className="detail-content">{movie.overview /* description en anglais */}</span>
            </div>
            :
            <></>
          }
          {movie.release_date && 
          (
            <div>
              <span className="detail-title">{t("movie.titles.date")}</span> 
              <span className="detail-content">{new Date(movie.release_date).getFullYear()}</span>
            </div>
          )}
          {details?.type !== "tv" && (
            <div>
              <span className="detail-title">{t("movie.titles.duration")}</span>
              <span className="detail-content">
                {!details?.details ? (
                  <Skeleton
                    width={50}
                    height={20}
                    animation="wave"
                    sx={{ bgcolor: "var(--color-gray-700)", borderRadius: "var(--radius-md)" }}
                  />
                ) : details.details.runtime > 0 ? (
                  formatDuration(details.details.runtime)
                ) : (
                  t("movie.data.duration")
                )}
              </span>
            </div>
          )}
          <div className="providers-list">
            <span className="detail-title">{t("movie.titles.streaming")}</span>{" "}
            <div className="detail-content">
            {!details?.providers ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    width={50}
                    height={50}
                    animation="wave"
                    sx={{
                      bgcolor: "var(--color-gray-700)",
                      borderRadius: "var(--radius-md)",
                      transform: "none !important",
                      minHeight: '40px',
                      minWidth: '40px',
                    }}
                  />
                ))
            ) : (details.providers.FR && ["flatrate", "ads", "free"].some(type => details.providers.FR[type]?.length > 0)) ? (
              <>
                {["flatrate", "ads", "free"].map((type) =>
                  details.providers.FR[type]?.map((provider) => (
                    <Tooltip
                      title={provider.provider_name}
                      key={`${type}-${provider.provider_id}`}
                      slotProps={{
                        popper: {
                          modifiers: [
                            {
                              name: 'offset',
                              options: { offset: [0, -10] },
                            },
                          ],
                        },
                      }}
                    >
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(movie.title + " " + provider.provider_name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          className="provider-icon"
                          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                          alt={provider.provider_name}
                        />
                      </a>
                    </Tooltip>
                  ))
                )}
              </>
            ) : (
              <>{t("movie.data.streaming", { 
                prep: country?.prep || 'en', 
                countryName: country?.name || 'Pays inconnu' 
              })}</>
            )}
          </div>
            <div className='provider-button-container'>
              <Button
                endIcon={<EastIcon />}
                variant="contained" 
                onClick={() => handleOpen("provider")}
              >
                {t("movie.buttons.availability")}
              </Button>
            </div>

            <DialogProviders 
              movie={movie} 
              filteredProviders={filteredProviders} 
              handleClose={handleClose} 
              open={openDialogProvider} 
            />
            <DialogTrailer 
              movie={movie} 
              details={details}
              handleClose={handleClose} 
              open={openDialogTrailer} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;