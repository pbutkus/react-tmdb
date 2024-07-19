const authToken = import.meta.env.VITE_TMDB_AUTH_TOKEN;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${authToken}`,
  },
};

const getPopularMovies = async (page?: number) => {
  return fetch(
    `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${
      page ? page : "1"
    }`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      return response.results;
    })
    .catch((err) => console.error(err));
};

const getMoviesByQuery = async (query: string, page?: number) => {
  return fetch(
    `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${
      page ? page : "1"
    }`,
    options
  )
    .then((response) => response.json())
    .then((response) => response.results)
    .catch((err) => console.error(err));
};

const getMovieGenres = async () => {
  return fetch(
    "https://api.themoviedb.org/3/genre/movie/list?language=en",
    options
  )
    .then((response) => response.json())
    .then((response) => response.genres)
    .catch((err) => console.error(err));
};

const getCast = async (id: number) => {
  return fetch(
    `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`,
    options
  )
    .then((response) => response.json())
    .then((response) => response.cast)
    .catch((err) => console.error(err));
};

export { getPopularMovies, getMoviesByQuery, getMovieGenres, getCast };
