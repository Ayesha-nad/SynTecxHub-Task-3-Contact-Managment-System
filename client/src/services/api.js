import axios from 'axios';
import { sampleContacts } from '../data/sampleContacts';

// Generate simulated 24-character hex ID
const generateId = () => {
  return Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
};

// Compute initials from contact name
const computeInitials = (name = '') => {
  if (!name.trim()) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const STORAGE_KEY = 'analog_rolodex_contacts_v1';

// In-browser LocalStorage Service (for live GitHub Pages deployment or offline mode)
const localService = {
  getStore: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleContacts));
        return sampleContacts;
      }
      return JSON.parse(data);
    } catch {
      return sampleContacts;
    }
  },

  saveStore: (contacts) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }
  },

  getContacts: async (params = {}) => {
    let list = [...localService.getStore()];
    const { search, tag, favorite, sort = 'name-asc' } = params;

    if (tag && tag !== 'All') {
      list = list.filter((c) => (c.tags || []).includes(tag));
    }

    if (favorite === 'true' || favorite === true) {
      list = list.filter((c) => c.isFavorite);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          (c.name && c.name.toLowerCase().includes(q)) ||
          (c.email && c.email.toLowerCase().includes(q)) ||
          (c.phone && c.phone.toLowerCase().includes(q)) ||
          (c.company && c.company.toLowerCase().includes(q)) ||
          (c.address && c.address.toLowerCase().includes(q)) ||
          (c.jobTitle && c.jobTitle.toLowerCase().includes(q)) ||
          (c.notes && c.notes.toLowerCase().includes(q)) ||
          (c.tags && c.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    list.sort((a, b) => {
      if (sort === 'name-asc') return (a.name || '').localeCompare(b.name || '');
      if (sort === 'name-desc') return (b.name || '').localeCompare(a.name || '');
      if (sort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === 'company') return (a.company || '').localeCompare(b.company || '');
      return 0;
    });

    return {
      success: true,
      count: list.length,
      total: list.length,
      data: list,
    };
  },

  getContact: async (id) => {
    const list = localService.getStore();
    const contact = list.find((c) => c._id === id);
    if (!contact) {
      throw {
        success: false,
        status: 404,
        message: `Contact entry not found in Rolodex with ID: ${id}`,
      };
    }
    return { success: true, data: contact };
  },

  createContact: async (data) => {
    const list = localService.getStore();
    const existing = list.find(
      (c) => c.email && c.email.toLowerCase() === (data.email || '').toLowerCase().trim()
    );

    if (existing) {
      throw {
        success: false,
        status: 409,
        message: `A contact with the email '${data.email}' is already filed in your Rolodex.`,
        errors: { email: 'This email is already in use by another contact.' },
      };
    }

    const now = new Date().toISOString();
    const newContact = {
      _id: generateId(),
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone.trim(),
      address: data.address || '',
      company: data.company || '',
      jobTitle: data.jobTitle || '',
      tags: Array.isArray(data.tags) && data.tags.length > 0 ? data.tags : ['General'],
      notes: data.notes || '',
      isFavorite: Boolean(data.isFavorite),
      avatarColor: data.avatarColor || '#7a8c6f',
      createdAt: now,
      updatedAt: now,
      initials: computeInitials(data.name),
    };

    const updated = [newContact, ...list];
    localService.saveStore(updated);

    return {
      success: true,
      message: `"${newContact.name}" was successfully inscribed into your Rolodex.`,
      data: newContact,
    };
  },

  updateContact: async (id, data) => {
    const list = localService.getStore();
    const duplicate = list.find(
      (c) =>
        c._id !== id &&
        c.email &&
        c.email.toLowerCase() === (data.email || '').toLowerCase().trim()
    );

    if (duplicate) {
      throw {
        success: false,
        status: 409,
        message: `The email address '${data.email}' is already used by "${duplicate.name}".`,
        errors: { email: 'This email is already in use by another contact.' },
      };
    }

    const index = list.findIndex((c) => c._id === id);
    if (index === -1) {
      throw {
        success: false,
        status: 404,
        message: `Cannot update: Contact with ID ${id} does not exist.`,
      };
    }

    const existing = list[index];
    const now = new Date().toISOString();
    const updatedContact = {
      ...existing,
      ...data,
      email: data.email ? data.email.toLowerCase().trim() : existing.email,
      name: data.name ? data.name.trim() : existing.name,
      initials: data.name ? computeInitials(data.name) : existing.initials,
      updatedAt: now,
    };

    list[index] = updatedContact;
    localService.saveStore(list);

    return {
      success: true,
      message: `Ledger entry for "${updatedContact.name}" updated successfully.`,
      data: updatedContact,
    };
  },

  toggleFavorite: async (id) => {
    const list = localService.getStore();
    const index = list.findIndex((c) => c._id === id);
    if (index === -1) {
      throw {
        success: false,
        status: 404,
        message: `Contact not found with ID: ${id}`,
      };
    }

    list[index].isFavorite = !list[index].isFavorite;
    list[index].updatedAt = new Date().toISOString();
    localService.saveStore(list);

    return {
      success: true,
      message: list[index].isFavorite
        ? `Pinned "${list[index].name}" to favorites.`
        : `Removed "${list[index].name}" from favorites.`,
      data: list[index],
    };
  },

  deleteContact: async (id) => {
    const list = localService.getStore();
    const index = list.findIndex((c) => c._id === id);
    if (index === -1) {
      throw {
        success: false,
        status: 404,
        message: `Cannot delete: Contact with ID ${id} not found in Rolodex.`,
      };
    }

    const removed = list.splice(index, 1)[0];
    localService.saveStore(list);

    return {
      success: true,
      message: `Page for "${removed.name}" torn out and removed from Rolodex.`,
      data: { id: removed._id, name: removed.name },
    };
  },

  seedContacts: async (force = false) => {
    if (force) {
      localService.saveStore(sampleContacts);
      return {
        success: true,
        message: `Rolodex stocked with ${sampleContacts.length} vintage contacts!`,
        count: sampleContacts.length,
        data: sampleContacts,
      };
    }
    const current = localService.getStore();
    return {
      success: true,
      message: `Rolodex contains ${current.length} contacts.`,
      count: current.length,
      data: current,
    };
  },

  getTags: async () => {
    const list = localService.getStore();
    const counts = {};
    list.forEach((c) => {
      (c.tags || []).forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });

    const tags = Object.keys(counts)
      .map((name) => ({ name, count: counts[name] }))
      .sort((a, b) => b.count - a.count);

    return { success: true, data: tags };
  },
};

// Check if running in a static web environment (e.g. GitHub Pages)
const isGitHubPages =
  typeof window !== 'undefined' &&
  (window.location.hostname.includes('github.io') ||
    window.location.protocol === 'file:');

// Dedicated Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        success: false,
        message: 'Unable to reach backend server.',
        isNetworkError: true,
      });
    }
    const { status, data } = error.response;
    return Promise.reject({
      success: false,
      status,
      message: data?.message || 'An error occurred.',
      errors: data?.errors || {},
    });
  }
);

// Hybrid API wrapper: Uses backend REST API when available, seamlessly falls back to LocalStorage
export const contactApi = {
  getContacts: async (params = {}) => {
    if (isGitHubPages) return localService.getContacts(params);
    try {
      return await apiClient.get('/contacts', { params });
    } catch (err) {
      if (err.isNetworkError) return localService.getContacts(params);
      throw err;
    }
  },

  getContact: async (id) => {
    if (isGitHubPages) return localService.getContact(id);
    try {
      return await apiClient.get(`/contacts/${id}`);
    } catch (err) {
      if (err.isNetworkError) return localService.getContact(id);
      throw err;
    }
  },

  createContact: async (data) => {
    if (isGitHubPages) return localService.createContact(data);
    try {
      return await apiClient.post('/contacts', data);
    } catch (err) {
      if (err.isNetworkError) return localService.createContact(data);
      throw err;
    }
  },

  updateContact: async (id, data) => {
    if (isGitHubPages) return localService.updateContact(id, data);
    try {
      return await apiClient.put(`/contacts/${id}`, data);
    } catch (err) {
      if (err.isNetworkError) return localService.updateContact(id, data);
      throw err;
    }
  },

  toggleFavorite: async (id) => {
    if (isGitHubPages) return localService.toggleFavorite(id);
    try {
      return await apiClient.patch(`/contacts/${id}/favorite`);
    } catch (err) {
      if (err.isNetworkError) return localService.toggleFavorite(id);
      throw err;
    }
  },

  deleteContact: async (id) => {
    if (isGitHubPages) return localService.deleteContact(id);
    try {
      return await apiClient.delete(`/contacts/${id}`);
    } catch (err) {
      if (err.isNetworkError) return localService.deleteContact(id);
      throw err;
    }
  },

  seedContacts: async (force = false) => {
    if (isGitHubPages) return localService.seedContacts(force);
    try {
      return await apiClient.post(`/contacts/seed${force ? '?force=true' : ''}`);
    } catch (err) {
      if (err.isNetworkError) return localService.seedContacts(force);
      throw err;
    }
  },

  getTags: async () => {
    if (isGitHubPages) return localService.getTags();
    try {
      return await apiClient.get('/contacts/tags/all');
    } catch (err) {
      if (err.isNetworkError) return localService.getTags();
      throw err;
    }
  },

  getHealth: async () => {
    if (isGitHubPages) return { success: true, status: 'healthy (github pages static)' };
    return await apiClient.get('/health');
  },
};

export default apiClient;
