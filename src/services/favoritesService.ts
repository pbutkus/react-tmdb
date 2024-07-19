import { Movie } from "@/types/Movie";

const initializeFavorites = () => {
  const favorites = JSON.stringify([]);
  localStorage.setItem("favorites", favorites);
};

const getFavorites = (): Movie[] => {
  const favorites = JSON.parse(localStorage.getItem("favorites")!) as Movie[];

  if (favorites === null) {
    initializeFavorites();
  }

  return favorites;
};

const addToFavorites = (movie: Movie) => {
  let favorites = localStorage.getItem("favorites");

  if (favorites === null) {
    initializeFavorites();
    favorites = localStorage.getItem("favorites");
  }

  const favoritesJSON = JSON.parse(favorites!) as Movie[];

  favoritesJSON.push(movie);

  localStorage.setItem("favorites", JSON.stringify(favoritesJSON));
};

const removeFromFavorites = (id: number) => {
  const favorites = getFavorites();
  const newFavorites = favorites.filter((movie) => movie.id !== id);

  localStorage.setItem("favorites", JSON.stringify(newFavorites));
};

export { getFavorites, addToFavorites, removeFromFavorites };
