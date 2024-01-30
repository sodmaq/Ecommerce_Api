const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const connectDB = async () => {
  try {
    const DB = process.env.DATABASE;
    await mongoose.connect(DB, {
      useNewUrlParser: true,
    });
    console.log('DB connection successfully...');
  } catch (error) {
    console.error('DB connection failed:', error.message);
  }
};

module.exports = connectDB;
