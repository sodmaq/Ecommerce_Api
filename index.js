const express = require('express');
const dotenv = require('dotenv');
const app = express();
const dbConnect = require('./config/dbConnect');
const PORT = process.env.PORT || 8000;
const productRouter = require('./routes/productRoute');
const authRouter = require('./routes/authRoute');
const blogRouter = require('./routes/blogRoute');
const categoryRouter = require('./routes/prodCategoryRoute');
const blogCatRouter = require('./routes/blogCatRoute');
const brandRouter = require('./routes/brandRoute');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const morgan = require('morgan');
dbConnect();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);
app.use('/api/category', categoryRouter);
app.use('/api/blogCategory', blogCatRouter);
app.use('/api/brand', brandRouter);

app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
