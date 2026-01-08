import axios from 'axios';

// Use environment variable for API base URL
// In production (Vercel): points to Render backend
// In development: uses local proxy or localhost
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

// Create axios instance
const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Export the axios instance for use in other files
export { apiClient };

// API methods
export const api = {
  async getBatches() {
    const response = await apiClient.get('/batches');
    return response.data;
  },

  async getFiles(batchId) {
    const response = await apiClient.get(`/batch/${batchId}/files`);
    return response.data;
  },

  async getFile(batchId, fileNumber) {
    const response = await apiClient.get(`/batch/${batchId}/file/${fileNumber}`);
    return response.data;
  },

  async saveRsml(segmentId, rsmlData) {
    const response = await apiClient.post('/save', {
      id: segmentId,
      rsml: rsmlData,
    });
    return response.data;
  },
};
