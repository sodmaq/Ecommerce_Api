const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const {
  createUser,
  loginUser,
  getAllUser,
  getAUser,
  deleteAUser,
  updateUser,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logout,
  updatePassword,
} = require('../controller/userController');

router.post('/register', createUser);
router.put('/updatePassword', authMiddleware, updatePassword);
router.post('/login', loginUser);
router.get('/all-users', getAllUser);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logout);
router.get('/:id', authMiddleware, isAdmin, getAUser);
router.delete('/:id', deleteAUser);
router.put('/:id', authMiddleware, updateUser);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unBlockUser);

module.exports = router;
