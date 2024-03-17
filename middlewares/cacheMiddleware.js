const client = require('../redis');
const util = require('util');
client.get = util.promisify(client.get);

const cacheMiddleware = async (req, res, next) => {
  const cacheKey = 'all-users';

  console.log('Before Redis get');

  try {
    const cachedData = await client.get(cacheKey);

    console.log('After Redis get');

    if (cachedData) {
      const users = JSON.parse(cachedData);
      return res.json({ users });
    } else {
      next();
    }
  } catch (error) {
    console.error('Redis error:', error);
  }
};

module.exports = { cacheMiddleware };
