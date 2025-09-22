import React, { useState, useEffect, useMemo } from 'react';
import { 
  Select, 
  MenuItem, 
  Box, 
  Typography 
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import './CountrySelector.css';

const CountrySelector = ({ value, onChange }) => {
  const { i18n } = useTranslation();
  const [countriesData, setCountriesData] = useState({});

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const data = await import(`../../../i18n/locales/${i18n.language}/countries.json`);
        setCountriesData(data.default);
      } catch (error) {
        const fallback = await import(`../../../i18n/locales/en/countries.json`);
        setCountriesData(fallback.default);
      }
    };
    
    loadCountries();
  }, [i18n.language]);

  const countries = useMemo(() => {
    return Object.entries(countriesData)
      .map(([code, obj]) => ({ code, obj }))
      .sort((a, b) => a.obj.name.localeCompare(b.obj.name));
  }, [countriesData]);

  console.log(countries)
  
  return (
      <Select
        id="country-select"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="country-selector"
        MenuProps={{
          PaperProps: {
            className: 'country-selector-menu'
          },
        }}
      >
        {countries.map((country) => (
          <MenuItem key={country.code} value={country.code} className="country-selector-item">
            <Box className="country-selector-content">
              <span 
                className={`country-selector-flag fi fi-${country.code.toLowerCase()}`} 
                title={country.obj.name}
              />
              <Typography variant="body2" className="country-selector-text">
                <span className="country-name">{country.obj.name}</span>
                <span className="country-code">{country.code}</span>
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
  );
};
      
export default CountrySelector;