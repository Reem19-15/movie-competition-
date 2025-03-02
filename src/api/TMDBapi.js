import AxiosClient from "./AxiosClient";

export const category = {
  movie: "movie",
  tv: "tv",
};

export const movieType = {
  upcoming: "upcoming",
  popular: "popular",
  top_rated: "top_rated",
};

export const tvType = {
  popular: "popular",
  top_rated: "top_rated",
  on_the_air: "on_the_air",
};

const tmdbApi = {
  getMoviesList: (type, params = {}) => {
    const url = `movie/${movieType[type]}`;
    return AxiosClient.get(url, { params });
  },
  getTvList: (type, params = {}) => {
    const url = `tv/${tvType[type]}`;
    return AxiosClient.get(url, { params });
  },
  getVideos: (cate, id) => {
    const url = `${category[cate]}/${id}/videos`;
    return AxiosClient.get(url);
  },
  search: (cate, params = {}) => {
    const url = `search/${category[cate]}`;
    return AxiosClient.get(url, { params });
  },
  detail: (cate, id, params = {}) => {
    const url = `${category[cate]}/${id}`;
    return AxiosClient.get(url, { params });
  },
  credits: (cate, id) => {
    const url = `${category[cate]}/${id}/credits`;
    return AxiosClient.get(url);
  },
  similar: (cate, id) => {
    const url = `${category[cate]}/${id}/similar`;
    return AxiosClient.get(url);
  },
};

export default tmdbApi;
