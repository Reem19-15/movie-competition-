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

// Request Interceptor
AxiosClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response Interceptor with Improved Error Handling
AxiosClient.interceptors.response.use(
  (response) => response?.data || response,
  (error) => {
    console.error("API Error:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default AxiosClient;
