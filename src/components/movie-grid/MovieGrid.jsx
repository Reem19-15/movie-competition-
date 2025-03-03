import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./movie-grid.scss";
import MovieCard from "../movie-card/MovieCard";
import Button, { OutlineButton } from "../button/Button";
import Input from "../input/Input";
import tmdbApi, { category, movieType, tvType } from "../../api/TMDBapi";

const MovieGrid = (props) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");

  const { keyword } = useParams();

  useEffect(() => {
    const getGenres = async () => {
      try {
        const response = await tmdbApi.getGenres(props.category);
        console.log("Genres Response:", response); // Debugging
        if (response && response.genres) {
          setGenres(response.genres);
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    getGenres();
  }, [props.category]);

  useEffect(() => {
    const getList = async () => {
      try {
        let response = null;
        const params = {
          sort_by: sortBy,
          with_genres: selectedGenre,
          page: 1,
        };

        if (!keyword) {
          response =
            props.category === category.movie
              ? await tmdbApi.getMoviesList(movieType.popular, params)
              : await tmdbApi.getTvList(tvType.popular, params);
        } else {
          params.query = keyword;
          response = await tmdbApi.search(props.category, params);
        }

        if (response && response.results) {
          setItems(response.results);
          setTotalPage(response.total_pages);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    getList();
  }, [props.category, keyword, sortBy, selectedGenre]);

  const loadMore = async () => {
    try {
      const nextPage = page + 1;
      const params = {
        page: nextPage,
        sort_by: sortBy,
        with_genres: selectedGenre,
      };

      let response = keyword
        ? await tmdbApi.search(props.category, { ...params, query: keyword })
        : props.category === category.movie
        ? await tmdbApi.getMoviesList(movieType.popular, params)
        : await tmdbApi.getTvList(tvType.popular, params);

      if (response && response.results) {
        setItems((prevItems) => [...prevItems, ...response.results]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading more movies:", error);
    }
  };

  return (
    <>
      <div className="section mb-3">
        <MovieSearch category={props.category} keyword={keyword} />
      </div>

      {/* FILTER & SORT UI */}
      <div className="filters">
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="popularity.desc">Most Popular</option>
          <option value="vote_average.desc">Top Rated</option>
          <option value="release_date.desc">Latest Releases</option>
        </select>
      </div>

      <div className="movie-grid">
        {items.map((item, i) => (
          <MovieCard category={props.category} item={item} key={i} />
        ))}
      </div>

      {page < totalPage && (
        <div className="movie-grid__loadmore">
          <OutlineButton className="small" onClick={loadMore}>
            Load more
          </OutlineButton>
        </div>
      )}
    </>
  );
};

const MovieSearch = (props) => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState(props.keyword || "");

  const goToSearch = useCallback(() => {
    if (keyword.trim().length > 0) {
      navigate(`/${category[props.category]}/search/${keyword}`);
    }
  }, [keyword, props.category, navigate]);

  useEffect(() => {
    const enterEvent = (e) => {
      if (e.keyCode === 13) {
        goToSearch();
      }
    };
    document.addEventListener("keyup", enterEvent);
    return () => document.removeEventListener("keyup", enterEvent);
  }, [keyword, goToSearch]);

  return (
    <div className="movie-search">
      <Input
        type="text"
        placeholder="Search movies..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <Button className="small" onClick={goToSearch}>
        Search
      </Button>
    </div>
  );
};

export default MovieGrid;
