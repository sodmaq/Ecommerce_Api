const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const client = require('../redis');
const {
  createUser,
  loginUser,
  loginAdmin,
  getAllUser,
  getAUser,
  deleteAUser,
  updateUser,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPassword,
  resetPassword,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrder,
  getAllOrders,
  updateOrderStatus
} = require('../controller/userController');

router.post('/register', createUser);
router.put('/updatePassword', authMiddleware, updatePassword);
router.post('/forgotPassword', forgotPassword);
router.put('/resetPassword/:token', resetPassword);
router.post('/login', loginUser);
router.post('/admin-login', loginAdmin);
// routes/userRoutes.js

router.get('/all-users', async (req, res) => {
  const cacheKey = 'all_users';

  console.log('Before Redis get');

  client.get(cacheKey, async (err, cachedData) => {
    if (err) {
      console.error('Redis error:', err);
      return res.status(500).send('Internal Server Error');
    }

    console.log('After Redis get');

    if (cachedData) {
      return res.json({ users: JSON.parse(cachedData) });
    }

    try {
      const users = await getAllUser();

      console.log('Fetched users:', users);

      client.setex(cacheKey, 60, JSON.stringify(users));

      return res.json({ users });
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).send('Internal Server Error');
    }
  });
});

router.get('/wishList', authMiddleware, getWishlist);
router.post('/cart', authMiddleware, userCart);
router.get('/cart', authMiddleware, getUserCart);
router.delete('/empty', authMiddleware, emptyCart);
router.post('/applyCoupon', authMiddleware, applyCoupon);
router.post('/cart/cash-order', authMiddleware, createOrder);
router.get('/get-order', authMiddleware, getOrder);
router.get('/get-AllOrders', authMiddleware, getAllOrders);
router.put('/save-address', authMiddleware, saveAddress);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logout);
router.get('/:id', authMiddleware, isAdmin, getAUser);
router.delete('/:id', deleteAUser);
router.put('/:id', authMiddleware, updateUser);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unBlockUser);
router.put('/update-order/:id', authMiddleware, isAdmin, updateOrderStatus);

module.exports = router;
