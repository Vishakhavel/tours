const fs = require('fs');
let tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const checkID = (req, res, next, val) => {
  //   const id = Number(req.params.id);
  if (val > tours.length) {
    // we have to return here, to stop the req/response cycle. this will prevent the "cannot set headers after they are sent to the client error."
    return res
      .status(404)
      .json({ status: 'failed', message: 'tour not found with ID' });
  } else {
    next();
  }
};

const checkTourBody = (req, res, next) => {
  if (!req.body.name && !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message:
        'the body is invalid, and does not contain mandatory fields - name/price',
    });
  }
  next();
};

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
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) res.send(400);
      else {
        res.status(201).json({
          status: 'success',
          data: {
            tour: newTour,
          },
        });
      }
    }
  );
};

const getTour = (req, res) => {
  const id = Number(req.params.id);
  console.log('ID inside getTour', id);
  const tour = tours.find((tour) => tour.id === id);
  console.log({ tour });
  //   console.log({ tours });
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const updateTour = (req, res) => {
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

module.exports = {
  deleteTour,
  createTour,
  getTour,
  getAllTours,
  updateTour,
  checkID,
  checkTourBody,
};
