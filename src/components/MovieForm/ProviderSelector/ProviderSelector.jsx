import React from 'react';
import './ProviderSelector.css';

const ProviderSelector = ({ providers, selectedProviders, onProviderChange }) => {
  const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

  const toggleProvider = (providerId) => {
    const newSelectedProviders = selectedProviders.includes(providerId) 
      ? selectedProviders.filter(id => id !== providerId)
      : [...selectedProviders, providerId];
    
    onProviderChange(newSelectedProviders);
  };

  // Trier par display_priority
  const sortedProviders = [...providers].sort((a, b) => a.display_priority - b.display_priority);

  return (
    <div className="platform-grid">
      {sortedProviders.map((provider) => (
        <label key={provider.provider_id} className="platform-label">
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
    </div>
  );
};

export default ProviderSelector;