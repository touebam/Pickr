import './CardFavorite.css';
import { useTranslation, Trans } from "react-i18next";
import { IconButton, Tooltip } from "@mui/material"; 
import { Favorite } from '@mui/icons-material';

function CardFavorite({ movie, countryCode, onToggleFavorite }) {
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const { t } = useTranslation("common");
  const { t: tCountry } = useTranslation("countries");

  if (!countryCode)
    countryCode = 'FR';
  const country = tCountry(countryCode, { returnObjects: true });

  const formatDuration = (minutes) => {
    if (!minutes) return "N/A";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h${m.toString().padStart(2, '0')}`;
  };

  return (
  <div className='favorite-card'>
    <Tooltip 
      title={t("movie.buttons.remove")}
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
        onClick={() => onToggleFavorite(movie)}
      >
        <Favorite />
      </IconButton>
    </Tooltip>
    <div className='left-container'>
      <img
        src={`${imageBaseUrl}${movie.poster_path}`}
        alt={movie.title}
        className="favorite-image"
      />
    </div>
    <div className='right-container'>
      <div className='favorite-header'>
        <div className='top-header'>
          <div className='favorite-title'>{movie.title}</div>
          <div className='favorite-runtime'>{movie.runtime ? formatDuration(movie.runtime) : ''}</div>
        </div>
        <div className='bottom-header'>
          {movie.genres}
        </div>
      </div>
      <div className='providers-list'>
        {movie.providers ? ["flatrate", "ads", "free"].map((type) =>
          movie.providers[type]?.map((provider) => (
            <Tooltip
              title={provider.provider_name}
              key={`${type}-${provider.provider_id}`}
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: 'offset',
                      options: { offset: [0, -15] },
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
        ) 
        : 
        <span>
          {t("movie.data.streaming", { 
            prep: country?.prep || 'en', 
            countryName: country?.name || 'Pays inconnu' 
          })}
        </span>
        }
      </div>
    </div>
  </div>
  );
}

export default CardFavorite;