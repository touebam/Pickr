import './MovieForm.css';
import { useState, useEffect } from 'react';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import GenreSelector from './GenreSelector/GenreSelector';
import CountrySelector from './CountrySelector/CountrySelector';
import ProviderSelector from './ProviderSelector/ProviderSelector';
import { Refresh, Search, Menu, Shuffle } from '@mui/icons-material';
import { Button, Tabs, Tab, TextField, Tooltip } from '@mui/material';
import { discoverMovies, searchMovies } from '../../api/tmdb';
import logo from '../../assets/logo/logo.png';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useTranslation, Trans } from "react-i18next";

const currentYear = new Date().getFullYear();

const navigatorLanguage = navigator.language;
const country = navigatorLanguage ? navigatorLanguage.substring(navigatorLanguage.indexOf('-')+1) : 'FR';

// Valeurs par défaut
const DEFAULT_VALUES = {
  selectedGenres: {movie: [], tv: []},
  selectedProviders: [],
  duration: [60, 180],
  rating: [5, 10],
  releaseYear: [1990, currentYear],
  searchQuery: '',
  selectedCountry: country
};

export default function MovieForm({ genres, providers, onSearch, activeType, setActiveType }) {
  const [selectedGenres, setSelectedGenres] = useState(DEFAULT_VALUES.selectedGenres);
  const [selectedProviders, setSelectedProviders] = useState(DEFAULT_VALUES.selectedProviders);
  const [selectedCountry, setSelectedCountry] = useState(country);
  const [duration, setDuration] = useState(DEFAULT_VALUES.duration);
  const [rating, setRating] = useState(DEFAULT_VALUES.rating);
  const [releaseYear, setReleaseYear] = useState(DEFAULT_VALUES.releaseYear);
  const [searchQuery, setSearchQuery] = useState(DEFAULT_VALUES.searchQuery);
  const [isOpen, setIsOpen] = useState(window.innerWidth > 850);
  const [activeTab, setActiveTab] = useState(0);
  const { t } = useTranslation("common");

  const handleCountryChange = (value) => {
    setSelectedCountry(value) ;
  };

  // Fonction pour changer de type
  const handleTypeChange = (event, newValue) => {
    setActiveType(newValue);
  };

  // Fonction pour changer d'onglet
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Fonction pour réinitialiser tous les champs
  const handleReset = () => {
    setSelectedGenres(DEFAULT_VALUES.selectedGenres);
    setSelectedProviders(DEFAULT_VALUES.selectedProviders);
    setDuration(DEFAULT_VALUES.duration);
    setRating(DEFAULT_VALUES.rating);
    setReleaseYear(DEFAULT_VALUES.releaseYear);
    setSearchQuery(DEFAULT_VALUES.searchQuery);
    setSelectedCountry(DEFAULT_VALUES.selectedCountry);
  };

  const handleGenreChange = (newGenres) => {
    setSelectedGenres(prev => ({
      ...prev,
      [activeType === 0 ? 'movie' : 'tv']: newGenres
    }));
  };

  async function handleDiscover() {
    const genreOperatorValue = document.querySelector('.genre-operator-dropdown').value;
    const searchCriteria = {
      genres: activeType === 0 ? selectedGenres.movie : selectedGenres.tv,
      providers: selectedProviders,
      duration,
      rating,
      releaseYear,
      genreOperator: genreOperatorValue,
      type: activeType === 0 ? "movie" : "tv",
      country: selectedCountry
    };

    const movies = await discoverMovies(searchCriteria);
    onSearch(movies, searchCriteria);
  };

  async function handleSearch() {
    const type = activeType === 0 ? "movie" : "tv";
    const movies = await searchMovies(searchQuery, type);
    onSearch(movies);
  };

  const toggleMovieForm = () => {
    const form = document.querySelector(".movie-form");
    form?.classList.toggle("open");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 850) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`movie-form ${isOpen ? "open" : ""}`}>
      <div className="form-header">
        <div className="app-logo">
          <img src={logo} alt={t("form.alt.logoPickr")}/>
          <h1>{t("form.title")}</h1>
        </div>
        <IconButton 
          className="menu-button" 
          aria-label="delete" 
          size="large"
          onClick={toggleMovieForm}
        >
          <Menu />
        </IconButton>
      </div>

      <Tabs 
        className='type-tabs'
        value={activeType} 
        onChange={handleTypeChange}
      >
        <Tab label={t("form.tabs.movie")} />
        <Tab label={t("form.tabs.series")} />
      </Tabs>
      <Tabs 
        className='form-tabs'
        value={activeTab} 
        onChange={handleTabChange}
      >
        <Tab label={t("form.tabs.discovery")} />
        <Tab label={t("form.tabs.search")} />
      </Tabs>
      
      {activeTab === 0 ? (
        <div className="form-container discover">
          <div className='form-container-header'>
            <h3>{t("form.fields.genres")}</h3>
            <select 
              className="genre-operator-dropdown" 
            >
              <option value=",">{t("form.extras.allGenres")}</option>
              <option value="|">{t("form.extras.oneGenre")}</option>
            </select>
          </div>
          <GenreSelector 
            genres={activeType === 0 ? genres.movie : genres.tv}
            selectedGenres={selectedGenres[activeType === 0 ? 'movie' : 'tv']}
            onGenreChange={handleGenreChange}
          />
          
          <div className="slider-container duree">
            <h3>{t("form.fields.duration")}</h3>
            <Slider
              value={duration}
              onChange={(event, newValue) => setDuration(newValue)}
              min={0}
              max={240}
              valueLabelDisplay="on"
            />
          </div>
          
          <div className="slider-container note">
            <h3>{t("form.fields.rating")}</h3>
            <Slider
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              min={0}
              max={10}
              valueLabelDisplay="on"
            />
          </div>
          <div className='form-container-header'>
            <h3>{t("form.fields.platforms")}</h3>
            <Tooltip 
              title={t("form.extras.disclaimer")}
              arrow
              slotProps={{
                popper: {
                  className: "tooltip-info",
                },
              }}
            >
              <IconButton className="info-button" >
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
          <ProviderSelector 
            providers={providers}
            selectedProviders={selectedProviders}
            onProviderChange={setSelectedProviders}
          />
          
          <div className="slider-container">
            <h3>{t("form.fields.releaseYear")}</h3>
            <Slider
              className='date'
              aria-label="Restricted values"
              value={releaseYear}
              onChange={(event, newValue) => setReleaseYear(newValue)}
              min={1950}
              max={currentYear}
              valueLabelDisplay="on"
            />
          </div>
          
          <div className="slider-container country">
            <h3>{t("form.fields.watchCountry")}</h3>
            <CountrySelector
              value={selectedCountry}
              onChange={handleCountryChange}
            />
          </div>
        </div>
      ) : (
        <div className="form-container search">
          <h3>{t("form.fields.search")}</h3>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={t("form.extras.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-textfield"
          />
        </div>
      )}

      <div className="form-buttons">
        <Button 
          variant="outlined" 
          startIcon={<Refresh />}
          onClick={handleReset}
        >
          {t("form.buttons.reset")}
        </Button>
        {activeTab === 0 ? (
          <Button 
            variant="contained" 
            endIcon={<Shuffle />}
            onClick={handleDiscover}
          >
            {t("form.buttons.discover")}
          </Button>
        ) : (
          <Button 
            variant="contained" 
            endIcon={<Search />}
            onClick={handleSearch}
          >
            {t("form.buttons.search")}
          </Button>
        )}
      </div>
    </div>
  );
}