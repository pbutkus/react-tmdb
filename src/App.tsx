import { useCallback, useEffect, useState } from "react";
import "./App.css";
import MovieCard from "./components/MovieCard/MovieCard";
import { Movie } from "./types/Movie";
import { Card } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Genre } from "./types/Genre";
import { Switch } from "./components/ui/switch";
import { Label } from "./components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/ui/accordion";
import {
  getMovieGenres,
  getMoviesByQuery,
  getPopularMovies,
} from "./services/tmdbService";
import {
  getFavorites,
  removeFromFavorites,
  addToFavorites,
} from "./services/favoritesService";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [queriedMovies, setQueriedMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [favoritesChecked, setFavoritesChecked] = useState<boolean>(false);

  useEffect(() => {
    setFavoriteMovies(getFavorites());
    getPopularMovies().then((data) => {
      setPopularMovies(data);
      setMovies(data);
    });

    getMovieGenres().then((data) => setGenres(data));
  }, []);

  const handleMovieList = useCallback(() => {
    if (favoritesChecked) {
      setMovies(favoriteMovies);
    } else if (queriedMovies.length > 0) {
      setMovies(queriedMovies);
    } else {
      setMovies(popularMovies);
    }
  }, [favoritesChecked, favoriteMovies, popularMovies, queriedMovies]);

  useEffect(() => {
    handleMovieList();
  }, [favoritesChecked, handleMovieList]);

  useEffect(() => {
    handleMovieList();

    setMovies((prevMovies) => {
      if (selectedGenres.length > 0) {
        return prevMovies.filter((movie) =>
          selectedGenres.every((genre) => movie.genre_ids.includes(genre.id))
        );
      }
      return prevMovies;
    });
  }, [selectedGenres, handleMovieList]);

  const handleSearch = (query: string) => {
    if (favoritesChecked) {
      setMovies(
        favoriteMovies.filter((movie) =>
          movie.title.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else if (query.length >= 2) {
      const debounceSearch = setTimeout(() => {
        getMoviesByQuery(query).then((movies) => setQueriedMovies(movies));
      }, 250);

      return () => clearTimeout(debounceSearch);
    } else {
      setQueriedMovies([]);
    }
  };

  const handleSearchQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value;
    setSearchTerm(query);

    handleSearch(query);
  };

  const handleFilter = (checked: boolean, genre: Genre) => {
    if (checked) {
      setSelectedGenres((prev) => {
        return [...prev, genre];
      });
    } else {
      setSelectedGenres(
        selectedGenres.filter((selected) => selected.id !== genre.id)
      );
    }
  };

  const handleFavoritesCheck = () => {
    setFavoritesChecked((prevValue) => {
      return !prevValue;
    });

    setSearchTerm("");
  };

  const removeFromFavoritesHandler = (id: number) => {
    removeFromFavorites(id);
    setFavoriteMovies((prevFavorites) => {
      return prevFavorites.filter((movie) => movie.id !== id);
    });
  };

  const addToFavoritesHandler = (movie: Movie) => {
    addToFavorites(movie);
    setFavoriteMovies((prevFavorites) => [...prevFavorites, movie]);
  };

  return (
    <>
      <div className="container my-12">
        <div className="mb-4">
          <Card className="p-4 flex flex-col gap-4">
            <Input
              placeholder={
                favoritesChecked ? "Search favorites..." : "Search TMDB..."
              }
              onChange={handleSearchQueryChange}
              value={searchTerm}
            />
            <div className="flex gap-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="filters" className="border-b-0">
                  <AccordionTrigger className="py-2">Filters</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex gap-4 flex-wrap">
                      {genres.map((genre) => (
                        <div key={genre.id} className="flex items-center gap-2">
                          <Switch
                            checked={selectedGenres.some(
                              (selected) => selected.id === genre.id
                            )}
                            onCheckedChange={(checked) =>
                              handleFilter(checked, genre)
                            }
                            id={`${genre.id}`}
                          />
                          <Label htmlFor={`${genre.id}`}>{genre.name}</Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="py-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={favoritesChecked}
                    onCheckedChange={handleFavoritesCheck}
                    id="favorites-switch"
                  />
                  <Label htmlFor="favorites-switch">Favorites</Label>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 transition-all">
          {movies.map((movie, i) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              fav={favoriteMovies.some((favMovie) => favMovie.id === movie.id)}
              removeFromFavorites={removeFromFavoritesHandler}
              addToFavorites={addToFavoritesHandler}
              isLast={i === movies.length - 1}
            />
          ))}

          {/* {!favoritesChecked
            ? movies.map((movie, i) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  fav={favoriteMovies.some(
                    (favMovie) => favMovie.id === movie.id
                  )}
                  removeFromFavorites={removeFromFavoritesHandler}
                  addToFavorites={addToFavoritesHandler}
                  isLast={i === movies.length - 1}
                />
              ))
            : favoriteMovies.map((movie, i) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  fav={favoriteMovies.some(
                    (favMovie) => favMovie.id === movie.id
                  )}
                  removeFromFavorites={removeFromFavoritesHandler}
                  addToFavorites={addToFavoritesHandler}
                  isLast={i === movies.length - 1}
                />
              ))} */}
        </div>
      </div>
    </>
  );
}

export default App;
