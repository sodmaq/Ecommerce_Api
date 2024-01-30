const express = require('express');
const dotenv = require('dotenv');
const app = express();
const dbConnect = require('./config/dbConnect');
const PORT = process.env.PORT || 8000;
const productRouter = require('./routes/productRoute');
const authRouter = require('./routes/authRoute');
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

app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
