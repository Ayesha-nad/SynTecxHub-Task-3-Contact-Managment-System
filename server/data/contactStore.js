const crypto = require('crypto');
const sampleContacts = require('./sampleContacts');

// Generate MongoDB-compatible 24-character hex ObjectId
const generateObjectId = () => {
  return crypto.randomBytes(12).toString('hex');
};

// Initial seed data with simulated MongoDB ObjectIds and timestamps
let contactsStore = sampleContacts.map((c, i) => {
  const date = new Date(Date.now() - (sampleContacts.length - i) * 3600000);
  return {
    _id: generateObjectId(),
    ...c,
    createdAt: date.toISOString(),
    updatedAt: date.toISOString(),
    initials: c.name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase(),
  };
});

const contactStore = {
  // Find contacts with query & sort
  find: async ({ search, tag, favorite, sort = 'name-asc' } = {}) => {
    let list = [...contactsStore];

    // Filter by tag
    if (tag && tag !== 'All') {
      list = list.filter((c) => (c.tags || []).includes(tag));
    }

    // Filter by favorite
    if (favorite === 'true' || favorite === true) {
      list = list.filter((c) => c.isFavorite);
    }

    // Search query across name, email, phone, company, address, jobTitle, notes
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((c) => {
        return (
          (c.name && c.name.toLowerCase().includes(q)) ||
          (c.email && c.email.toLowerCase().includes(q)) ||
          (c.phone && c.phone.toLowerCase().includes(q)) ||
          (c.company && c.company.toLowerCase().includes(q)) ||
          (c.address && c.address.toLowerCase().includes(q)) ||
          (c.jobTitle && c.jobTitle.toLowerCase().includes(q)) ||
          (c.notes && c.notes.toLowerCase().includes(q)) ||
          (c.tags && c.tags.some((t) => t.toLowerCase().includes(q)))
        );
      });
    }

    // Sort contacts
    list.sort((a, b) => {
      if (sort === 'name-asc') return (a.name || '').localeCompare(b.name || '');
      if (sort === 'name-desc') return (b.name || '').localeCompare(a.name || '');
      if (sort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === 'company') return (a.company || '').localeCompare(b.company || '');
      return 0;
    });

    return list;
  },

  // Find single contact by ID
  findById: async (id) => {
    return contactsStore.find((c) => c._id === id) || null;
  },

  // Find one contact matching criteria (e.g. email)
  findOne: async (query) => {
    return (
      contactsStore.find((c) => {
        if (query.email && c.email.toLowerCase() === query.email.toLowerCase()) {
          if (query._id && query._id.$ne && c._id === query._id.$ne) {
            return false;
          }
          return true;
        }
        return false;
      }) || null
    );
  },

  // Count documents
  countDocuments: async () => {
    return contactsStore.length;
  },

  // Create new contact
  create: async (data) => {
    const now = new Date().toISOString();
    const initials = (data.name || '')
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const newContact = {
      _id: generateObjectId(),
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      address: data.address || '',
      company: data.company || '',
      jobTitle: data.jobTitle || '',
      tags: data.tags && data.tags.length > 0 ? data.tags : ['General'],
      notes: data.notes || '',
      isFavorite: Boolean(data.isFavorite),
      avatarColor: data.avatarColor || '#7a8c6f',
      createdAt: now,
      updatedAt: now,
      initials,
    };

    contactsStore.unshift(newContact);
    return newContact;
  },

  // Update existing contact
  findByIdAndUpdate: async (id, data) => {
    const index = contactsStore.findIndex((c) => c._id === id);
    if (index === -1) return null;

    const existing = contactsStore[index];
    const now = new Date().toISOString();
    const initials = (data.name || existing.name)
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const updated = {
      ...existing,
      ...data,
      email: (data.email || existing.email).toLowerCase(),
      updatedAt: now,
      initials,
    };

    contactsStore[index] = updated;
    return updated;
  },

  // Delete contact by ID
  findByIdAndDelete: async (id) => {
    const index = contactsStore.findIndex((c) => c._id === id);
    if (index === -1) return null;
    const deleted = contactsStore.splice(index, 1)[0];
    return deleted;
  },

  // Seed / Reset sample contacts
  seed: async (force = false) => {
    if (contactsStore.length > 0 && !force) {
      return contactsStore;
    }

    contactsStore = sampleContacts.map((c, i) => {
      const date = new Date(Date.now() - (sampleContacts.length - i) * 3600000);
      return {
        _id: generateObjectId(),
        ...c,
        createdAt: date.toISOString(),
        updatedAt: date.toISOString(),
        initials: c.name
          .trim()
          .split(/\s+/)
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase(),
      };
    });

    return contactsStore;
  },

  // Get distinct tags with counts
  getTags: async () => {
    const counts = {};
    contactsStore.forEach((c) => {
      (c.tags || []).forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });

    return Object.keys(counts)
      .map((name) => ({ name, count: counts[name] }))
      .sort((a, b) => b.count - a.count);
  },
};

module.exports = contactStore;
