import './MovieForm.css';
import { useState, useEffect } from 'react';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import GenreSelector from './GenreSelector/GenreSelector';
import ProviderSelector from './ProviderSelector/ProviderSelector';
import { Refresh, Search, Menu, Shuffle } from '@mui/icons-material';
import { Button, Tabs, Tab, TextField } from '@mui/material';
import { discoverMovies, searchMovies } from '../../api/tmdb';
import logo from '../../assets/logo/logo.png';

const currentYear = new Date().getFullYear();

// Valeurs par défaut
const DEFAULT_VALUES = {
  selectedGenres: {movie: [], tv: []},
  selectedProviders: [],
  duration: [60, 180],
  rating: [7, 10],
  releaseYear: [2000, currentYear],
  searchQuery: ''
};

export default function MovieForm({ genres, providers, onSearch, activeType, setActiveType }) {
  const [selectedGenres, setSelectedGenres] = useState(DEFAULT_VALUES.selectedGenres);
  const [selectedProviders, setSelectedProviders] = useState(DEFAULT_VALUES.selectedProviders);
  const [duration, setDuration] = useState(DEFAULT_VALUES.duration);
  const [rating, setRating] = useState(DEFAULT_VALUES.rating);
  const [releaseYear, setReleaseYear] = useState(DEFAULT_VALUES.releaseYear);
  const [searchQuery, setSearchQuery] = useState(DEFAULT_VALUES.searchQuery);
  const [isOpen, setIsOpen] = useState(window.innerWidth > 850);
  const [activeTab, setActiveTab] = useState(0);

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
      type: activeType === 0 ? "movie" : "tv"
    };

    const movies = await discoverMovies(searchCriteria);
    onSearch(movies, searchCriteria);
  };

  async function handleSearchx() {
    const movies = await searchMovies(searchQuery);
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
          <img src={logo} alt="Logo Pickr"/>
          <h1>Pickr</h1>
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
        <Tab label="Films" />
        <Tab label="Séries" />
      </Tabs>
      <Tabs 
        className='form-tabs'
        value={activeTab} 
        onChange={handleTabChange}
      >
        <Tab label="Découverte" />
        <Tab label="Recherche" />
      </Tabs>
      
      {activeTab === 0 ? (
        <div className="form-container discover">
          <div className='form-container-header'>
            <h3>Genres :</h3>
            <select 
              className="genre-operator-dropdown" 
            >
              <option value=",">Tous les genres sélectionnés</option>
              <option value="|">Au moins un genre sélectionné</option>
            </select>
          </div>
          <GenreSelector 
            genres={activeType === 0 ? genres.movie : genres.tv}
            selectedGenres={selectedGenres[activeType === 0 ? 'movie' : 'tv']}
            onGenreChange={handleGenreChange}
          />
          
          <div className="slider-container duree">
            <h3>Durée :</h3>
            <Slider
              value={duration}
              onChange={(event, newValue) => setDuration(newValue)}
              min={0}
              max={240}
              valueLabelDisplay="on"
            />
          </div>
          
          <div className="slider-container note">
            <h3>Note :</h3>
            <Slider
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              min={0}
              max={10}
              valueLabelDisplay="on"
            />
          </div>
          
          <h3>Plateformes :</h3>
          <ProviderSelector 
            providers={providers}
            selectedProviders={selectedProviders}
            onProviderChange={setSelectedProviders}
          />
          
          <div className="slider-container">
            <h3>Année de sortie :</h3>
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
        </div>
      ) : (
        <div className="form-container search">
          <h3>Recherche :</h3>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Rechercher un film, acteur, réalisateur..."
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
          Réinitialiser
        </Button>
        {activeTab === 0 ? (
          <Button 
            variant="contained" 
            endIcon={<Shuffle />}
            onClick={handleDiscover}
          >
            Découvrir
          </Button>
        ) : (
          <Button 
            variant="contained" 
            endIcon={<Search />}
            onClick={handleSearchx}
          >
            Rechercher
          </Button>
        )}
      </div>
    </div>
  );
}