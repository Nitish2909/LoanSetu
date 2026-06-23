const mongoose = require('mongoose');
const ensureDefaultAdmin = require('../utils/ensureDefaultAdmin');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    await ensureDefaultAdmin();
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;