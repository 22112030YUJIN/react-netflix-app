import React, { useRef, useState, useEffect } from "react";
import "./MovieModal.css";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import axios from "../../api/axios"; // ← axios import 필요

function MovieModal({
  id, // ← 영화 ID 필요
  backdrop_path,
  title,
  overview,
  name,
  release_date,
  first_air_date,
  vote_average,
  setModalOpen,
}) {
  const ref = useRef();
  const [videoKey, setVideoKey] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useOnClickOutside(ref, () => {
    setModalOpen(false);
  });

  // 영상 정보 가져오기
  useEffect(() => {
    async function fetchVideo() {
      try {
        const res = await axios.get(`movie/${id}`, {
          params: { append_to_response: "videos" },
        });
        const key = res.data.videos?.results[0]?.key;
        setVideoKey(key || null);
      } catch (err) {
        console.error("영상 정보 오류", err);
        setVideoKey(null);
      }
    }

    fetchVideo();
  }, [id]);

  return (
    <div className="presentation">
      <div className="wrapper-modal">
        <div className="modal" ref={ref}>
          <span onClick={() => setModalOpen(false)} className="modal-close">X</span>

          {/* 이미지 또는 영상 */}
          {isVideoPlaying && videoKey ? (
            <iframe
              width="100%"
              height="360"
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&controls=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="modal__video-container">
            <img
              className="modal__poster-img"
              src={`https://image.tmdb.org/t/p/original/${backdrop_path}`}
              alt="modal__poster-img"
              onClick={() => {
                if (videoKey) {
                  setIsVideoPlaying(true);
                } else {
                  alert("예고편 영상이 없습니다.");
                }
              }}
              style={{ cursor: videoKey ? "pointer" : "default" }}
            />
              {videoKey && (
                <div className="modal__play-overlay">
                  <span className="modal__play-icon">▶</span>
                </div>
              )}
            </div>
          )}

          <div className="modal__content">
            <p className="modal__details">{release_date || first_air_date}</p>
            <h2 className="modal__title">{title || name}</h2>
            <p className="modal__overview">평점: {vote_average}</p>
            <p className="modal__overview">{overview}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;
