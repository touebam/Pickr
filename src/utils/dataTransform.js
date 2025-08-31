// Transformation des données vers un format uniforme
export const transformTMDBData = (data, type = "movie") => {
  return data.map(item => ({
    id: item.id,
    type: type,
    poster_path: item.poster_path,
    title: type === 'movie' ? item.title : item.name,
    rating: item.vote_average,
    genre_ids: item.genre_ids,
    overview: item.overview,
    release_date: type === 'movie' ? item.release_date : item.first_air_date,
    //originalTitle: type === 'movie' ? item.original_title : item.original_name,
    originalData: item 
  }));
};