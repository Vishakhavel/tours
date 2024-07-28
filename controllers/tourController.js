const Tour = require('./../models/tourModel');

const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price ratingAverage';
  req.query.fields = 'name,price,summary,ratingAverage,summary,difficulty';
  next();
};

const APIFeatures = require('../utils/apiFeatures');

const getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    console.log('features inside', features);
    const tours = await features.query;

    console.log({ length: tours.length });

    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    console.log('error from getAllTours', err);
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    console.log({ newTour });
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
      runValidators: true,
    });

    await tour.save();
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    console.log('Error occured in updateTour', err);
    res.status(400).json({
      status: 'fail ',
      message: 'invalid data sent!',
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res
      .status(204)
      .json({ status: 'success', message: 'deleted tour successfully' });
  } catch (err) {
    console.log('Error occured in deleteTour', err);
    res.status(400).json({
      status: 'fail ',
      message: 'invalid data sent!',
    });
  }
};

module.exports = {
  deleteTour,
  createTour,
  getTour,
  getAllTours,
  updateTour,
  aliasTopTours,
};
