import * as fs from "fs";
import * as Utils from "../src/utils/utils.js";
import * as dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.VITE_TMDB_API_KEY;
const BASE_URL = process.env.VITE_TMDB_BASE_URL;

async function updateGenres() {
  const movieData = await getGenreData('movie');
  writeFile("movieGenres", movieData);

  const tvData = await getGenreData('tv');
  writeFile("tvGenres", tvData);
  
  const providerData = await getProviderData('tv');
  writeFile("providers", providerData);
}

async function getGenreData(type = "movie") {
  const response = await fetch(`${BASE_URL}/genre/${type}/list?api_key=${API_KEY}&language=fr-FR`);
  const data = await response.json();
  if (!data.genres) {
    console.error("Impossible de récupérer les genres depuis TMDB");
    return [];
  }
  return data.genres;
}

async function getProviderData() {
  const wantedProviders = [
    "Apple TV",
    "Netflix",
    "Amazon Prime Video",
    "YouTube",
    "Crunchyroll",
    "Disney plus",
    "Canal+",
    "Molotov TV"
  ];

  const response = await fetch(`${BASE_URL}/watch/providers/movie?api_key=${API_KEY}&language=fr-FR`);
  const data = await response.json();
  if (!data.results) {
    console.error("Impossible de récupérer les plateformes de streaming depuis TMDB");
    return [];
  }

  const matchedProviders = data.results.filter(provider =>
    wantedProviders.some(wp => provider.provider_name.toLowerCase().includes(wp.toLowerCase()))
  );
  const uniqueProviders = Utils.filterClosestProviders(matchedProviders, wantedProviders);
  
  return uniqueProviders.map(({ provider_id, provider_name, logo_path }) => ({
    provider_id,
    provider_name,
    logo_path
  }));
}

function writeFile(filename, data) {
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
