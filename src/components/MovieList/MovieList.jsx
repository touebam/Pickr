import './MovieList.css';
import MovieCard from "../MovieCard/MovieCard";
import DialogFavorite from "../DialogFavorite/DialogFavorite";
import { Button } from "@mui/material"; 
import { useEffect, useRef, useState } from "react";
import { Favorite } from '@mui/icons-material';
import { useTranslation, Trans } from "react-i18next";

const listeLocalStorage = localStorage.getItem("favoriteList");
if (!listeLocalStorage || listeLocalStorage.length == 0)
  localStorage.setItem("favoriteList", JSON.stringify([]));

function MovieList({ movies, genres, fetchDetailsWithCache, onEndReached, onSearch, countryCode }) {
  const [openDialogFavorite, setOpenDialogFavorite] = useState(false);
  const sentinelRef = useRef(null);
  const [favoriteList, setFavoriteList] = useState(listeLocalStorage ? JSON.parse(listeLocalStorage) : []);
  const { t } = useTranslation("common");
  
  useEffect(() => {
    localStorage.setItem("favoriteList", JSON.stringify(favoriteList));
    console.log("enregistrement :", JSON.parse(localStorage.getItem("favoriteList")));
  }, [favoriteList]);

  const toggleFavorite = (movie, details) => {
    setFavoriteList((prev) => {
      const exists = prev.some((m) => m.id === movie.id);
      if (exists) {
        return prev.filter((m) => m.id !== movie.id);
      } else {
        const movieGenres = movie.genre_ids
        .map((id) => {
          const genreObj = genres[movie.type]?.find((g) => g.id === id);
          return genreObj ? genreObj.name : null;
        })
        .filter(Boolean)
        .join(", ");

        const favoriteMovie = {
          id: movie.id,
          poster_path: movie.poster_path,
          type: movie.type,
          title: movie.title,
          runtime: details.details.runtime,
          genres: movieGenres,
          providers: details?.providers?.FR || null,
        };
        return [...prev, favoriteMovie];
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const movieListContainer=document.querySelector('.app-layout__right') ;
      if (entries[0].isIntersecting && movieListContainer.scrollTop > 0) {
        onEndReached && onEndReached(); 
      }
    });

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [onEndReached]);

  
  const handleOpen = () => {
    setOpenDialogFavorite(true);
  };

  const handleClose = () => {
    setOpenDialogFavorite(false);
  };

  return (
    <div className="movie-list">
      {favoriteList.length>0 && 
        <Button
          className="open-favorite-button"
          endIcon={<Favorite />}
          variant="contained" 
          onClick={handleOpen}
        >
          {t("list.favorite")}
        </Button>
      }
      {movies.map((movie) => (
        <MovieCard 
            key={movie.id} 
            movie={movie} 
            allGenres={genres}
            fetchDetailsWithCache={fetchDetailsWithCache}
            onSearch={onSearch}
            countryCode={countryCode}
            onToggleFavorite={toggleFavorite}
            isFavorite={favoriteList.some((m) => m.id === movie.id)}
        />
      ))}
      <div id='sentinelRef' ref={sentinelRef} style={{ height: "1px" }}></div>
      <DialogFavorite
        movies={favoriteList} 
        handleClose={handleClose} 
        open={openDialogFavorite} 
        countryCode={countryCode}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
};

export default MovieList;

