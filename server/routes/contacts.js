const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const contactStore = require('../data/contactStore');
const sampleContacts = require('../data/sampleContacts');
const { getDBStatus } = require('../config/db');
const {
  contactValidationRules,
  validateObjectId,
  handleValidationErrors,
} = require('../middleware/validate');

/**
 * Helper to determine whether to use Mongoose or In-Memory Store
 */
const useMongoose = () => getDBStatus().isConnected;

/**
 * @route   GET /api/contacts
 * @desc    Get all contacts with search, tag filtering, favorite filtering, and sorting
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const { search, tag, favorite, sort = 'name-asc' } = req.query;

    if (useMongoose()) {
      const filter = {};
      if (tag && tag !== 'All') filter.tags = tag;
      if (favorite === 'true') filter.isFavorite = true;

      if (search && search.trim() !== '') {
        const searchRegex = new RegExp(search.trim(), 'i');
        filter.$or = [
          { name: searchRegex },
          { email: searchRegex },
          { phone: searchRegex },
          { company: searchRegex },
          { address: searchRegex },
          { jobTitle: searchRegex },
          { notes: searchRegex },
        ];
      }

      let sortOptions = { name: 1 };
      if (sort === 'name-desc') sortOptions = { name: -1 };
      else if (sort === 'newest') sortOptions = { createdAt: -1 };
      else if (sort === 'oldest') sortOptions = { createdAt: 1 };
      else if (sort === 'company') sortOptions = { company: 1, name: 1 };

      const contacts = await Contact.find(filter).sort(sortOptions);
      const totalCount = await Contact.countDocuments();

      return res.status(200).json({
        success: true,
        count: contacts.length,
        total: totalCount,
        data: contacts,
      });
    }

    // In-Memory store fallback
    const contacts = await contactStore.find({ search, tag, favorite, sort });
    const totalCount = await contactStore.countDocuments();

    res.status(200).json({
      success: true,
      count: contacts.length,
      total: totalCount,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/contacts/tags/all
 * @desc    Get all distinct tags and their counts
 * @access  Public
 */
router.get('/tags/all', async (req, res, next) => {
  try {
    if (useMongoose()) {
      const tags = await Contact.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
      ]);
      const formattedTags = tags.map((t) => ({ name: t._id, count: t.count }));
      return res.status(200).json({
        success: true,
        data: formattedTags,
      });
    }

    const tags = await contactStore.getTags();
    res.status(200).json({
      success: true,
      data: tags,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/contacts/:id
 * @desc    Get single contact by ID
 * @access  Public
 */
router.get('/:id', validateObjectId, handleValidationErrors, async (req, res, next) => {
  try {
    const contact = useMongoose()
      ? await Contact.findById(req.params.id)
      : await contactStore.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: `Contact entry not found in Rolodex with ID: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/contacts
 * @desc    Create a new contact with full validation
 * @access  Public
 */
router.post('/', contactValidationRules, handleValidationErrors, async (req, res, next) => {
  try {
    const { name, email, phone, address, company, jobTitle, tags, notes, isFavorite, avatarColor } =
      req.body;

    // Check duplicate email explicitly
    const existing = useMongoose()
      ? await Contact.findOne({ email: email.toLowerCase() })
      : await contactStore.findOne({ email: email.toLowerCase() });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `A contact with the email '${email}' is already filed in your Rolodex.`,
        errors: {
          email: 'This email is already in use by another contact.',
        },
      });
    }

    // Process tags array
    let processedTags = ['General'];
    if (Array.isArray(tags) && tags.length > 0) {
      processedTags = tags.map((t) => t.trim()).filter(Boolean);
    } else if (typeof tags === 'string' && tags.trim()) {
      processedTags = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const payload = {
      name,
      email: email.toLowerCase(),
      phone,
      address: address || '',
      company: company || '',
      jobTitle: jobTitle || '',
      tags: processedTags.length > 0 ? processedTags : ['General'],
      notes: notes || '',
      isFavorite: isFavorite === true || isFavorite === 'true',
      avatarColor: avatarColor || '#7a8c6f',
    };

    const savedContact = useMongoose()
      ? await new Contact(payload).save()
      : await contactStore.create(payload);

    res.status(201).json({
      success: true,
      message: `"${savedContact.name}" was successfully inscribed into your Rolodex.`,
      data: savedContact,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/contacts/:id
 * @desc    Update an existing contact by ID
 * @access  Public
 */
router.put(
  '/:id',
  validateObjectId,
  contactValidationRules,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { name, email, phone, address, company, jobTitle, tags, notes, isFavorite, avatarColor } =
        req.body;

      // Check duplicate email for other contacts
      const duplicate = useMongoose()
        ? await Contact.findOne({
            email: email.toLowerCase(),
            _id: { $ne: req.params.id },
          })
        : await contactStore.findOne({
            email: email.toLowerCase(),
            _id: { $ne: req.params.id },
          });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: `The email address '${email}' is already used by "${duplicate.name}".`,
          errors: {
            email: 'This email is already in use by another contact.',
          },
        });
      }

      // Process tags array
      let processedTags = ['General'];
      if (Array.isArray(tags) && tags.length > 0) {
        processedTags = tags.map((t) => t.trim()).filter(Boolean);
      } else if (typeof tags === 'string' && tags.trim()) {
        processedTags = tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
      }

      const updateData = {
        name,
        email: email.toLowerCase(),
        phone,
        address: address || '',
        company: company || '',
        jobTitle: jobTitle || '',
        tags: processedTags.length > 0 ? processedTags : ['General'],
        notes: notes || '',
        isFavorite: isFavorite === true || isFavorite === 'true',
        ...(avatarColor && { avatarColor }),
      };

      const updatedContact = useMongoose()
        ? await Contact.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
          })
        : await contactStore.findByIdAndUpdate(req.params.id, updateData);

      if (!updatedContact) {
        return res.status(404).json({
          success: false,
          message: `Cannot update: Contact with ID ${req.params.id} does not exist.`,
        });
      }

      res.status(200).json({
        success: true,
        message: `Ledger entry for "${updatedContact.name}" updated successfully.`,
        data: updatedContact,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   PATCH /api/contacts/:id/favorite
 * @desc    Toggle favorite star on a contact
 * @access  Public
 */
router.patch('/:id/favorite', validateObjectId, handleValidationErrors, async (req, res, next) => {
  try {
    if (useMongoose()) {
      const contact = await Contact.findById(req.params.id);
      if (!contact) {
        return res.status(404).json({
          success: false,
          message: `Contact not found with ID: ${req.params.id}`,
        });
      }
      contact.isFavorite = !contact.isFavorite;
      await contact.save();
      return res.status(200).json({
        success: true,
        message: contact.isFavorite
          ? `Pinned "${contact.name}" to favorites.`
          : `Removed "${contact.name}" from favorites.`,
        data: contact,
      });
    }

    const contact = await contactStore.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: `Contact not found with ID: ${req.params.id}`,
      });
    }

    const updated = await contactStore.findByIdAndUpdate(req.params.id, {
      isFavorite: !contact.isFavorite,
    });

    res.status(200).json({
      success: true,
      message: updated.isFavorite
        ? `Pinned "${updated.name}" to favorites.`
        : `Removed "${updated.name}" from favorites.`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/contacts/:id
 * @desc    Delete a contact by ID (tear out page)
 * @access  Public
 */
router.delete('/:id', validateObjectId, handleValidationErrors, async (req, res, next) => {
  try {
    const contact = useMongoose()
      ? await Contact.findByIdAndDelete(req.params.id)
      : await contactStore.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: `Cannot delete: Contact with ID ${req.params.id} not found in Rolodex.`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Page for "${contact.name}" torn out and removed from Rolodex.`,
      data: {
        id: contact._id,
        name: contact.name,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/contacts/seed
 * @desc    Seed sample contacts into the database
 * @access  Public
 */
router.post('/seed', async (req, res, next) => {
  try {
    if (useMongoose()) {
      const count = await Contact.countDocuments();
      if (count > 0 && req.query.force !== 'true') {
        const existingContacts = await Contact.find().sort({ name: 1 });
        return res.status(200).json({
          success: true,
          message: `Rolodex already contains ${count} contacts. (Use force=true to reload).`,
          count,
          data: existingContacts,
        });
      }

      if (req.query.force === 'true') {
        await Contact.deleteMany({});
      }

      const inserted = await Contact.insertMany(sampleContacts);
      return res.status(201).json({
        success: true,
        message: `Rolodex stocked with ${inserted.length} vintage contacts!`,
        count: inserted.length,
        data: inserted,
      });
    }

    const data = await contactStore.seed(req.query.force === 'true');
    res.status(201).json({
      success: true,
      message: `Rolodex stocked with ${data.length} vintage contacts!`,
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
