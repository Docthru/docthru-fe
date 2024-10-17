import axios from 'axios';
import { createLogout } from './auth';

const API_URL = process.env.NEXT_PUBLIC_DEV_API_URL;

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
instance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    //refreshToken handle
    if (
      typeof window !== 'undefined' &&
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const response = await instance.post(
          '/users/token/refresh',
          {},
          {
            withCredentials: true,
          }
        );
        const { accessToken } = response.data;

        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        console.error('token refresh error:', refreshError);

        if (
          refreshError.response?.status === 500 ||
          refreshError.response?.status === 401
        ) {
          console.error('Refresh token is invalid or server error');

          localStorage.removeItem('accessToken', accessToken);
        }
        return Promise.reject({ status: refreshError.response?.status });
      }
    }
    // response error handle
    if (error.response) {
      const { data } = error.response;

      if (data && data.error) {
        console.error('Response Error:', data.error);
        return Promise.reject({
          ...data.error,
          status: error.response.status,
        });
      }
      return Promise.reject({
        message: data.message || 'An unknown error occurred.',
        status: error.response.status,
      });
    }

    //request error handle
    if (error.request) {
      console.error('Request error', error.request);
      return Promise.reject({ message: error.request?.responseText });
    }

    console.error('Unexpected error', error.message);
    return Promise.reject(error);
  }
);

export default instance;
