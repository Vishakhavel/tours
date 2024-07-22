const Tour = require('./../models/tourModel');

const getAllTours = async (req, res) => {
  try {
    // find will return an array of all the documents.
    // and will also convert them into js objects.
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      // good practice to send the length of the result, when the result is an array.
      result: tours.length,
      //   envelope the response inside an object
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

const createTour = async (req, res) => {
  // const newTour = new Tour({});
  // newTour.save()
  // you can directly create a document in the collection from the model.

  //   you can use the promise returned from the create, or use async await.
  // Tour.create({}).then()

  // try catch to handle errors in async await instead of .then, .catch in promises
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    console.log('Error occured in createTour', err);
    res.status(400).json({
      status: 'fail ',
      message: 'invalid data sent!',
    });
  }
};

const getTour = async (req, res) => {
  try {
    // findById -> finds document by ID passed in the param
    // same as Tour.findOne({_id: req.params.id})
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    console.log('Error occured in getTour', err);
    res.status(400).json({
      status: 'fail ',
      message: 'invalid data sent!',
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour: 'updated tour here!',
      },
    });
  } catch (err) {
    console.log('Error occured in createTour', err);
    res.status(400).json({
      status: 'fail ',
      message: 'invalid data sent!',
    });
  }
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
};
