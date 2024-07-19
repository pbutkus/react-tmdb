import { CastMember, Movie } from "@/types/Movie";
import { Card, CardContent } from "../ui/card";
import "./MovieCard.css";
import { PrimeThumbsUp } from "../icons/PrimeThumbsUp";
import { PrimeCalendar } from "../icons/PrimeCalendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Suspense, useEffect, useState } from "react";
import { FluentEmojiPopcorn } from "../icons/FluentEmojiPopcorn";
import { Skeleton } from "../ui/skeleton";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { PrimeStar } from "../icons/PrimeStar";
import { PrimeStarFill } from "../icons/PrimeStarFill";
import MovieCardLoader from "./MovieCardLoader";
import { getCast } from "@/services/tmdbService";

type MovieCardProps = {
  movie: Movie;
  fav: boolean;
  addToFavorites: (movie: Movie) => void;
  removeFromFavorites: (movieId: number) => void;
  isLast: boolean;
};

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  fav,
  addToFavorites,
  removeFromFavorites,
  isLast,
}) => {
  const [backdropLoading, setBackdropLoading] = useState<boolean>(true);
  const [posterLoading, setPosterLoading] = useState<boolean>(
    movie.poster_path !== null
  );
  const [cast, setCast] = useState<CastMember[]>([]);
  const [castLoading, setCastLoading] = useState<boolean>(true);
  const [favorite, setFavorite] = useState<boolean>(false);

  useEffect(() => {
    if (isLast) {
      // console.log("Last", movie);
    }
  }, [isLast, movie]);

  useEffect(() => {
    setFavorite(fav);
  }, [fav]);

  const loadCast = () => {
    getCast(movie.id).then((data) => {
      const cast = data;

      if (cast.length > 10) {
        cast.length = 10;
      }
      setCastLoading(false);
      return setCast(cast);
    });
  };

  const handleCheckboxClick = (event: React.MouseEvent<HTMLInputElement>) => {
    event.stopPropagation();

    if (!favorite) {
      addToFavorites(movie);
    } else {
      removeFromFavorites(movie.id);
    }
  };

  return (
    <Suspense fallback={<MovieCardLoader />}>
      <Dialog>
        <DialogTrigger onClick={loadCast}>
          <Card className="overflow-hidden h-80 group">
            <CardContent className="p-0 flex relative justify-center items-end h-full">
              {backdropLoading && (
                <Skeleton className="w-full h-full absolute top-0 left-0" />
              )}
              {(movie.backdrop_path !== null || movie.poster_path !== null) && (
                <img
                  src={`https://image.tmdb.org/t/p/original${
                    movie.backdrop_path
                      ? movie.backdrop_path
                      : movie.poster_path
                  }`}
                  alt={movie.title}
                  className={`absolute h-full w-full object-cover -z-1 group-hover:scale-105 transition duration-500 ${
                    backdropLoading ? "opacity-0" : "opacity-100"
                  }`}
                  onLoad={() => setBackdropLoading(false)}
                />
              )}

              <div className="p-2 flex flex-col gap-2 z-10 movie-card-text w-full min-h-24 h-24 justify-between">
                <div className="flex items-center h-full justify-between gap-2">
                  <h2 className="font-bold text-xl text-white text-left">
                    {movie.title}
                  </h2>
                  <div className="relative group/favorite">
                    {favorite ? (
                      <PrimeStarFill className="text-amber-400 group-hover/favorite:text-white transition h-6 w-6 shrink-0" />
                    ) : (
                      <PrimeStar className="text-white group-hover/favorite:text-amber-400 transition h-6 w-6 shrink-0" />
                    )}

                    <input
                      type="checkbox"
                      id="favorite-checkbox"
                      onClick={handleCheckboxClick}
                      className="absolute top-0 right-0 w-6 h-6 z-10 opacity-0 cursor-pointer"
                      checked={favorite}
                      onChange={() => {
                        return setFavorite(!favorite);
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <p className="font-light text-sm text-slate-200 flex items-center gap-1">
                    <PrimeCalendar className="w-5 h-5" /> {movie.release_date}
                  </p>
                  <p className="font-light text-sm text-slate-200 flex items-center gap-1">
                    <PrimeThumbsUp className="w-5 h-5" />{" "}
                    {movie.vote_average.toFixed(1)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="p-0 overflow-hidden max-w-4xl">
          <VisuallyHidden>
            <DialogHeader>
              <DialogTitle>{movie.title}</DialogTitle>
              <DialogDescription>
                {movie.overview ? movie.overview : "Movie overview missing"}
              </DialogDescription>
            </DialogHeader>
          </VisuallyHidden>
          <div className="relative">
            {movie.backdrop_path === null ? (
              <FluentEmojiPopcorn className="w-80 h-80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            ) : (
              <img
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title + " backdrop"}
                className="absolute -z-10 w-full h-full object-cover"
              />
            )}

            <div className="flex m-8 gap-2 dialog-content rounded-md overflow-hidden relative">
              {posterLoading && (
                <Skeleton className="z-20 w-64 h-96 bg-white/30 absolute rounded-none" />
              )}
              {movie.poster_path === null ? (
                <div className="w-64 h-full bg-red-500">
                  <FluentEmojiPopcorn
                    className={`z-10 w-64 h-96 bg-white ${movie.poster_path}`}
                    data-test={movie.poster_path}
                  />
                </div>
              ) : (
                <img
                  src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                  alt=""
                  className={`z-10 w-64 h-96 object-cover ${
                    posterLoading ? "opacity-0" : "opacity-100"
                  } transition-opacity duration-500`}
                  onLoad={() => setPosterLoading(false)}
                />
              )}

              <div className="p-4 flex flex-col gap-2">
                <h2 className="font-bold text-4xl text-white">{movie.title}</h2>
                <p className="text-slate-100">{movie.overview}</p>
                {castLoading ? (
                  <div className="grid gap-1">
                    <Skeleton className="h-[1rem] w-full bg-white/30" />
                    <Skeleton className="h-[1rem] w-full bg-white/30" />
                    <Skeleton className="h-[1rem] w-full bg-white/30" />
                  </div>
                ) : (
                  <p className="text-slate-300 font-light">
                    <strong className="text-slate-100">Cast: </strong>
                    {cast.map((member) => member.name).join(", ")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Suspense>
  );
};

export default MovieCard;
