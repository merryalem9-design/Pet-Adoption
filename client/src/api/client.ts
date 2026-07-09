import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { useAuthStore } from '../stores/authStore';

let apiClient: AxiosInstance | null = null;

export const initializeApiClient = () => {
  apiClient = axios.create({
    baseURL: '/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  apiClient.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // FormData bodies (photo uploads) need the browser to generate
      // their own multipart boundary. The instance-level default of
      // 'application/json' above would otherwise stick and break
      // multer's parsing on the backend, since Axios only
      // auto-generates the multipart Content-Type when no
      // Content-Type has already been set.
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
      }
      return Promise.reject(error);
    }
  );

  return apiClient;
};

export const getApiClient = () => {
  if (!apiClient) {
    initializeApiClient();
  }
  return apiClient;
};