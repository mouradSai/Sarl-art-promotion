import axios from 'axios';

// Function to get the base URL
const getBaseURL = (url) => {
  if (url.includes('localhost')) {
    const isLocalhost = window.location.hostname === 'localhost';
    if (!isLocalhost) {
      return url.replace('localhost', '192.168.1.8'); // Replace with IP
    }
  }
  return url; // If not localhost, return the original URL
};

// Create a custom fetch function
const originalFetch = window.fetch;

window.fetch = async (url, options) => {
  url = getBaseURL(url); // Transform the URL before the request is made
  return originalFetch(url, options);
};

// Create a custom axios instance
const httpClient = axios.create();

httpClient.interceptors.request.use((config) => {
  config.url = getBaseURL(config.url); // Transform the URL before the request is made
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add a request interceptor to the default axios instance
axios.interceptors.request.use((config) => {
  config.url = getBaseURL(config.url); // Transform the URL before the request is made
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Export both axios and httpClient
export { httpClient, axios };
export default httpClient;
