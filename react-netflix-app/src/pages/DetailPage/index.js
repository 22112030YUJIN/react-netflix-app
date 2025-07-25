import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import "./detailPage.css";

export default function DetailPage() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState({});
  const [videoKey, setVideoKey] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const request = await axios.get(`/movie/${movieId}`, {
          params: { append_to_response: "videos" },
        });
        setMovie(request.data);

        const trailer = request.data.videos?.results.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        setVideoKey(trailer?.key || null);
      } catch (error) {
        console.error("영화 데이터를 불러오는데 실패했습니다.", error);
        alert("영화 데이터를 불러오는데 실패했습니다.");
        navigate(-1);
      }
    }

    fetchData();

    return () => {
      console.log("컴포넌트 언마운트");
    };
  }, [movieId]);

  if (!movie) return <div>...loading</div>;

  return (
    <section>
      {/* 이미지 또는 영상 */}
      {!isPlaying ? (
        movie.backdrop_path && !imageError ? (
          <div className="detail__video-container">
            <img
              className="detail__bg-img"
              src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
              alt="poster"
              onError={() => setImageError(true)}
              onClick={() => {
                if (videoKey) {
                  setIsPlaying(true);
                } else {
                  alert("예고편 영상이 없습니다.");
                }
              }}
              style={{ cursor: videoKey ? "pointer" : "default" }}
            />
            {videoKey && (
              <div className="detail__play-overlay">▶</div>
            )}
          </div>
        ) : (
          <div className="detail__bg-placeholder" />
        )
      ) : (
        <div className="detail__video-container">
          <iframe
           className="detail__video-iframe"
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&controls=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
          ></iframe>
        </div>
      )}

      <div className="detail__overlay">
        <h1 className="detail__title">{movie.title}</h1>
        <p className="detail__release">{movie.release_date}</p>
        <p className="detail__vote">⭐ {movie.vote_average}</p>
        <p className="detail__overview">{movie.overview}</p>
      </div>
    </section>
  );
}
