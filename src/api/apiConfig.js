const apiConfig = {
  baseUrl: "https://api.themoviedb.org/3/",
  apiKey: "1cf50e6248dc270629e802686245c2c8",
  originalImage: (imgPath) =>
    imgPath
      ? `https://image.tmdb.org/t/p/original/${imgPath}`
      : "/default-image.jpg",
  w500Image: (imgPath) =>
    imgPath
      ? `https://image.tmdb.org/t/p/w500/${imgPath}`
      : "/default-image.jpg",
};
export default apiConfig;
