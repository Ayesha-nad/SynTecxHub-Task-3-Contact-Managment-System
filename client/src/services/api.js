import axios from 'axios';

// Create dedicated Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for consistent error extraction
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Network or server down error
    if (!error.response) {
      return Promise.reject({
        success: false,
        message: 'Unable to reach the Rolodex server. Please ensure the backend is running.',
        isNetworkError: true,
      });
    }

    // Backend returned JSON error payload { success: false, message, errors }
    const { status, data } = error.response;
    return Promise.reject({
      success: false,
      status,
      message: data?.message || 'An error occurred while processing your request.',
      errors: data?.errors || {},
    });
  }
);

export const contactApi = {
  // Fetch contacts with query params: { search, tag, favorite, sort }
  getContacts: (params = {}) => apiClient.get('/contacts', { params }),

  // Fetch single contact dossier
  getContact: (id) => apiClient.get(`/contacts/${id}`),

  // Create new contact
  createContact: (contactData) => apiClient.post('/contacts', contactData),

  // Update existing contact
  updateContact: (id, contactData) => apiClient.put(`/contacts/${id}`, contactData),

  // Toggle favorite star
  toggleFavorite: (id) => apiClient.patch(`/contacts/${id}/favorite`),

  // Delete contact (tear page)
  deleteContact: (id) => apiClient.delete(`/contacts/${id}`),

  // Seed default vintage contacts
  seedContacts: (force = false) => apiClient.post(`/contacts/seed${force ? '?force=true' : ''}`),

  // Get distinct tags
  getTags: () => apiClient.get('/contacts/tags/all'),

  // Server health check
  getHealth: () => apiClient.get('/health'),
};

export default apiClient;
