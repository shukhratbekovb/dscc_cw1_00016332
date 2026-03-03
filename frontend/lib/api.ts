import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { useAuthStore } from '@/store/auth';
import type { AuthResponse, LoginRequest, RegisterRequest } from './types';

const API_BASE_URL = 'https://test.api.it911.uz';

let apiClient: AxiosInstance;

export function initializeApiClient() {
  apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log('[v0] API Client initialized with baseURL:', API_BASE_URL);

  // Request interceptor: Add access token to headers
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const { accessToken } = useAuthStore.getState();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      console.log('[v0] API Request:', config.method?.toUpperCase(), config.url);
      return config;
    },
    (error) => {
      console.log('[v0] Request interceptor error:', error.message);
      return Promise.reject(error);
    }
  );

  // Response interceptor: Handle 401 and auto-refresh
  apiClient.interceptors.response.use(
    (response) => {
      console.log('[v0] API Response:', response.status, response.config.url);
      return response;
    },
    async (error: AxiosError) => {
      console.log('[v0] API Error:', error.message);
      console.log('[v0] Error status:', error.response?.status);
      console.log('[v0] Error data:', error.response?.data);

      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const { refreshToken } = useAuthStore.getState();
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await axios.post<{ access: string }>(
            `${API_BASE_URL}/jwt/refresh/`,
            { refresh: refreshToken }
          );

          const { access } = response.data;
          useAuthStore.setState({ accessToken: access });

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.log('[v0] Token refresh failed:', refreshError);
          // Refresh failed, clear auth and redirect to login
          useAuthStore.setState({ accessToken: null, refreshToken: null, user: null });
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return apiClient;
}

export function getApiClient(): AxiosInstance {
  if (!apiClient) {
    initializeApiClient();
  }
  return apiClient;
}

// Auth API
export const authApi = {
  login: (credentials: LoginRequest) =>
    getApiClient().post<AuthResponse>('/api/jwt/create', credentials),

  register: (data: RegisterRequest) =>
    getApiClient().post<AuthResponse>('/api/users/', data),

  refresh: (refreshToken: string) =>
    getApiClient().post<{ access: string }>('/api/jwt/refresh/', { refresh: refreshToken }),

  me: () =>
    getApiClient().get('/api/users/me/'),
};

// Projects API
export const projectsApi = {
  list: () =>
    getApiClient().get('/api/projects/'),

  retrieve: (id: number) =>
    getApiClient().get(`/api/projects/${id}/`),

  create: (data: any) =>
    getApiClient().post('/api/projects/', data),

  update: (id: number, data: any) =>
    getApiClient().patch(`/api/projects/${id}/`, data),

  delete: (id: number) =>
    getApiClient().delete(`/api/projects/${id}/`),
};

// Todos API
export const todosApi = {
  listByProject: (projectId: number) =>
    getApiClient().get(`/api/todos?project_id=${projectId}/`),

  retrieve: (todoId: number) =>
    getApiClient().get(`/api/todos/${todoId}/`),

  create: (projectId: number, data: any) =>
    getApiClient().post(`/api/todos/`, { ...data, project: projectId }),

  update: (todoId: number, data: any) =>
    getApiClient().patch(`/api/todos/${todoId}/`, data),

  delete: (todoId: number) =>
    getApiClient().delete(`/api/todos/${todoId}/`),
};

// Tags API
export const tagsApi = {
  list: () =>
    getApiClient().get('/api/tags/'),
};

