import './ProviderSelector.css';
import { useState } from "react";
import { Add, Remove } from '@mui/icons-material';

const ProviderSelector = ({ providers, selectedProviders, onProviderChange }) => {
  const [extended, setExtended] = useState(false);
  const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

  const toggleExtended = () => {
    setExtended(prev => !prev);
  };

  const toggleProvider = (providerId) => {
    const newSelectedProviders = selectedProviders.includes(providerId) 
      ? selectedProviders.filter(id => id !== providerId)
      : [...selectedProviders, providerId];
    
    onProviderChange(newSelectedProviders);
  };

  return (
    <div className={`platform-grid ${extended ? "extended" : ""}`}>
      {providers.map((provider) => (
        <label key={provider.provider_id} className={"platform-label" + (provider.displayed ? " displayed":'')} >
          <input
            type="checkbox"
            checked={selectedProviders.includes(provider.provider_id)}
            onChange={() => toggleProvider(provider.provider_id)}
            className="platform-checkbox"
          />
          <div 
            className={`platform-button ${selectedProviders.includes(provider.provider_id) ? 'selected' : ''}`}
            title={provider.provider_name}
          >
            <img 
              src={`${TMDB_IMAGE_BASE_URL}${provider.logo_path}`}
              alt={provider.provider_name}
              className="platform-logo"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          </div>
        </label>
      ))}
      <label
        className="platform-label displayed"
        title={extended ? "Réduire" : "Afficher plus"}
        onClick={toggleExtended}
      >
        <div className='platform-button'>
          {extended ? <Remove /> : <Add />}
        </div>
      </label>
    </div>
  );
};

export default ProviderSelector;