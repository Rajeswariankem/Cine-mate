import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import MovieRow from "../components/MovieRow";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [providers, setProviders] = useState([]);
  const [cast, setCast] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    if (!movie) return;
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorite(stored.some((m) => m.id === movie.id));
  }, [movie]);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    let stored = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorite) {
      stored = stored.filter((m) => m.id !== movie.id);
    } else {
      if (!stored.some((m) => m.id === movie.id)) stored.push(movie);
    }

    localStorage.setItem("favorites", JSON.stringify(stored));
    setFavorite(!favorite);
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`)
      .then((res) => setMovie(res.data));

    axios
      .get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`)
      .then((res) => {
        const trailerVideo = res.data.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube",
        );
        if (trailerVideo) setTrailer(trailerVideo.key);
      });

    axios
      .get(
        `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${apiKey}`,
      )
      .then((res) => {
        const india = res.data.results?.IN;
        if (india?.flatrate) setProviders(india.flatrate);
      });

    axios
      .get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`)
      .then((res) => setCast(res.data.cast.slice(0, 6)));

    axios
      .get(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${apiKey}`)
      .then((res) => setSimilar(res.data.results.slice(0, 8)));
  }, [id, apiKey]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!movie) return <div className="text-white p-10 text-xl">Loading...</div>;

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Back Button */}
      <div className="px-4 sm:px-6 md:px-10 pt-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 border border-gray-400 px-4 sm:px-5 py-2 rounded-lg text-gray-300 transition hover:bg-red-600 hover:text-white hover:border-transparent"
        >
          ← Back to Home
        </button>
      </div>

      {/* Hero Section */}
      <div
        className="relative min-h-[70vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40"></div>

        <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-12 px-4 sm:px-6 md:px-10 py-16 md:py-20">
          {/* Poster */}
          <div className="relative w-48 sm:w-56 md:w-72">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full rounded-xl shadow-2xl"
            />

            <button
              onClick={toggleFavorite}
              className="absolute top-2 right-2 text-xl sm:text-2xl"
            >
              {favorite ? (
                <span className="text-red-600">♥</span>
              ) : (
                <span className="text-white">♡</span>
              )}
            </button>
          </div>

          {/* Movie Info */}
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              {movie.title}
            </h1>

            <div className="text-gray-400 mb-4 text-sm sm:text-base">
              {movie.genres.map((g) => g.name).join(" • ")}
            </div>

            <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6 text-gray-300 text-sm sm:text-base">
              <div className="text-yellow-400 font-semibold">
                ⭐ {movie.vote_average.toFixed(1)}
              </div>

              <span>{movie.release_date}</span>

              <span>• {formatRuntime(movie.runtime)}</span>
            </div>

            <p className="text-gray-300 leading-relaxed mb-8 text-sm sm:text-base">
              {movie.overview}
            </p>

            {trailer && (
              <button
                onClick={() =>
                  window.open(
                    `https://www.youtube.com/watch?v=${trailer}`,
                    "_blank",
                  )
                }
                className="border border-red-600 text-red-600 bg-white px-5 py-2 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition"
              >
                Watch Trailer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Streams */}
      <div className="px-4 sm:px-6 md:px-10 py-12 bg-zinc-900">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8">Streams</h2>

        <div className="flex flex-wrap gap-4 sm:gap-6">
          {providers.length > 0 ? (
            providers.map((provider) => (
              <button
                key={provider.provider_id}
                className="flex items-center gap-2 border border-blue-600 text-blue-600 bg-white px-4 py-2 rounded-lg font-semibold text-sm sm:text-base hover:bg-blue-600 hover:text-white transition"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                  alt={provider.provider_name}
                  className="w-5 h-5 rounded"
                />
                {provider.provider_name}
              </button>
            ))
          ) : (
            <p className="text-gray-400">
              Not available on streaming platforms.
            </p>
          )}
        </div>
      </div>

      {/* Cast */}
      <div className="px-4 sm:px-6 md:px-10 py-14">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8">Top Cast</h2>

        <div className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar">
          {cast.map((actor) => (
            <div
              key={actor.id}
              className="min-w-[120px] sm:min-w-[150px] text-center"
            >
              <img
                src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                alt={actor.name}
                className="rounded-lg mb-2"
              />
              <p className="font-semibold text-sm sm:text-base">{actor.name}</p>
              <p className="text-xs sm:text-sm text-gray-400">
                {actor.character}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Similar Movies */}
      <div className="pb-20 mb-12">
        <MovieRow
          title="Similar Movies"
          movies={similar}
          onSelect={(movie) => {
            navigate(`/movie/${movie.id}`);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    </div>
  );
}

export default MovieDetails;
