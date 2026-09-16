const mongoose = require('mongoose');

let isConnected = false;
let isInMemoryMode = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rolodex_contacts';

  try {
    // Attempt connecting to the configured URI with a 1500ms timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 1500,
    });
    isConnected = true;
    console.log(`📜 [MongoDB] Connected to database: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (err) {
    isConnected = false;
    isInMemoryMode = true;
    console.warn(`⚠️ [MongoDB] Local connection to ${uri} not reachable (${err.message}).`);
    console.log(`✨ [Rolodex Storage] Activated built-in Zero-Latency In-Memory Rolodex Store with full CRUD, validation, search & tag indexing.`);
  }

  mongoose.connection.on('error', (err) => {
    console.error('❌ [MongoDB] Runtime connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.log('📴 [MongoDB] Disconnected.');
  });
};

const getDBStatus = () => ({
  isConnected,
  isInMemoryMode,
});

const disconnectDB = async () => {
  if (isConnected) {
    await mongoose.disconnect();
  }
};

module.exports = { connectDB, getDBStatus, disconnectDB };
