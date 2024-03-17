const redis = require('redis');

// Create Redis client
const client = redis.createClient();

// Check for Redis connection errors
client.on('error', err => {
  console.error('Redis client error:', err);
});

module.exports = client;
