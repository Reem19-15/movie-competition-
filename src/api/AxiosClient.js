import axios from "axios";
import queryString from "query-string";
import apiConfig from "./apiConfig";

const AxiosClient = axios.create({
  baseURL: apiConfig.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) =>
    queryString.stringify({ ...params, api_key: apiConfig.apiKey }),
});

// ✅ Request Interceptor: Ensures API key is always included
AxiosClient.interceptors.request.use(
  (config) => {
    if (!config.params) {
      config.params = {};
    }
    config.params.api_key = apiConfig.apiKey; // Always attach API key
    console.log("Request Sent:", config.url, config.params); // Debugging log
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor: Handles API responses & errors
AxiosClient.interceptors.response.use(
  (response) => {
    console.log("API Response:", response?.data); // Debugging log
    return response?.data || response;
  },
  (error) => {
    console.error("API Error:", error?.response?.data || error.message);
    if (error.response?.status === 401) {
      console.error("Invalid API Key! Check your TMDB API key.");
    }
    return Promise.reject(error);
  }
);

export default AxiosClient;
