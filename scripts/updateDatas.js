import * as fs from "fs";
import * as Utils from "../src/utils/utils.js";
import * as dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.VITE_TMDB_API_KEY;
const BASE_URL = process.env.VITE_TMDB_BASE_URL;

async function updateGenres() {
  const movieData = await getGenreData('movie');
  writeJSONFile("movieGenres", movieData);

  const tvData = await getGenreData('tv');
  writeJSONFile("tvGenres", tvData);
  
  const providerData = await getProviderData('tv');
  writeJSFile("providers", providerData);
}

async function getGenreData(type = "movie") {
  try {
    const responseFr = await fetch(
      `${BASE_URL}/genre/${type}/list?api_key=${API_KEY}&language=fr-FR`
    );
    const dataFr = await responseFr.json();

    const responseEn = await fetch(
      `${BASE_URL}/genre/${type}/list?api_key=${API_KEY}&language=en-US`
    );
    const dataEn = await responseEn.json();

    if (!dataFr.genres || !dataEn.genres) {
      console.error("Impossible de récupérer les genres depuis TMDB");
      return { fr: [], en: [] };
    }

    return {
      fr: {"genres": dataFr.genres},
      en: {"genres": dataEn.genres},
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des genres :", error);
    return { fr: [], en: [] };
  }
}


async function getProviderData() {
  const wantedProviders = [
    "Apple TV+",
    "Netflix",
    "Amazon Prime Video",
    "Paramount Plus",
    "Crunchyroll",
    "Disney plus",
    "Canal+",
    "Molotov TV"
  ];

  const response = await fetch(`${BASE_URL}/watch/providers/movie?api_key=${API_KEY}&language=fr-FR&watch_region=FR`);
  const data = await response.json();
  
  if (!data.results) {
    console.error("Impossible de récupérer les plateformes de streaming depuis TMDB");
    return [];
  }

  return data.results.map(({ provider_id, provider_name, logo_path }) => ({
    provider_id,
    provider_name,
    logo_path,
    displayed: wantedProviders.some(
      wp => provider_name.toLowerCase() === wp.toLowerCase()
    )
  }));
}


function writeJSONFile(filename, data) {
  try {
    fs.writeFileSync(
      `src/i18n/locales/fr/${filename}.json`,
      JSON.stringify(data.fr, null, 2),
      "utf-8"
    );
    console.log(`${filename} mis à jour dans src/i18n/locales/fr/${filename}.json`);

    fs.writeFileSync(
      `src/i18n/locales/en/${filename}.json`,
      JSON.stringify(data.en, null, 2),
      "utf-8"
    );
    console.log(`${filename} mis à jour dans src/i18n/locales/en/${filename}.json`);
  } catch (error) {
    console.error(error);
  }
}

function writeJSFile(filename, data) {
  const content = `// Ce fichier est généré automatiquement, ne pas modifier
const ${filename.toUpperCase()} = ${JSON.stringify(data, null, 2)};

export default ${filename.toUpperCase()};
`;

  try {
    fs.writeFileSync(`src/data/${filename}.js`, content, "utf-8");
    console.log(`${filename} mis à jour dans src/${filename}.js`);
  } catch (error) {
    console.error(error);
  }
}

updateGenres();
