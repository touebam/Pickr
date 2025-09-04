import './ProviderSelector.css';
import { useState } from "react";
import { Tooltip } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { useTranslation, Trans } from "react-i18next";

const ProviderSelector = ({ providers, selectedProviders, onProviderChange }) => {
  const [extended, setExtended] = useState(false);
  const { t } = useTranslation("common");
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
        <Tooltip 
          key={provider.provider_id} 
          title={provider.provider_name} 
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
          <label className={"platform-label" + (provider.displayed ? " displayed":'')} >
            <input
              type="checkbox"
              checked={selectedProviders.includes(provider.provider_id)}
              onChange={() => toggleProvider(provider.provider_id)}
              className="platform-checkbox"
            />
            <div 
              className={`platform-button ${selectedProviders.includes(provider.provider_id) ? 'selected' : ''}`}
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
        </Tooltip>
      ))}
      <Tooltip 
        title={extended ? t("form.extras.less") : t("form.extras.more")}
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
        <label
          className="platform-label displayed"
          onClick={toggleExtended}
        >
          <div className='platform-button'>
            {extended ? <Remove /> : <Add />}
          </div>
        </label>
      </Tooltip>
    </div>
  );
};

export default ProviderSelector;