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
      if (!stored.some((m) => m.id === movie.id)) {
        stored.push(movie);
      }
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
      <div className="px-10 pt-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 border border-gray-400 px-5 py-2 rounded-lg text-gray-300 transition duration-300 hover:bg-red-600 hover:text-white hover:border-transparent"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Home
        </button>
      </div>

      {/* Hero Section */}
      <div
        className="relative min-h-[80vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40"></div>

        <div className="relative z-10 flex flex-col md:flex-row gap-12 px-10 py-20">
          <div className="relative w-72">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-72 rounded-xl shadow-2xl"
            />

            {/* ❤️ Heart Button */}
            <button
              onClick={toggleFavorite}
              className="absolute top-3 right-3 z-20
                 text-2xl transition duration-300"
            >
              {favorite ? (
                <span className="text-red-600">♥</span>
              ) : (
                <span className="text-white">♡</span>
              )}
            </button>
          </div>

          {/* Info */}
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>

            <div className="text-gray-400 mb-4">
              {movie.genres.map((g) => g.name).join(" • ")}
            </div>

            {/* Rating + Date + Duration */}
            <div className="flex items-center gap-6 mb-6 text-gray-300 text-lg">
              <div className="flex items-center gap-2 text-yellow-400 font-semibold">
                ⭐ {movie.vote_average.toFixed(1)}
              </div>

              <span>{movie.release_date}</span>

              <span>• {formatRuntime(movie.runtime)}</span>
            </div>

            <p className="text-gray-300 leading-relaxed mb-8">
              {movie.overview}
            </p>

            {/* Trailer Button */}
            {trailer && (
              <button
                onClick={() =>
                  window.open(
                    `https://www.youtube.com/watch?v=${trailer}`,
                    "_blank",
                  )
                }
                className="border border-red-600 text-red-600 bg-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition duration-300"
              >
                Watch Trailer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Streams Section */}
      <div className="px-10 py-14 bg-zinc-900">
        <h2 className="text-3xl font-bold mb-8">Streams</h2>

        <div className="flex flex-wrap gap-6">
          {providers.length > 0 ? (
            providers.map((provider) => {
              const movieName = encodeURIComponent(movie.title);
              let searchUrl = "";

              if (provider.provider_name.toLowerCase().includes("prime")) {
                searchUrl = `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${movieName}`;
              } else if (
                provider.provider_name.toLowerCase().includes("netflix")
              ) {
                searchUrl = `https://www.netflix.com/search?q=${movieName}`;
              } else {
                searchUrl = `https://www.google.com/search?q=${movieName}+${provider.provider_name}`;
              }

              return (
                <button
                  key={provider.provider_id}
                  onClick={() => window.open(searchUrl, "_blank")}
                  className="flex items-center gap-3 border border-blue-600 text-blue-600 bg-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition duration-300"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                    alt={provider.provider_name}
                    className="w-6 h-6 rounded"
                  />
                  {provider.provider_name}
                </button>
              );
            })
          ) : (
            <p className="text-gray-400">
              Not available on streaming platforms.
            </p>
          )}
        </div>
      </div>

      {/* Cast Section */}
      <div className="px-10 py-16">
        <h2 className="text-3xl font-bold mb-8">Top Cast</h2>

        <div className="flex gap-6 overflow-x-auto">
          {cast.map((actor) => (
            <div key={actor.id} className="min-w-[150px] text-center">
              <img
                src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                alt={actor.name}
                className="rounded-lg mb-2"
              />
              <p className="font-semibold">{actor.name}</p>
              <p className="text-sm text-gray-400">{actor.character}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Similar Movies */}
      <div className="pb-20">
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
