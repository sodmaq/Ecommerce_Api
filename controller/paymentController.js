const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);
const Order = require('../model/orderModel');
const Cart = require('../model/cartModel'); // Add this line to import Cart
const asyncHandler = require('express-async-handler');
const uniqid = require('uniqid');
const { validateMongoDbId } = require('../utils/validateMongoDbId');

// Function to initialize payment for an order
const initializePayment = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const userCart = await Cart.findOne({ orderby: _id });

    if (!userCart) {
      throw new Error('Cart not found for the user');
    }

    const { cartTotal } = userCart;
    if (cartTotal === null) {
      throw new Error('Cart total is null');
    }

    // Create the payment session with Paystack
    const session = await paystack.transaction.initialize({
      amount: cartTotal * 100, // Paystack expects amount in kobo
      email: req.user.email,
      reference: `order_${uniqid()}`, // You can customize the reference as needed
    });

    // Respond with the session data
    res.status(200).json({
      status: 'success',
      session,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Function to verify payment for an order
const verifyPayment = asyncHandler(async (req, res) => {
  const { reference } = req.body;

  try {
    // Verify the payment with Paystack using the provided reference
    const verifyResponse = await paystack.transaction.verify(reference);

    // Handle the verification response
    if (verifyResponse.data.status === 'success') {
      // Payment is successful, update the order status in your database
      // For example, you might have an Order model where you update the status
      // Here we're assuming you have a similar setup
      const order = await Order.findOneAndUpdate(
        { reference: reference },
        { status: 'paid' },
        { new: true }
      );

      // You can perform other actions here, like sending confirmation emails, etc.

      res.status(200).json({ message: 'Payment verified successfully', order });
    } else {
      // Payment was not successful, handle accordingly
      res.status(400).json({ error: 'Payment verification failed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
  // Other functions from your userController.js file...

  initializePayment,
  verifyPayment,
};
