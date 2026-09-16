import { useState, useEffect, useCallback, useMemo } from 'react';
import { contactApi } from '../services/api';

export const useContacts = (showToast) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search, Filter & Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [sortOption, setSortOption] = useState('name-asc');
  const [viewMode, setViewMode] = useState('rolodex'); // 'rolodex' | 'grid'

  // Modal Dialog States
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [viewingContact, setViewingContact] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

  // Fetch all contacts from API
  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await contactApi.getContacts();
      if (response && response.data) {
        setContacts(response.data);
      }
    } catch (err) {
      console.error('Failed to load contacts:', err);
      setError(err.message || 'Failed to load contacts from Rolodex.');
      if (showToast) {
        showToast(err.message || 'Error connecting to database.', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Initial load
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Create new contact
  const handleCreateContact = async (formData) => {
    try {
      const response = await contactApi.createContact(formData);
      if (response && response.data) {
        setContacts((prev) => [response.data, ...prev]);
        setIsAddEditOpen(false);
        if (showToast) {
          showToast(`"${response.data.name}" inscribed in your Rolodex!`, 'success');
        }
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.message || 'Failed to save contact.',
        errors: err.errors || {},
      };
    }
  };

  // Update existing contact
  const handleUpdateContact = async (id, formData) => {
    try {
      const response = await contactApi.updateContact(id, formData);
      if (response && response.data) {
        setContacts((prev) =>
          prev.map((c) => (c._id === id ? response.data : c))
        );
        if (viewingContact && viewingContact._id === id) {
          setViewingContact(response.data);
        }
        setIsAddEditOpen(false);
        setEditingContact(null);
        if (showToast) {
          showToast(`Ledger updated for "${response.data.name}".`, 'success');
        }
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.message || 'Failed to update contact.',
        errors: err.errors || {},
      };
    }
  };

  // Toggle favorite star
  const handleToggleFavorite = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      // Optimistic UI update
      setContacts((prev) =>
        prev.map((c) => (c._id === id ? { ...c, isFavorite: !c.isFavorite } : c))
      );
      if (viewingContact && viewingContact._id === id) {
        setViewingContact((prev) => ({ ...prev, isFavorite: !prev.isFavorite }));
      }

      const response = await contactApi.toggleFavorite(id);
      if (showToast && response) {
        showToast(response.message, 'success');
      }
    } catch (err) {
      // Rollback on error
      fetchContacts();
      if (showToast) {
        showToast(err.message || 'Failed to update favorite status.', 'error');
      }
    }
  };

  // Delete contact (tear out page)
  const handleDeleteContact = async (id) => {
    try {
      const contactName = contactToDelete?.name || 'Contact';
      await contactApi.deleteContact(id);

      setContacts((prev) => prev.filter((c) => c._id !== id));
      setIsDeleteOpen(false);
      setContactToDelete(null);
      if (viewingContact && viewingContact._id === id) {
        setViewingContact(null);
      }

      if (showToast) {
        showToast(`Page for "${contactName}" torn out and removed.`, 'coral');
      }
    } catch (err) {
      if (showToast) {
        showToast(err.message || 'Failed to remove contact.', 'error');
      }
    }
  };

  // Seed sample vintage contacts
  const handleSeedContacts = async (force = false) => {
    setLoading(true);
    try {
      const response = await contactApi.seedContacts(force);
      if (response && response.data) {
        setContacts(response.data);
        if (showToast) {
          showToast(response.message || 'Rolodex populated with sample contacts!', 'success');
        }
      }
    } catch (err) {
      if (showToast) {
        showToast(err.message || 'Failed to seed sample contacts.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Compute distinct tags and counts
  const availableTags = useMemo(() => {
    const counts = {};
    contacts.forEach((c) => {
      (c.tags || []).forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });

    const list = Object.keys(counts).map((name) => ({
      name,
      count: counts[name],
    }));

    return list.sort((a, b) => b.count - a.count);
  }, [contacts]);

  // Compute filtered & sorted contacts
  const filteredContacts = useMemo(() => {
    let result = [...contacts];

    // Filter by tag
    if (selectedTag && selectedTag !== 'All') {
      result = result.filter((c) => (c.tags || []).includes(selectedTag));
    }

    // Filter by favorite
    if (favoriteOnly) {
      result = result.filter((c) => c.isFavorite);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((c) => {
        return (
          (c.name && c.name.toLowerCase().includes(query)) ||
          (c.email && c.email.toLowerCase().includes(query)) ||
          (c.phone && c.phone.toLowerCase().includes(query)) ||
          (c.company && c.company.toLowerCase().includes(query)) ||
          (c.address && c.address.toLowerCase().includes(query)) ||
          (c.notes && c.notes.toLowerCase().includes(query)) ||
          (c.tags && c.tags.some((t) => t.toLowerCase().includes(query)))
        );
      });
    }

    // Sort contacts
    result.sort((a, b) => {
      if (sortOption === 'name-asc') return (a.name || '').localeCompare(b.name || '');
      if (sortOption === 'name-desc') return (b.name || '').localeCompare(a.name || '');
      if (sortOption === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOption === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortOption === 'company') return (a.company || '').localeCompare(b.company || '');
      return 0;
    });

    return result;
  }, [contacts, selectedTag, favoriteOnly, searchQuery, sortOption]);

  return {
    contacts,
    filteredContacts,
    availableTags,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    favoriteOnly,
    setFavoriteOnly,
    sortOption,
    setSortOption,
    viewMode,
    setViewMode,
    isAddEditOpen,
    setIsAddEditOpen,
    editingContact,
    setEditingContact,
    viewingContact,
    setViewingContact,
    isDeleteOpen,
    setIsDeleteOpen,
    contactToDelete,
    setContactToDelete,
    fetchContacts,
    createContact: handleCreateContact,
    updateContact: handleUpdateContact,
    deleteContact: handleDeleteContact,
    toggleFavorite: handleToggleFavorite,
    seedContacts: handleSeedContacts,
  };
};
