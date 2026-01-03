import axios from 'axios';

// Base API configuration - update this URL to match your Spring Boot backend
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add API key to all requests
apiClient.interceptors.request.use(
  (config) => {
    const apiKey = localStorage.getItem('apiKey');
    if (apiKey) {
      config.headers['X-API-Key'] = apiKey;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('apiKey');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  validateKey: (apiKey: string) => apiClient.post('/auth/validate', { apiKey }),
};

// Admin Analytics APIs
export const analyticsAPI = {
  getDashboardStats: () => apiClient.get('/admin/analytics/dashboard'),
  getRequestsOverTime: (period: string = '24h') => 
    apiClient.get(`/admin/analytics/requests?period=${period}`),
  getStatusCodeDistribution: () => apiClient.get('/admin/analytics/status-codes'),
};

// API Clients Management
export const clientsAPI = {
  getAll: () => apiClient.get('/admin/clients'),
  create: (data: { name: string; rateLimit: number }) => 
    apiClient.post('/admin/clients', data),
  update: (id: string, data: { rateLimit?: number; status?: string }) => 
    apiClient.put(`/admin/clients/${id}`, data),
  delete: (id: string) => apiClient.delete(`/admin/clients/${id}`),
};

// Logs APIs
export const logsAPI = {
  getAll: (params: { page?: number; limit?: number; apiKey?: string; endpoint?: string; status?: string }) =>
    apiClient.get('/admin/logs', { params }),
};

// Client Dashboard APIs
export const clientDashboardAPI = {
  getUsageStats: () => apiClient.get('/client/usage'),
  getUsageOverTime: () => apiClient.get('/client/usage/timeline'),
};

// Profile APIs
export const profileAPI = {
  getProfile: () => apiClient.get('/profile'),
};

export default apiClient;
