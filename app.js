const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// MIDDLEWARES
// these middlware apply to every single request
// express.json() is middleware for express
app.use(express.json());

// middlware to serve static files -> if you want to be able to server static files directly from folder
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  // just modifying the req object
  req.requestTime = new Date().toISOString();
  //   call next after you're done!
  next();
});
app.use((req, res, next) => {
  console.log('Hello from the middlware!!!');
  //   call next after you're done!
  next();
});
// 3rd party middleware to log
// morgan will return a function like (req, res, next) => {some logger connected...}
// had to install this as a dependency, not inbuilt library

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// app.route('/api/v1/users').get(getAllUsers).post(createUser);

module.exports = app;
