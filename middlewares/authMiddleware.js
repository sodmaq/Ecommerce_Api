const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error('not authorized token expired, please login again');
    }
  } else {
    throw new Error('there is no token attached to this head');
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  try {
    
    const userId = req.user._id;
    const adminUser = await User.findById(userId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'You are not an Admin',
      });
    } else {
      next();
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { authMiddleware, isAdmin };
