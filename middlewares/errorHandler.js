// not found

const notFound = (req, res, next) => {
  const error = new Error(`Not Found:${req.originalUrl}`);
  res.status(404);
  next(error);
};

//Error Handler

const errorHandler = (err, req, res, next) => {
  const statuscode = res.statusCode == 200 ? 500 : res.statusCode;
  res.status(statuscode);
  res.json({
    message: err?.message,
    stack: err?.stack,
  });
};

module.exports = { errorHandler, notFound };


// // Not Found Middleware
// const notFound = (req, res, next) => {
//     const error = new Error(`Not Found: ${req.originalUrl}`);
//     res.status(404);
//     next(error);
//   };
  
//   // Generic Error Handler Middleware
//   const errorHandler = (err, req, res, next) => {
//     const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//     res.status(statusCode);
  
//     // Customize the response based on the error type
//     if (err.name === 'ValidationError') {
//       res.json({
//         message: 'Validation Error',
//         errors: err.errors,
//       });
//     } else if (err.name === 'MongoError' && err.code === 11000) {
//       res.json({
//         message: 'Duplicate Key Error',
//         key: err.keyValue,
//       });
//     } else {
//       res.json({
//         message: err?.message || 'Internal Server Error',
//         stack: process.env.NODE_ENV === 'production' ? undefined : err?.stack,
//       });
//     }
//   };
  
//   module.exports = { errorHandler, notFound };
  