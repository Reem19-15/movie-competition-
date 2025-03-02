import React, { useState, useEffect, useRef } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay"; // Import autoplay styles

import Button, { OutlineButton } from "../button/Button";
import Modal, { ModalContent } from "../modal/Modal";

import tmdbApi, { category, movieType } from "../../api/TMDBapi";
import apiConfig from "../../api/apiConfig";

import "./hero-slide.scss";
import { useNavigate } from "react-router-dom";

const HeroSlide = () => {
  const [movieItems, setMovieItems] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const getMovies = async () => {
      try {
        const response = await tmdbApi.getMoviesList(movieType.popular, {
          params: { page: 1 },
        });
        if (isMounted) setMovieItems(response.results.slice(0, 3));
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    getMovies();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="hero-slide">
      <Swiper
        modules={[Autoplay]}
        grabCursor={true}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 3000 }}
      >
        {movieItems.length > 0 &&
          movieItems.map((item, i) => (
            <SwiperSlide key={item.id}>
              {({ isActive }) => (
                <HeroSlideItem
                  item={item}
                  className={isActive ? "active" : ""}
                />
              )}
            </SwiperSlide>
          ))}
      </Swiper>
      {movieItems.map((item) => (
        <TrailerModal key={item.id} item={item} />
      ))}
    </div>
  );
};

const HeroSlideItem = ({ item, className }) => {
  const navigate = useNavigate();
  const background = apiConfig.originalImage(
    item.backdrop_path || item.poster_path
  );

  const setModalActive = async () => {
    const modal = document.querySelector(`#modal_${item.id}`);
    if (!modal) return;

    try {
      const videos = await tmdbApi.getVideos(category.movie, item.id);
      if (videos.results.length > 0) {
        modal
          .querySelector("iframe")
          .setAttribute(
            "src",
            `https://www.youtube.com/embed/${videos.results[0].key}`
          );
      } else {
        modal.querySelector(".modal__content").innerHTML =
          "<p>No trailer available</p>";
      }
      modal.classList.add("active");
    } catch (error) {
      console.error("Error fetching trailer:", error);
    }
  };

  return (
    <div
      className={`hero-slide__item ${className}`}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="hero-slide__item__content container">
        <div className="hero-slide__item__content__info">
          <h2 className="title">{item.title}</h2>
          <p className="overview">{item.overview}</p>
          <div className="btns">
            <Button onClick={() => navigate(`/movie/${item.id}`)}>
              Watch now
            </Button>
            <OutlineButton onClick={setModalActive}>
              Watch trailer
            </OutlineButton>
          </div>
        </div>
        <div className="hero-slide__item__content__poster">
          <img src={apiConfig.w500Image(item.poster_path)} alt={item.title} />
        </div>
      </div>
    </div>
  );
};

const TrailerModal = ({ item }) => {
  const iframeRef = useRef(null);

  const onClose = () => {
    if (iframeRef.current) iframeRef.current.setAttribute("src", "");
  };

  return (
    <Modal active={false} id={`modal_${item.id}`}>
      <ModalContent onClose={onClose}>
        <iframe
          ref={iframeRef}
          width="100%"
          height="500px"
          title="Trailer"
        ></iframe>
      </ModalContent>
    </Modal>
  );
};

export default HeroSlide;
