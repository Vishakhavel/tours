const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

// MIDDLEWARES
// these middlware apply to every single request
// express.json() is middleware for express
app.use(express.json());
// every middleware has access to req, res and a third param called next.
app.use((req, res, next) => {
  console.log('Hello from the middlware!!!');
  //   call next after you're done!
  next();
});

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
app.use(morgan('dev'));

// convert json to js object
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// ROUTES HANDLERS
// api versioning.

const getAllTours = (req, res) => {
  // this function is called the route handler.
  console.log('requestedAt injected from the middlware', req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    // good practice to send the length of the result, when the result is an array.
    result: tours.length,
    //   envelope the response inside an object
    data: {
      tours,
    },
  });
};

const createTour = (req, res) => {
  // req body is only available cos we used express.json() middleware. commenting this middleware out will give undefined for the bloew log.
  console.log('req body from post call', req.body);
  const newId = tours[tours.length - 1].id + 1;
  //   combine 2 objects
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  //   inside the callback, we should never use sync code and block the event loop!
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) res.send(400);
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const getTour = (req, res) => {
  const id = Number(req.params.id);

  if (id > tours.length)
    res
      .status(404)
      .json({ status: 'failed', message: 'tour not found with ID' });
  const tour = tours.find((tour) => tour.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const updateTour = (req, res) => {
  const id = Number(req.params.id);
  if (!id)
    res
      .status(404)
      .json({ status: 'failed', message: 'tour not found with ID' });
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'updated tour here!',
    },
  });
};

const deleteTour = (req, res) => {
  res.status(204).json({ status: 'success', data: null });
};

const getAllUsers = (req, res) => {
  res.status(500).json({ status: 'fail', message: 'this route is under dev!' });
};
const getUser = (req, res) => {
  res.status(500).json({ status: 'fail', message: 'this route is under dev!' });
};
const createUser = (req, res) => {
  res.status(500).json({ status: 'fail', message: 'this route is under dev!' });
};
const updateUser = (req, res) => {
  res.status(500).json({ status: 'fail', message: 'this route is under dev!' });
};
const deleteUser = (req, res) => {
  res.status(500).json({ status: 'fail', message: 'this route is under dev!' });
};

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);

// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// ROUTES

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app.route('/api/v1/tour/:id').get(getTour).patch(updateTour).delete(deleteTour);

app.route('/api/v1/users').get(getAllUsers).post(createUser);
app.route('/api/v1/user/:id').get(getUser).patch(updateUser).delete(deleteUser);

//   START SERVER

const port = 3000;
app.listen(port, () => {
  console.log('app running on port', port);
});
