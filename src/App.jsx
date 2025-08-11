import { useEffect } from "react";
import { searchMovies } from "./api/tmdb";

function App() {
  useEffect(() => {
    async function fetchData() {
      const movies = await searchMovies("Inception");
      console.log("Films trouvés :", movies);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Test API TMDb</h1>
    </div>
  );
}

export default App;
