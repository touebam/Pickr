import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import commonFR from "./locales/fr/common.json";
import countriesFR from "./locales/fr/countries.json";
import movieGenresFR from "./locales/fr/movieGenres.json";
import tvGenresFR from "./locales/fr/tvGenres.json";

import commonEN from "./locales/en/common.json";
import countriesEN from "./locales/en/countries.json";
import movieGenresEN from "./locales/en/movieGenres.json";
import tvGenresEN from "./locales/en/tvGenres.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: {
        common: commonFR,
        countries: countriesFR,
        movieGenres: movieGenresFR,
        tvGenres: tvGenresFR,
      },
      en: {
        common: commonEN,
        countries: countriesEN,
        movieGenres: movieGenresEN,
        tvGenres: tvGenresEN,
      },
    },
    fallbackLng: "en",
    supportedLngs: ["fr", "en"],
    ns: ["common", "countries", "movieGenres", "tvGenres"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["querystring", "navigator", "htmlTag"],
    },
  });

export default i18n;
