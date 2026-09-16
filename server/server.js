const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectDB, getDBStatus } = require('./config/db');
const contactRoutes = require('./routes/contacts');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const Contact = require('./models/Contact');
const sampleContacts = require('./data/sampleContacts');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (with in-memory fallback)
connectDB().then(async () => {
  try {
    const { isConnected } = getDBStatus();
    if (isConnected) {
      // Check if Rolodex is empty; if so, populate with rich sample contacts
      const count = await Contact.countDocuments();
      if (count === 0) {
        console.log('📖 [Seed] Empty Rolodex detected. Populating initial vintage contacts...');
        await Contact.insertMany(sampleContacts);
        console.log(`✅ [Seed] Successfully added ${sampleContacts.length} contacts to Rolodex!`);
      }
    }
  } catch (seedErr) {
    console.warn('⚠️ [Seed] Auto-seed warning:', seedErr.message);
  }
});

// Middleware
app.use(
  cors({
    origin: '*', // Allow all origins in dev or specify client URL
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request logging (morgan)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    system: 'Analog Rolodex API Service',
    time: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/contacts', contactRoutes);

// 404 & Global Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start listening
const server = app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`📜 [Rolodex Server] Running on http://localhost:${PORT}`);
  console.log(`📚 [API Base] http://localhost:${PORT}/api/contacts`);
  console.log(`🩺 [Health Check] http://localhost:${PORT}/api/health`);
  console.log(`======================================================\n`);
});

module.exports = { app, server };
