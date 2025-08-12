import './MovieForm.css';
import { useState } from 'react';
import Slider from '@mui/material/Slider';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import GenreSelector from './GenreSelector/GenreSelector';
import ProviderSelector from './ProviderSelector/ProviderSelector';
import { Refresh, Search } from '@mui/icons-material';
import { Button } from '@mui/material';
import { getMovies } from '../../api/tmdb';

const currentYear = new Date().getFullYear();

// Valeurs par défaut
const DEFAULT_VALUES = {
  selectedGenres: [],
  selectedProviders: [],
  duration: [60, 180],
  rating: [7, 10],
  releaseYear: [2000, currentYear]
};

export default function MovieForm({ genres, providers, onSearch }) {
  // États pour tous les contrôles du formulaire
  const [selectedGenres, setSelectedGenres] = useState(DEFAULT_VALUES.selectedGenres);
  const [selectedProviders, setSelectedProviders] = useState(DEFAULT_VALUES.selectedProviders);
  const [duration, setDuration] = useState(DEFAULT_VALUES.duration);
  const [rating, setRating] = useState(DEFAULT_VALUES.rating);
  const [releaseYear, setReleaseYear] = useState(DEFAULT_VALUES.releaseYear);

  // Fonction pour réinitialiser tous les champs
  const handleReset = () => {
    setSelectedGenres(DEFAULT_VALUES.selectedGenres);
    setSelectedProviders(DEFAULT_VALUES.selectedProviders);
    setDuration(DEFAULT_VALUES.duration);
    setRating(DEFAULT_VALUES.rating);
    setReleaseYear(DEFAULT_VALUES.releaseYear);
  };

  // Fonction pour gérer la recherche
  async function handleSearch() {
    const searchCriteria = {
      genres: selectedGenres,
      providers: selectedProviders,
      duration,
      rating,
      releaseYear
    };
    
    console.log('Critères de recherche:', searchCriteria);
    const movies = await getMovies(searchCriteria);
    console.log(movies);
    onSearch(movies);
  };

  return (
    <div className="movie-form">
      <div className="form-container">
        <h3>Genres :</h3>
        <GenreSelector 
          genres={genres}
          selectedGenres={selectedGenres}
          onGenreChange={setSelectedGenres}
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
        
        <div className="slider-container">
          <h3>Note :</h3>
          <Slider
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            min={0}
            max={10}
            valueLabelDisplay="on"
          />
        </div>
        
        {/*
        <h3>Nationalité :</h3>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={10}
          label="Age"
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>*/}
        
        <h3>Plateformes de streaming :</h3>
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
      
      <div className="form-buttons">
        <Button 
          variant="outlined" 
          startIcon={<Refresh />}
          onClick={handleReset}
        >
          Réinitialiser
        </Button>
        <Button 
          variant="contained" 
          endIcon={<Search />}
          onClick={handleSearch}
        >
          Rechercher
        </Button>
      </div>
    </div>
  );
}