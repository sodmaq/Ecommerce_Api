const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);
const Order = require('../model/orderModel');
const User = require('../model/userModel');
const Cart = require('../model/cartModel'); 
const asyncHandler = require('express-async-handler');
const uniqid = require('uniqid');
const { validateMongoDbId } = require('../utils/validateMongoDbId');

// Function to initialize payment for an order
const initializePayment = asyncHandler(async (req, res) => {
  const { couponApplied } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const user = await User.findById(_id);
    let userCart = await Cart.findOne({ orderby: user._id });
    let finalAmount = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount;
    } else {
      finalAmount = userCart.cartTotal;
    }

    // Create the payment session with Paystack
    const session = await paystack.transaction.initialize({
      amount: finalAmount * 100, 
      email: req.user.email,
      reference: `order_${uniqid()}`, 
    });

    // Create a new Order document with the Paystack reference
    const newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: session.data.reference, // Use the Paystack reference as the payment intent ID
        method: 'Paystack', // 
        amount: finalAmount,
        status: 'Pending', // 
        created: Date.now(),
        currency: 'usd', // 
      },
      orderby: user._id,
      orderStatus: 'Not Processed', // Set initial order status to Pending
    }).save();

    // Respond with the session data and new order
    res.status(200).json({
      status: 'success',
      session: session.data,
      order: newOrder,
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

    if (!verifyResponse.data) {
      throw new Error('Invalid Paystack response');
    }

    if (verifyResponse.data.status === 'success') {
      // Payment is successful, update the order status in your database
      const order = await Order.findOneAndUpdate(
        { 'paymentIntent.id': reference },
        {
          $set: {
            orderStatus: 'Processing',
            'paymentIntent.status': 'Paid',
            paymentStatus: 'paid',
          },
        },
        { new: true }
      );

      if (!order) {
        throw new Error('Order not found');
      }

      // Additional actions like sending confirmation emails can go here

      res.status(200).json({
        message: 'Payment verified and order updated successfully',
        order,
      });
    } else if (verifyResponse.data.status === 'failed') {
      // Payment failed, update the order status or handle accordingly
      const order = await Order.findOneAndUpdate(
        { 'paymentIntent.id': reference },
        { $set: { orderStatus: 'Cancelled', paymentStatus: 'failed' } },
        { new: true }
      );

      if (!order) {
        throw new Error('Order not found');
      }

      res.status(400).json({
        error: 'Payment verification failed. Payment was not successful.',
        order,
      });
    } else {
      // Handle other status scenarios from Paystack if needed
      res.status(400).json({
        error:
          'Payment verification failed. Unknown payment status from Paystack.',
        data: verifyResponse.data,
      });
    }
  } catch (error) {
    // Handle specific errors and provide appropriate responses
    if (error.message === 'Order not found') {
      res
        .status(404)
        .json({ error: 'Order not found. Payment verification failed.' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

module.exports = {
  // Other functions from your userController.js file...

  initializePayment,
  verifyPayment,
};
