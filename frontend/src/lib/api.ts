import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Handle refresh token logic if implemented on backend
        // const refreshToken = Cookies.get('refreshToken');
        // const res = await axios.post(`${API_URL}/auth/refresh`, { token: refreshToken });
        // Cookies.set('token', res.data.token);
        // return api(originalRequest);
        
        // For now, logout on 401
        Cookies.remove('token');
        Cookies.remove('user');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export const apiHelper = {
  get: <T>(url: string) => api.get<T>(url).then((res) => res.data),
  post: <T>(url: string, data: any) => api.post<T>(url, data).then((res) => res.data),
  put: <T>(url: string, data: any) => api.put<T>(url, data).then((res) => res.data),
  delete: <T>(url: string) => api.delete<T>(url).then((res) => res.data),
};
