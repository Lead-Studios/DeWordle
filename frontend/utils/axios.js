import axios from "axios";
import Cookies from 'js-cookie';


const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,

});

API.interceptors.request.use(
  (req) => {
    const token = Cookies.get('accessToken');
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req; // Always return the request!
  },
  (error) => {
    return Promise.reject(error);
  }
);


API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optionally clear token and redirect to login page
      Cookies.remove('accessToken');
      // You might also want to update your global state to reflect logout
      window.location.href = "/signin"; // or use your router for redirection
    }
    return Promise.reject(error);
  }
);

export default API;
