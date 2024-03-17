const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
// const util = require('util');
// const { createClient } = require('redis');
const dbConnect = require('./config/dbConnect');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// // Set up Redis client
// const redisUrl = 'redis://127.0.0.1:6379';
// const client = createClient(redisUrl);
// client.on('error', (err) => console.log('Redis Client Error', err));
// client.set = util.promisify(client.set);

// Connect to database
dbConnect();

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
const productRouter = require('./routes/productRoute');
const authRouter = require('./routes/authRoute');
const blogRouter = require('./routes/blogRoute');
const categoryRouter = require('./routes/prodCategoryRoute');
const blogCatRouter = require('./routes/blogCatRoute');
const brandRouter = require('./routes/brandRoute');
const couponRouter = require('./routes/couponRoute');
const uploadRouter = require('./routes/uploadRoute');

// /red POST endpoint
// app.post('/red', async (req, res) => {
//   const { key, value } = req.body;
//   console.log('Received request to set key:', key, 'with value:', value);

//   try {
//     const response = await client.set(key, value);
//     console.log('Redis set response:', response);
//     res.json(response);
//   } catch (error) {
//     console.error('Error setting key-value pair in Redis:', error);
//     res
//       .status(500)
//       .json({ error: 'An error occurred while setting the key-value pair.' });
//   }
// });
app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);
app.use('/api/category', categoryRouter);
app.use('/api/blogCategory', blogCatRouter);
app.use('/api/brand', brandRouter);
app.use('/api/coupon', couponRouter);
app.use('/api/upload', uploadRouter);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Redis client error handling
// client.on('error', (error) => {
//   console.error('Redis client error:', error);
// });
