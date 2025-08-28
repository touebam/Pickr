import './GenreSelector.css';

const GenreSelector = ({ genres, selectedGenres, onGenreChange }) => {
  const toggleGenre = (genreId) => {
    const newSelectedGenres = selectedGenres.includes(genreId) 
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId];
    
    onGenreChange(newSelectedGenres);
  };

  return (
    <div className="genre-grid">
      <div className='genre-container'>
        {genres.map((genre) => (
          <label key={genre.id} className="genre-label">
            <input
              type="checkbox"
              checked={selectedGenres.includes(genre.id)}
              onChange={() => toggleGenre(genre.id)}
              className="genre-checkbox"
            />
            <span 
              className={`genre-button ${selectedGenres.includes(genre.id) ? 'selected' : ''}`}
            >
              {genre.name}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default GenreSelector;